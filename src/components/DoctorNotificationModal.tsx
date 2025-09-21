import React from 'react'

interface DoctorNotificationModalProps {
  isOpen: boolean
  onClose: () => void
  patientRisk: 'medium' | 'high'
  assessmentRating: number
}

/**
 * Modal that shows when medium/high risk patients complete their assessment
 * Notifies them that their data has been sent to the medical team
 */
const DoctorNotificationModal: React.FC<DoctorNotificationModalProps> = ({
  isOpen,
  onClose,
  patientRisk,
  assessmentRating
}) => {
  if (!isOpen) return null

  const getRiskMessage = () => {
    if (patientRisk === 'high') {
      return "Due to your high-risk status, Dr. Fitzpatrick's team has been immediately notified of your assessment."
    }
    return "Your assessment data has been sent to Dr. Fitzpatrick's nursing team for review."
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Patient Data Sent to Medical Team
          </h3>
          <p className="text-gray-600">
            Your assessment has been received and processed
          </p>
        </div>

        {/* Assessment Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Your Assessment Rating:</span>
            <span className="text-lg font-bold text-gray-900">{assessmentRating}/10</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Risk Level:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
              patientRisk === 'high' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {patientRisk}
            </span>
          </div>
        </div>

        {/* Message */}
        <div className={`border-l-4 ${
          patientRisk === 'high' ? 'border-red-500 bg-red-50' : 'border-amber-500 bg-amber-50'
        } p-4 mb-6`}>
          <p className="text-sm text-gray-700">
            {getRiskMessage()}
          </p>
          {patientRisk === 'high' && (
            <p className="text-sm text-red-700 font-medium mt-2">
              A healthcare professional will contact you within 30 minutes.
            </p>
          )}
        </div>

        {/* Doctor Information */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-blue-900">Dr. Fitzpatrick's Medical Team</p>
              <p className="text-sm text-blue-700">AI-Assisted Patient Monitoring</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Understood
          </button>
          {patientRisk === 'high' && (
            <button
              onClick={() => {
                // In a real app, this would trigger an emergency call
                alert('Emergency contact would be initiated')
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Emergency Call
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorNotificationModal
