import React, { useState, useEffect } from 'react'
import { Message } from '../types'
import { getEnvironmentMetrics } from '../data/adapter'

interface PatientHealthWidgetProps {
  messages: Message[]
  onRefresh: () => void
  loading: boolean
}

/**
 * Patient Health Widget - displays comprehensive patient health information
 * Shows patient demographics, health conditions, and risk factors
 */
const PatientHealthWidget: React.FC<PatientHealthWidgetProps> = ({
  messages,
  onRefresh,
  loading
}) => {
  const [environmentMetrics, setEnvironmentMetrics] = useState<any>(null)
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null)

  // Load environment metrics on component mount
  useEffect(() => {
    loadEnvironmentMetrics()
  }, [])

  const loadEnvironmentMetrics = async () => {
    try {
      const data = await getEnvironmentMetrics()
      setEnvironmentMetrics(data)
    } catch (error) {
      console.error('Error loading environment metrics:', error)
      setEnvironmentMetrics(null)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
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

  const getRiskDotColor = (risk: string) => {
    switch (risk.toLowerCase()) {
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  // Simulate patient health data based on messages
  const patientHealthData = messages.map((message, index) => ({
    ...message,
    age: 25 + Math.floor(Math.random() * 60), // Random age between 25-85
    gender: Math.random() > 0.5 ? 'Female' : 'Male',
    conditions: message.risk === 'high' 
      ? ['Hypertension', 'Diabetes', 'Heart Disease'] 
      : message.risk === 'medium'
      ? ['Hypertension', 'Asthma']
      : ['None'],
    medications: message.risk === 'high'
      ? ['Metformin', 'Lisinopril', 'Aspirin']
      : message.risk === 'medium'
      ? ['Albuterol']
      : [],
    lastAssessment: formatTimestamp(message.createdAt),
    location: `Location ${101000 + index}`, // Simulate location codes
    emergencyContact: '+1 (555) 123-4567'
  }))

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Patient Health Information</h3>
            {environmentMetrics && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {environmentMetrics.total_patients} patients monitored
              </span>
            )}
          </div>
          <button
            onClick={() => {
              onRefresh()
              loadEnvironmentMetrics()
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

      {/* Environment Metrics Summary */}
      {environmentMetrics && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{environmentMetrics.total_patients}</div>
              <div className="text-gray-600">Total Patients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{environmentMetrics.patients_at_risk}</div>
              <div className="text-gray-600">At Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{environmentMetrics.extreme_heat_conditions}</div>
              <div className="text-gray-600">Extreme Heat</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {environmentMetrics.risk_distribution?.high || 0}
              </div>
              <div className="text-gray-600">High Risk</div>
            </div>
          </div>
        </div>
      )}

      {/* Patient List */}
      <div className="divide-y divide-gray-200">
        {patientHealthData.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h4 className="text-sm font-medium text-gray-900 mb-1">No patient data</h4>
            <p className="text-sm text-gray-500">Patient health information will appear here</p>
          </div>
        ) : (
          patientHealthData.map((patient) => (
            <div key={patient.id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Risk indicator */}
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${getRiskDotColor(patient.risk)}`} />
                  
                  {/* Patient info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{patient.patientName}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(patient.risk)}`}>
                        {patient.risk} risk
                      </span>
                      <span className="text-sm text-gray-500">ID: {patient.id}</span>
                    </div>
                    
                    {/* Basic demographics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Age:</span>
                        <span className="ml-1 font-medium">{patient.age}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Gender:</span>
                        <span className="ml-1 font-medium">{patient.gender}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <span className="ml-1 font-medium">{patient.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Assessment:</span>
                        <span className="ml-1 font-medium">{patient.lastAssessment}</span>
                      </div>
                    </div>

                    {/* Expandable detailed info */}
                    {expandedPatient === patient.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Health Conditions</h5>
                            <ul className="space-y-1">
                              {patient.conditions.length > 0 ? (
                                patient.conditions.map((condition: string, index: number) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    {condition}
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-500">No known conditions</li>
                              )}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Current Medications</h5>
                            <ul className="space-y-1">
                              {patient.medications.length > 0 ? (
                                patient.medications.map((medication: string, index: number) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                    {medication}
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-500">No current medications</li>
                              )}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-600">Emergency Contact:</span>
                              <span className="ml-2 font-medium">{patient.emergencyContact}</span>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                              Contact Patient
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setExpandedPatient(expandedPatient === patient.id ? null : patient.id)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors focus-ring"
                  >
                    {expandedPatient === patient.id ? 'Less Details' : 'More Details'}
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-md hover:bg-blue-200 transition-colors focus-ring">
                    View Full Profile
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PatientHealthWidget
