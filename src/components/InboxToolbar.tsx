import React from 'react'
import { FilterType } from '../types'

interface InboxToolbarProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  onRefresh: () => void
  onLoadSampleData?: () => void
}

/**
 * InboxToolbar component provides filtering and refresh controls for the inbox
 */
const InboxToolbar: React.FC<InboxToolbarProps> = ({
  currentFilter,
  onFilterChange,
  onRefresh,
  onLoadSampleData
}) => {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]

  return (
    <div className="bg-white border-b border-cura-200 px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus-ring ${
                currentFilter === filter.value
                  ? 'bg-cura-100 text-cura-700 border border-cura-300'
                  : 'bg-cura-50 text-cura-700 hover:bg-cura-100 border border-cura-200'
              }`}
              aria-pressed={currentFilter === filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Development only: Load sample data button */}
          {onLoadSampleData && (
            <button
              onClick={onLoadSampleData}
              className="px-3 py-1.5 text-xs font-medium text-cura-700 bg-cura-100 border border-cura-300 rounded-md hover:bg-cura-200 transition-colors focus-ring"
              title="Load sample data for testing (dev only)"
            >
              Load Sample Data
            </button>
          )}
          
          {/* Refresh button */}
          <button
            onClick={onRefresh}
            className="px-3 py-1.5 text-sm font-medium text-cura-700 bg-cura-100 border border-cura-200 rounded-md hover:bg-cura-200 transition-colors focus-ring"
            title="Refresh messages"
          >
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default InboxToolbar
