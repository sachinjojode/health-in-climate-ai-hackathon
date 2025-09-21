import React, { useEffect, useRef, useState } from 'react'
import { Message } from '../types'
import PainScaleAssessment from './PainScaleAssessment'
import DoctorNotificationModal from './DoctorNotificationModal'

interface RightPanelProps {
  message: Message | null
  onClose: () => void
  onToggleRead: (messageId: string) => void
}

/**
 * RightPanel component displays the Gmail-style reading panel
 * Slides in from the right and can be resized
 */
const RightPanel: React.FC<RightPanelProps> = ({
  message,
  onClose,
  onToggleRead
}) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)
  const isResizing = useRef(false)
  const [showAssessment, setShowAssessment] = useState(false)
  const [assessmentCompleted, setAssessmentCompleted] = useState(false)
  const [showDoctorNotification, setShowDoctorNotification] = useState(false)
  const [assessmentRating, setAssessmentRating] = useState<number>(0)

  // Reset assessment state when message changes or panel opens
  useEffect(() => {
    setAssessmentCompleted(false)
    setShowAssessment(false)
    setShowDoctorNotification(false)
    setAssessmentRating(0)
  }, [message?.id])

  // Handle ESC key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (message) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [message, onClose])

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !panelRef.current) return

      const newWidth = window.innerWidth - e.clientX
      const minWidth = 360
      const maxWidth = window.innerWidth * 0.8

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        panelRef.current.style.width = `${newWidth}px`
      }
    }

    const handleMouseUp = () => {
      isResizing.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement) === resizeRef.current) {
        isResizing.current = true
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
        e.preventDefault()
      }
    }

    if (message) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('mousedown', handleMouseDown)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('mousedown', handleMouseDown)
      }
    }
  }, [message])

  // Handle assessment completion
  const handleAssessmentComplete = (rating: number) => {
    setAssessmentRating(rating)
    setAssessmentCompleted(true)
    setShowAssessment(false)
    
    // Show doctor notification for medium and high risk patients
    if (message && (message.risk === 'medium' || message.risk === 'high')) {
      setShowDoctorNotification(true)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!message) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 z-40 sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-full sm:w-96 sm:min-w-[360px] bg-white shadow-xl z-50 slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
      >
        {/* Resize handle - hidden on mobile */}
        <div
          ref={resizeRef}
          className="hidden sm:block absolute left-0 top-0 bottom-0 w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize"
        />

        {/* Header */}
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h2 id="panel-title" className="text-lg font-semibold text-gray-900 mb-2">
                {message.subject}
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <span className={`risk-pill ${message.risk}`}>
                  {message.risk}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600">From:</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-blue-700">
                    Dr. Fitzpatrick's AI Assistant
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {formatTimestamp(message.createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label="Close panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onToggleRead(message.id)}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors focus-ring"
            >
              {message.read ? 'Mark as unread' : 'Mark as read'}
            </button>
            <button
              onClick={() => setShowAssessment(true)}
              disabled={assessmentCompleted}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus-ring ${
                assessmentCompleted
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200'
              }`}
            >
              {assessmentCompleted ? 'Assessment Complete' : 'Rate Your Condition'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar" style={{ height: 'calc(100% - 140px)' }}>
          {/* Message Content */}
          <div className="prose prose-sm max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {message.body}
            </p>
          </div>

          {/* Assessment Section */}
          {showAssessment && (
            <div className="mb-6">
              <PainScaleAssessment
                key={`assessment-${message.id}-${Date.now()}`}
                onComplete={handleAssessmentComplete}
                patientRisk={message.risk}
              />
            </div>
          )}

          {/* Assessment Completed Status */}
          {assessmentCompleted && !showAssessment && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <h4 className="font-semibold text-green-800">Assessment Submitted</h4>
                  <p className="text-sm text-green-700">
                    You rated your condition as {assessmentRating}/10. Thank you for providing this information.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Doctor Notification Modal */}
      <DoctorNotificationModal
        isOpen={showDoctorNotification}
        onClose={() => setShowDoctorNotification(false)}
        patientRisk={message.risk as 'medium' | 'high'}
        assessmentRating={assessmentRating}
      />
    </>
  )
}

export default RightPanel
