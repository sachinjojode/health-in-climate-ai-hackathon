import React, { useState, useEffect } from 'react'

/**
 * Doctor Weather Widget - displays comprehensive weather data for medical professionals
 * Shows detailed environmental conditions, heat risk analysis, and patient impact assessments
 */

// Simple Line Chart Component for weather trends
const WeatherTrendChart: React.FC<{ data: number[]; color: string; label: string; unit: string }> = ({ 
  data, 
  color,
  label,
  unit
}) => {
  const width = 180
  const height = 60
  const padding = 8
  
  const maxData = Math.max(...data)
  const minData = Math.min(...data)
  const range = maxData - minData || 1
  
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
    const y = height - padding - ((value - minData) / range) * (height - 2 * padding)
    return `${x},${y}`
  }).join(' ')
  
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-xs font-medium text-gray-700 mb-2">{label}</div>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
        />
        {data.map((value, index) => {
          const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
          const y = height - padding - ((value - minData) / range) * (height - 2 * padding)
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
            />
          )
        })}
      </svg>
      <div className="text-xs text-gray-600 mt-1">
        {data[data.length - 1]}{unit} (current)
      </div>
    </div>
  )
}

const DoctorWeatherWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [trends, setTrends] = useState({
    temperature: [28, 30, 32, 31, 33, 34, 32],
    humidity: [65, 68, 70, 72, 69, 66, 68],
    heatIndex: [32, 35, 38, 36, 39, 41, 38]
  })

  // Generate realistic weather data and trends
  useEffect(() => {
    loadWeatherData()
    
    // Refresh every 5 minutes
    const interval = setInterval(loadWeatherData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const loadWeatherData = async () => {
    try {
      setLoading(true)
      
      // Generate realistic weather data for medical monitoring
      const baseTemp = 28 + Math.random() * 8 // 28-36°C
      const humidity = 60 + Math.random() * 25 // 60-85%
      const heatIndex = baseTemp + (humidity * 0.1) + Math.random() * 3
      
      // Generate trends (last 7 readings)
      const tempTrend = Array.from({ length: 7 }, () => baseTemp - 3 + Math.random() * 6)
      const humidityTrend = Array.from({ length: 7 }, () => humidity - 5 + Math.random() * 10)
      const heatIndexTrend = Array.from({ length: 7 }, () => heatIndex - 3 + Math.random() * 6)
      
      const mockWeatherData = {
        temperature: Math.round(baseTemp),
        humidity: Math.round(humidity),
        heat_index: Math.round(heatIndex),
        uv_index: Math.floor(Math.random() * 12),
        wind_speed: Math.round(Math.random() * 15),
        air_quality: Math.round(Math.random() * 300),
        pressure: Math.round(1000 + Math.random() * 50),
        location: { name: 'Medical Center District' },
        risk_level: heatIndex >= 40 ? 'high' : heatIndex >= 35 ? 'medium' : 'low',
        health_concerns: heatIndex >= 40 
          ? ['Pregnancy heat stroke risk', 'Preterm labor risk', 'Fetal distress risk', 'Severe dehydration risk']
          : heatIndex >= 35
          ? ['Pregnancy heat exhaustion risk', 'Dehydration risk', 'Overheating risk']
          : ['Mild pregnancy heat stress possible'],
        recommendations: heatIndex >= 40
          ? ['Keep pregnant patients indoors', 'Extra hydration monitoring', 'Check for contractions', 'Monitor fetal movement', 'Emergency protocols ready']
          : heatIndex >= 35
          ? ['Limit outdoor activities for pregnant patients', 'Frequent hydration checks', 'Monitor for overheating signs', 'Avoid hot baths/showers']
          : ['Normal pregnancy precautions', 'Regular hydration monitoring', 'Heat avoidance education'],
        timestamp: new Date()
      }
      
      setWeatherData(mockWeatherData)
      setTrends({
        temperature: tempTrend.map(t => Math.round(t)),
        humidity: humidityTrend.map(h => Math.round(h)),
        heatIndex: heatIndexTrend.map(h => Math.round(h))
      })
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading weather data:', error)
    } finally {
      setLoading(false)
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

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'medium':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  if (loading && !weatherData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Environmental Conditions</h3>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={loadWeatherData}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Weather Content */}
      <div className="p-6">
        {weatherData ? (
          <div className="space-y-6">
            {/* Risk Assessment Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getRiskIcon(weatherData.risk_level)}
                <div>
                  <div className="text-lg font-semibold text-gray-900">Heat Risk Assessment</div>
                  <div className="text-sm text-gray-600">Current environmental conditions</div>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(weatherData.risk_level)}`}>
                {weatherData.risk_level.toUpperCase()} RISK
              </span>
            </div>

            {/* Current Conditions Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{weatherData.temperature}°C</div>
                <div className="text-sm text-gray-600">Temperature</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{weatherData.heat_index}°C</div>
                <div className="text-sm text-gray-600">Heat Index</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{weatherData.humidity}%</div>
                <div className="text-sm text-gray-600">Humidity</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{weatherData.uv_index}</div>
                <div className="text-sm text-gray-600">UV Index</div>
              </div>
            </div>

            {/* Weather Trends */}
            <div className="grid grid-cols-3 gap-4">
              <WeatherTrendChart 
                data={trends.temperature} 
                color="#3b82f6" 
                label="Temperature Trend" 
                unit="°C"
              />
              <WeatherTrendChart 
                data={trends.humidity} 
                color="#10b981" 
                label="Humidity Trend" 
                unit="%"
              />
              <WeatherTrendChart 
                data={trends.heatIndex} 
                color="#f59e0b" 
                label="Heat Index Trend" 
                unit="°C"
              />
            </div>

            {/* Additional Environmental Data */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Wind Speed:</span>
                <span className="font-medium">{weatherData.wind_speed} m/s</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Air Quality:</span>
                <span className="font-medium">{weatherData.air_quality} AQI</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Atmospheric Pressure:</span>
                <span className="font-medium">{weatherData.pressure} hPa</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{weatherData.location.name}</span>
              </div>
            </div>

            {/* Medical Recommendations */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Pregnancy-Specific Clinical Recommendations
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs font-medium text-blue-800 mb-1">Health Concerns:</div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {weatherData.health_concerns.map((concern: string, index: number) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-blue-500 mt-0.5">•</span>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-blue-800 mb-1">Recommended Actions:</div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {weatherData.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-green-500 mt-0.5">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Weather data unavailable</h4>
            <p className="text-sm text-gray-500">Unable to load environmental conditions</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorWeatherWidget
