import React, { useState, useRef, useEffect } from 'react'
import { Message } from '../types'

interface MessageRowProps {
  message: Message
  onOpen: (message: Message) => void
  onToggleRead: (messageId: string) => void
}

/**
 * MessageRow component displays a single message in the inbox list
 * Includes risk indicator, patient info, and action menu
 */
const MessageRow: React.FC<MessageRowProps> = ({
  message,
  onOpen,
  onToggleRead
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't open if clicking on the menu button or menu itself
    if ((e.target as HTMLElement).closest('[data-menu]')) {
      return
    }
    onOpen(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(message)
    }
  }

  return (
    <div
      className={`border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-colors focus-ring ${
        !message.read ? 'bg-blue-50/50' : ''
      }`}
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open message from ${message.patientName}`}
    >
      <div className="flex items-start gap-4">
        {/* Risk indicator dot */}
        <div className={`risk-dot ${message.risk} mt-1 flex-shrink-0`} />

        {/* Message content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-medium ${!message.read ? 'font-semibold' : ''}`}>
              {message.patientName} - {message.subject}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {message.preview}
          </p>
        </div>

        {/* Timestamp and menu */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500">
            {formatTimestamp(message.createdAt)}
          </span>
          
          {/* More menu */}
          <div className="relative" data-menu>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label="Message options"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div
                ref={menuRef}
                className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                role="menu"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleRead(message.id)
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  role="menuitem"
                >
                  {message.read ? 'Mark as unread' : 'Mark as read'}
                </button>
                <button
                  disabled
                  className="w-full px-4 py-2 text-left text-sm text-gray-400 cursor-not-allowed"
                  role="menuitem"
                >
                  Open in full page
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageRow
