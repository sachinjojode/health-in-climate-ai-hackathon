import React, { useState, useEffect, useCallback } from 'react'
import { Message, FilterType } from '../types'
import { listMessages, markRead, loadSampleData } from '../data/adapter'
import { useToast } from '../components/Toast'
import TopWidgets from '../components/TopWidgets'
import InboxToolbar from '../components/InboxToolbar'
import InboxList from '../components/InboxList'
import RightPanel from '../components/RightPanel'
import CuraViasLogo from '../components/CuraViasLogo'

/**
 * Home page component - main application interface
 * Manages state for messages, filters, and the reading panel
 */
const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const { showToast } = useToast()

  // Load messages from adapter
  const loadMessages = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listMessages()
      setMessages(data)
    } catch (error) {
      console.error('Failed to load messages:', error)
      showToast('Failed to load messages', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  // Load sample data for development/testing
  const handleLoadSampleData = useCallback(() => {
    const sampleMessages = loadSampleData()
    setMessages(sampleMessages)
    showToast('Sample data loaded', 'success')
  }, [showToast])

  // Initial load
  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Handle message row click
  const handleOpenMessage = useCallback((message: Message) => {
    setSelectedMessage(message)
  }, [])

  // Handle close panel
  const handleClosePanel = useCallback(() => {
    setSelectedMessage(null)
  }, [])

  // Handle toggle read status
  const handleToggleRead = useCallback(async (messageId: string) => {
    try {
      // Update local state first for immediate UI feedback
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, read: !msg.read } : msg
      ))
      
      // Update selected message if it's the one being toggled
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, read: !prev.read } : null)
      }
      
      // Call adapter (no-op for now)
      await markRead(messageId)
      
      showToast(
        `Message ${messages.find(m => m.id === messageId)?.read ? 'marked as unread' : 'marked as read'}`,
        'success'
      )
    } catch (error) {
      console.error('Failed to toggle read status:', error)
      showToast('Failed to update message status', 'error')
      
      // Revert local state on error
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, read: !msg.read } : msg
      ))
    }
  }, [selectedMessage, messages, showToast])


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <CuraViasLogo size="lg" />
        </div>
      </header>

      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top widgets */}
        <TopWidgets />

        {/* Inbox section */}
        <div className="space-y-6">
          {/* Inbox header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Health Notifications</h1>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </div>
            )}
          </div>

          {/* Toolbar */}
          <InboxToolbar
            currentFilter={filter}
            onFilterChange={setFilter}
            onRefresh={loadMessages}
            onLoadSampleData={handleLoadSampleData}
          />

          {/* Message list */}
          <InboxList
            messages={messages}
            filter={filter}
            onOpenMessage={handleOpenMessage}
            onToggleRead={handleToggleRead}
          />
        </div>
      </div>

      {/* Reading panel */}
      <RightPanel
        message={selectedMessage}
        onClose={handleClosePanel}
        onToggleRead={handleToggleRead}
      />
    </div>
  )
}

export default Home
