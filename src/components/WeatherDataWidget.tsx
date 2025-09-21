import React, { useState, useEffect } from 'react'
import { getWeatherData, getWeatherRiskAnalysis } from '../data/adapter'

/**
 * Weather Data Widget - displays current weather conditions and heat risk analysis
 * Shows temperature, humidity, heat index, and health risk assessments
 */
const WeatherDataWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Simulate weather data fetch
  useEffect(() => {
    loadWeatherData()
    
    // Refresh every 5 minutes
    const interval = setInterval(loadWeatherData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const loadWeatherData = async () => {
    try {
      setLoading(true)
      
      // Fetch weather data and risk analysis from API
      const [weatherResponse, riskAnalysisResponse] = await Promise.all([
        getWeatherData('101000'), // Default location code
        getWeatherRiskAnalysis('101000')
      ])
      
      if (weatherResponse) {
        // Combine weather data with risk analysis
        const combinedData = {
          ...weatherResponse,
          risk_level: riskAnalysisResponse?.ai_analysis?.risk_level || 'Unknown',
          health_concerns: riskAnalysisResponse?.ai_analysis?.health_concerns || [],
          recommendations: riskAnalysisResponse?.ai_analysis?.immediate_recommendations || [],
          is_heat_wave: weatherResponse.temperature > 35 || weatherResponse.heat_index > 40,
          timestamp: new Date()
        }
        
        setWeatherData(combinedData)
        setLastUpdated(new Date())
      } else {
        // Fallback to default data if API fails
        setWeatherData(null)
      }
    } catch (error) {
      console.error('Error loading weather data:', error)
      setWeatherData(null)
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

  const getTemperatureColor = (temp: number) => {
    if (temp >= 35) return 'text-red-600'
    if (temp >= 30) return 'text-orange-600'
    if (temp >= 25) return 'text-yellow-600'
    return 'text-blue-600'
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
          <h3 className="text-lg font-semibold text-gray-900">Weather Conditions</h3>
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
            {/* Current Conditions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getTemperatureColor(weatherData.temperature)}`}>
                  {weatherData.temperature}°C
                </div>
                <div className="text-sm text-gray-600">Current Temperature</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600">
                  {weatherData.heat_index}°C
                </div>
                <div className="text-sm text-gray-600">Heat Index</div>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Feels Like:</span>
                <span className="font-medium">{weatherData.feels_like}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Humidity:</span>
                <span className="font-medium">{weatherData.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">UV Index:</span>
                <span className="font-medium">{weatherData.uv_index}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wind Speed:</span>
                <span className="font-medium">{weatherData.wind_speed} m/s</span>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-900">Health Risk Assessment</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(weatherData.risk_level)}`}>
                  {weatherData.risk_level} Risk
                </span>
                {weatherData.is_heat_wave && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    Heat Wave
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-1">Health Concerns:</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {weatherData.health_concerns.map((concern: string, index: number) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-red-500 mt-0.5">•</span>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-1">Recommendations:</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {weatherData.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-blue-500 mt-0.5">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="text-center">
              <div className="text-sm text-gray-600">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {weatherData.location.name}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Weather data unavailable</h4>
            <p className="text-sm text-gray-500">Unable to load current weather conditions</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherDataWidget
