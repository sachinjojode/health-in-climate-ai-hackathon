import React, { useState, useEffect } from 'react'
import { Message } from '../types'
import { getPatientNotifications } from '../data/adapter'

interface PatientNotificationWidgetProps {
  messages: Message[]
  onRefresh: () => void
  loading: boolean
}

/**
 * Patient Notification Widget - shows patient survey completions and risk alerts
 * Displays notifications when patients complete their condition assessments
 */
const PatientNotificationWidget: React.FC<PatientNotificationWidgetProps> = ({
  messages,
  onRefresh,
  loading
}) => {
  const [notifications, setNotifications] = useState<any[]>([])
  const [showAll, setShowAll] = useState(false)

  // Load patient notifications from API
  useEffect(() => {
    loadNotifications()
  }, [messages])

  const loadNotifications = async () => {
    try {
      const data = await getPatientNotifications()
      setNotifications(data)
    } catch (error) {
      console.error('Error loading notifications:', error)
      // Fallback to empty array on error
      setNotifications([])
    }
  }

  const unreadCount = notifications.filter(n => n.status === 'unread').length
  const highPriorityCount = notifications.filter(n => n.priority === 'high').length
  
  // Separate notifications into High and Medium-Low sections
  const highRiskNotifications = notifications.filter(n => n.risk === 'high' || n.priority === 'high')
  const mediumLowNotifications = notifications.filter(n => n.risk !== 'high' && n.priority !== 'high')

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const NotificationItem = ({ notification }: { notification: any }) => (
    <div
      key={notification.id}
      className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
        notification.status === 'unread' ? 'bg-blue-50/50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Risk indicator */}
        <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${getRiskColor(notification.risk)}`} />
        
        {/* Notification content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">
              {notification.patientName}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)}`}>
              {notification.priority}
            </span>
            {notification.status === 'unread' && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
          <p className="text-sm text-gray-700 mb-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatTimeAgo(notification.timestamp)}
            </span>
            <div className="flex items-center gap-2">
              <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                View Details
              </button>
              <button className="text-xs text-green-600 hover:text-green-800 font-medium">
                Contact Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Patient Notifications</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} new
              </span>
            )}
            {highPriorityCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {highPriorityCount} urgent
              </span>
            )}
          </div>
          <button
            onClick={() => {
              onRefresh()
              loadNotifications()
            }}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zM21 7l-5-5H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7z" />
          </svg>
          <h4 className="text-sm font-medium text-gray-900 mb-1">No notifications</h4>
          <p className="text-sm text-gray-500">Patient survey completions will appear here</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {/* High Risk Section */}
          {highRiskNotifications.length > 0 && (
            <div>
              <div className="px-6 py-3 bg-red-50 border-b border-red-100">
                <h4 className="text-sm font-semibold text-red-900 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  High Priority ({highRiskNotifications.length})
                </h4>
              </div>
              {highRiskNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}

          {/* Medium-Low Risk Section */}
          {mediumLowNotifications.length > 0 && (
            <div>
              <div className="px-6 py-3 bg-green-50 border-b border-green-100">
                <h4 className="text-sm font-semibold text-green-900 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Medium-Low Priority ({mediumLowNotifications.length})
                </h4>
              </div>
              {mediumLowNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {showAll ? 'Show Less' : `Show All ${notifications.length} Notifications`}
          </button>
        </div>
      )}
    </div>
  )
}

export default PatientNotificationWidget
