import React, { useState, useEffect, useRef } from 'react'
import { streamAllPatients } from '../data/adapter'

/**
 * Patient Information Widget - detailed patient list with filtering and sorting
 * Shows comprehensive patient data for medical professionals
 */

interface PatientInfo {
  id: string
  name: string
  age: number
  gender: 'M' | 'F' | 'Other'
  riskLevel: 'low' | 'medium' | 'high'
  lastAssessment: string
  conditions: string[]
  medications: string[]
  emergencyContact: string
  lastUpdate: string
  status: 'active' | 'monitoring' | 'critical'
  // API-specific fields from /api/patients endpoint
  patient_id?: number
  zip_code?: string
  phone_number?: string
  email?: string
  address?: string
  pregnancy_weeks?: number
  trimester?: number
  pregnancy_description?: string
  risk_score?: number
  heat_wave_risk?: boolean
  created_at?: string
  updated_at?: string
}

interface PatientInfoWidgetProps {
  loading: boolean
  onRefresh: () => void
}

const PatientInfoWidget: React.FC<PatientInfoWidgetProps> = ({
  loading,
  onRefresh
}) => {
  const [patients, setPatients] = useState<PatientInfo[]>([])
  const [filteredPatients, setFilteredPatients] = useState<PatientInfo[]>([])
  const [apiLoading, setApiLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streamingData, setStreamingData] = useState({
    totalPatients: 0,
    processedCount: 0,
    isStreaming: false,
    metadata: null as any,
    summary: null as any
  })
  const [displayMode, setDisplayMode] = useState<'streaming' | 'pagination'>('streaming')
  const abortControllerRef = useRef<AbortController | null>(null)
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    status: 'all',
    search: ''
  })
  const [sortBy, setSortBy] = useState<'name' | 'risk' | 'lastUpdate'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null)

  // Start streaming when component mounts
  useEffect(() => {
    startStreamingPatients()
    
    // Cleanup on unmount
    return () => {
      stopStreaming()
    }
  }, []) // Empty dependency array for initial load only

  // Restart streaming when filters change
  useEffect(() => {
    if (displayMode === 'streaming') {
      startStreamingPatients()
    }
  }, [filters]) // Restart stream when filters change

  // Transform patient data from API to PatientInfo format
  const transformPatientData = (patient: any): PatientInfo => {
    // Determine status based on risk score or heat wave risk
    let status: 'active' | 'monitoring' | 'critical'
    let riskLevel: 'low' | 'medium' | 'high'
    
    if (patient.risk_score >= 8 || patient.heat_wave_risk) {
      riskLevel = 'high'
      status = 'critical'
    } else if (patient.risk_score >= 5) {
      riskLevel = 'medium'
      status = 'monitoring'
    } else {
      riskLevel = 'low'
      status = 'active'
    }
    
    return {
      id: patient.patient_id?.toString() || patient.id?.toString() || 'unknown',
      name: patient.name || 'Unknown Patient',
      age: patient.age || 28,
      gender: (patient.gender || 'F') as 'M' | 'F' | 'Other',
      riskLevel,
      lastAssessment: `Assessment completed ${new Date(patient.updated_at || patient.created_at || Date.now()).toLocaleDateString()}`,
      conditions: patient.pregnancy_weeks ? [`Pregnancy - ${patient.pregnancy_weeks} weeks`] : ['No conditions listed'],
      medications: patient.medications || ['Prenatal Vitamins'],
      emergencyContact: patient.phone_number || '+1 (555) 123-4567',
      lastUpdate: patient.updated_at || patient.created_at || new Date().toISOString(),
      status,
      // Store original API data
      ...patient
    }
  }

  // Start streaming patient data
  const startStreamingPatients = async () => {
    try {
      // Cancel any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      setApiLoading(true)
      setError(null)
      setPatients([])
      setStreamingData(prev => ({ ...prev, isStreaming: true, processedCount: 0, totalPatients: 0 }))
      
      // Create new abort controller
      abortControllerRef.current = new AbortController()
      
      // Prepare streaming options based on current filters
      const options = {
        batchSize: 20, // Process 20 patients per batch for smooth UI updates
        includeAiSuggestions: true,
        includeNotifications: true,
        ...(filters.riskLevel !== 'all' && { riskLevel: filters.riskLevel as 'low' | 'medium' | 'high' })
      }
      
      await streamAllPatients(
        // onBatch callback
        (newPatients: any[], processedCount: number, totalPatients: number) => {
          const transformedPatients = newPatients.map(transformPatientData)
          
          setPatients(prev => [...prev, ...transformedPatients])
          setStreamingData(prev => ({
            ...prev,
            processedCount,
            totalPatients
          }))
        },
        
        // onMetadata callback
        (metadata: any) => {
          setStreamingData(prev => ({
            ...prev,
            metadata,
            totalPatients: metadata.total_patients || 0
          }))
        },
        
        // onSummary callback
        (summary: any) => {
          setStreamingData(prev => ({
            ...prev,
            summary,
            isStreaming: false
          }))
          setApiLoading(false)
        },
        
        // onError callback
        (errorMessage: string) => {
          setError(errorMessage)
          setStreamingData(prev => ({ ...prev, isStreaming: false }))
          setApiLoading(false)
        },
        
        options
      )
    } catch (error) {
      console.error('Error starting patient stream:', error)
      setError('Failed to start patient data stream. Please try again.')
      setStreamingData(prev => ({ ...prev, isStreaming: false }))
      setApiLoading(false)
    }
  }

  // Stop streaming
  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setStreamingData(prev => ({ ...prev, isStreaming: false }))
    setApiLoading(false)
  }

  // Filter and sort patients
  useEffect(() => {
    let filtered = [...patients]

    // Apply filters
    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter(p => p.riskLevel === filters.riskLevel)
    }
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status)
    }
    
    if (filters.search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.conditions.some(c => c.toLowerCase().includes(filters.search.toLowerCase()))
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'risk':
          const riskOrder = { high: 3, medium: 2, low: 1 }
          aValue = riskOrder[a.riskLevel]
          bValue = riskOrder[b.riskLevel]
          break
        case 'lastUpdate':
          aValue = new Date(a.lastUpdate)
          bValue = new Date(b.lastUpdate)
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredPatients(filtered)
  }, [patients, filters, sortBy, sortOrder])

  // Display logic for streaming vs pagination
  const currentPatients = filteredPatients
  const progressPercentage = streamingData.totalPatients > 0 
    ? (streamingData.processedCount / streamingData.totalPatients) * 100 
    : 0

  const handleRefresh = () => {
    if (displayMode === 'streaming') {
      startStreamingPatients()
    }
    onRefresh()
  }

  const toggleDisplayMode = () => {
    setDisplayMode(prev => prev === 'streaming' ? 'pagination' : 'streaming')
    if (displayMode === 'streaming') {
      stopStreaming()
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500'
      case 'monitoring':
        return 'bg-yellow-500'
      case 'active':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                displayMode === 'streaming' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {displayMode === 'streaming' ? 'Streaming' : 'Pagination'}
              </span>
              <button
                onClick={toggleDisplayMode}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Switch to {displayMode === 'streaming' ? 'Pagination' : 'Streaming'}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {apiLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
            {displayMode === 'streaming' && streamingData.isStreaming && (
              <span className="text-xs text-gray-500">
                {streamingData.processedCount}/{streamingData.totalPatients} patients
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={apiLoading || loading}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Streaming Progress Bar */}
        {displayMode === 'streaming' && streamingData.isStreaming && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Loading patients...</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Streaming Summary */}
        {displayMode === 'streaming' && streamingData.summary && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <div className="text-sm font-medium text-green-900 mb-1">Stream Complete</div>
            <div className="text-xs text-green-700">
              Processed {streamingData.summary.total_processed} patients. 
              Risk distribution: {streamingData.summary.risk_distribution?.high || 0} high, 
              {streamingData.summary.risk_distribution?.medium || 0} medium, 
              {streamingData.summary.risk_distribution?.low || 0} low risk.
            </div>
          </div>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search patients..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Risk Level Filter */}
          <select
            value={filters.riskLevel}
            onChange={(e) => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="critical">Critical</option>
            <option value="monitoring">Monitoring</option>
            <option value="active">Active</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field as any)
              setSortOrder(order as any)
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="risk-desc">Risk (High-Low)</option>
            <option value="risk-asc">Risk (Low-High)</option>
            <option value="lastUpdate-desc">Recent Updates</option>
            <option value="lastUpdate-asc">Oldest Updates</option>
          </select>
        </div>
      </div>

      {/* Patient List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {error ? (
          <div className="px-6 py-8 text-center">
            <svg className="w-12 h-12 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h4 className="text-sm font-medium text-red-900 mb-1">Error loading patients</h4>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        ) : apiLoading ? (
          <div className="px-6 py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Loading patients...</h4>
            <p className="text-sm text-gray-500">Fetching patient data from API</p>
          </div>
        ) : currentPatients.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h4 className="text-sm font-medium text-gray-900 mb-1">No patients found</h4>
            <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          currentPatients.map((patient) => (
            <div
              key={patient.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Status indicator */}
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(patient.status)}`} />
                  
                  {/* Patient info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{patient.name}</span>
                      <span className="text-sm text-gray-500">({patient.age} years, {patient.gender})</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(patient.riskLevel)}`}>
                        {patient.riskLevel}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Conditions: {patient.conditions.slice(0, 2).join(', ')}
                      {patient.conditions.length > 2 && ` +${patient.conditions.length - 2} more`}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500">{patient.lastAssessment}</div>
                  <div className="text-xs text-gray-400">{formatTimeAgo(patient.lastUpdate)}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Information */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            {displayMode === 'streaming' ? (
              <>
                Showing {currentPatients.length} patients
                {streamingData.totalPatients > 0 && (
                  <> of {streamingData.totalPatients} total patients</>
                )}
                {streamingData.isStreaming && (
                  <span className="ml-2 text-blue-600">• Streaming in progress...</span>
                )}
              </>
            ) : (
              <>Showing {currentPatients.length} patients (Pagination mode)</>
            )}
          </div>
          
          {displayMode === 'streaming' && (
            <div className="flex items-center gap-2">
              {streamingData.isStreaming ? (
                <button
                  onClick={stopStreaming}
                  className="px-3 py-1 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
                >
                  Stop Stream
                </button>
              ) : (
                <button
                  onClick={startStreamingPatients}
                  className="px-3 py-1 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50"
                >
                  Restart Stream
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Patient Details</h3>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <div className="text-sm text-gray-900">{selectedPatient.name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Age & Gender</label>
                  <div className="text-sm text-gray-900">{selectedPatient.age} years, {selectedPatient.gender}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Risk Level</label>
                  <div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(selectedPatient.riskLevel)}`}>
                      {selectedPatient.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedPatient.status)}`} />
                    <span className="text-sm text-gray-900 capitalize">{selectedPatient.status}</span>
                  </div>
                </div>
              </div>

              {/* Medical Info */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Medical Conditions</label>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.conditions.map((condition, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Current Medications</label>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.medications.map((medication, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {medication}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                <div className="text-sm text-gray-900">{selectedPatient.emergencyContact}</div>
              </div>

              {/* Timeline */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Recent Activity</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Assessment</span>
                    <span className="text-gray-900">{selectedPatient.lastAssessment}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Update</span>
                    <span className="text-gray-900">{formatTimeAgo(selectedPatient.lastUpdate)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  View Full History
                </button>
                <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                  Contact Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientInfoWidget
