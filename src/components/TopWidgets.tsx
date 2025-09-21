import React from 'react'

/**
 * TopWidgets component displays three placeholder cards for future charts/widgets
 * These cards will be populated with actual health monitoring data later
 */
const TopWidgets: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Widget 1: Heat Risk Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-cura-200 p-6">
        <h3 className="text-lg font-semibold text-cura-800 mb-4">
          Heat Risk Overview
        </h3>
        <div className="bg-cura-100 rounded-lg h-32 flex items-center justify-center">
          <span className="text-cura-600 text-sm">
            Chart placeholder
          </span>
        </div>
        <p className="text-xs text-cura-600 mt-2">
          Real-time heat risk distribution
        </p>
      </div>

      {/* Widget 2: Patient Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-cura-200 p-6">
        <h3 className="text-lg font-semibold text-cura-800 mb-4">
          Patient Alerts
        </h3>
        <div className="bg-cura-100 rounded-lg h-32 flex items-center justify-center">
          <span className="text-cura-600 text-sm">
            Chart placeholder
          </span>
        </div>
        <p className="text-xs text-cura-600 mt-2">
          Active patient alerts and notifications
        </p>
      </div>

      {/* Widget 3: Environmental Conditions */}
      <div className="bg-white rounded-lg shadow-sm border border-cura-200 p-6">
        <h3 className="text-lg font-semibold text-cura-800 mb-4">
          Environmental Conditions
        </h3>
        <div className="bg-cura-100 rounded-lg h-32 flex items-center justify-center">
          <span className="text-cura-600 text-sm">
            Chart placeholder
          </span>
        </div>
        <p className="text-xs text-cura-600 mt-2">
          Temperature, humidity, and weather data
        </p>
      </div>
    </div>
  )
}

export default TopWidgets
