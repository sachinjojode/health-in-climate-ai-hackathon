import React from 'react'
import { Message, FilterType } from '../types'
import MessageRow from './MessageRow'

interface InboxListProps {
  messages: Message[]
  filter: FilterType
  onOpenMessage: (message: Message) => void
  onToggleRead: (messageId: string) => void
}

/**
 * InboxList component displays the filtered list of messages
 * Shows empty state when no messages match the current filter
 */
const InboxList: React.FC<InboxListProps> = ({
  messages,
  filter,
  onOpenMessage,
  onToggleRead
}) => {
  // Filter messages based on current filter
  const filteredMessages = messages.filter((message) => {
    switch (filter) {
      case 'unread':
        return !message.read
      case 'low':
      case 'medium':
      case 'high':
        return message.risk === filter
      default:
        return true // 'all'
    }
  })

  // Show empty state if no messages
  if (filteredMessages.length === 0) {
    return (
      <div className="bg-white border border-cura-200 rounded-lg p-12 text-center">
        <div className="max-w-sm mx-auto">
          <svg
            className="w-16 h-16 text-cura-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
            />
          </svg>
          <h3 className="text-lg font-medium text-cura-800 mb-2">
            {messages.length === 0 ? 'No messages yet' : 'No messages match this filter'}
          </h3>
          <p className="text-cura-600 mb-4">
            {messages.length === 0 
              ? 'Connect your data source to start receiving health notifications.'
              : `No messages found for "${filter}" filter. Try a different filter.`
            }
          </p>
          {messages.length === 0 && (
            <div className="text-sm text-cura-500">
              <p>Once connected, you'll see:</p>
              <ul className="mt-2 space-y-1">
                <li>• Patient heat risk alerts</li>
                <li>• Health notifications</li>
                <li>• Routine health updates</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-cura-200 rounded-lg overflow-hidden">
      <div className="divide-y divide-cura-200">
        {filteredMessages.map((message) => (
          <MessageRow
            key={message.id}
            message={message}
            onOpen={onOpenMessage}
            onToggleRead={onToggleRead}
          />
        ))}
      </div>
    </div>
  )
}

export default InboxList
