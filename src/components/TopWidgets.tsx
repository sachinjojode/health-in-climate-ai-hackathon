import React, { useState, useEffect } from 'react'

/**
 * TopWidgets component displays three health monitoring widgets for patients
 * Shows current weather conditions, heat index, and health recommendations
 */

// Simple Line Chart Component for temperature trends
const LineChart: React.FC<{ data: number[]; color: string }> = ({ 
  data, 
  color
}) => {
  const width = 200
  const height = 80
  const padding = 10
  
  const maxData = Math.max(...data)
  const minData = Math.min(...data)
  const range = maxData - minData || 1
  
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
    const y = height - padding - ((value - minData) / range) * (height - 2 * padding)
    return `${x},${y}`
  }).join(' ')
  
  return (
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
            r="3"
            fill={color}
          />
        )
      })}
    </svg>
  )
}

// Progress Bar Component
const ProgressBar: React.FC<{ value: number; max: number; color: string; label: string }> = ({ 
  value, 
  max, 
  color, 
  label 
}) => {
  const percentage = (value / max) * 100
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-500"
          style={{ 
            width: `${Math.min(percentage, 100)}%`, 
            backgroundColor: color 
          }}
        ></div>
      </div>
    </div>
  )
}

const TopWidgets: React.FC = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: 85,
    humidity: 65,
    heatIndex: 92,
    uvIndex: 8
  })

  const [temperatureTrend, setTemperatureTrend] = useState([82, 84, 85, 87, 85, 83, 85])
  
  const [healthMetrics, setHealthMetrics] = useState({
    hydration: 75,
    sunExposure: 45,
    activityLevel: 60
  })

  // Generate realistic weather and health data
  useEffect(() => {
    const generateRealisticData = () => {
      // Generate realistic temperature (75-95°F)
      const baseTemp = 80 + Math.random() * 15
      const humidity = 40 + Math.random() * 40 // 40-80%
      
      // Calculate heat index (simplified formula)
      const heatIndex = baseTemp + (humidity * 0.1) + Math.random() * 5
      
      // Generate temperature trend (last 7 readings)
      const trend = Array.from({ length: 7 }, () => {
        const base = baseTemp - 5 + Math.random() * 10
        return Math.round(base)
      })
      
      // UV Index (0-11)
      const uvIndex = Math.floor(Math.random() * 12)
      
      setWeatherData({
        temperature: Math.round(baseTemp),
        humidity: Math.round(humidity),
        heatIndex: Math.round(heatIndex),
        uvIndex
      })
      
      setTemperatureTrend(trend)
      
      // Health metrics (0-100%)
      setHealthMetrics({
        hydration: 60 + Math.random() * 30,
        sunExposure: 20 + Math.random() * 50,
        activityLevel: 40 + Math.random() * 40
      })
    }

    // Generate initial data
    generateRealisticData()
    
    // Update every 2 minutes for realistic monitoring
    const interval = setInterval(generateRealisticData, 120000)
    
    return () => clearInterval(interval)
  }, [])

  const getHeatRiskLevel = (heatIndex: number) => {
    if (heatIndex >= 105) return { level: 'Extreme', color: '#dc2626', bgColor: '#fef2f2' }
    if (heatIndex >= 90) return { level: 'High', color: '#ef4444', bgColor: '#fef2f2' }
    if (heatIndex >= 80) return { level: 'Moderate', color: '#f59e0b', bgColor: '#fffbeb' }
    return { level: 'Low', color: '#10b981', bgColor: '#f0fdf4' }
  }

  const getUVRiskLevel = (uvIndex: number) => {
    if (uvIndex >= 8) return { level: 'Very High', color: '#dc2626' }
    if (uvIndex >= 6) return { level: 'High', color: '#f59e0b' }
    if (uvIndex >= 3) return { level: 'Moderate', color: '#10b981' }
    return { level: 'Low', color: '#3b82f6' }
  }

  const heatRisk = getHeatRiskLevel(weatherData.heatIndex)
  const uvRisk = getUVRiskLevel(weatherData.uvIndex)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Widget 1: Current Weather Conditions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Current Weather
        </h3>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {weatherData.temperature}°F
            </div>
            <div className="text-sm text-gray-600">Temperature</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Humidity</div>
              <div className="font-medium">{weatherData.humidity}%</div>
            </div>
            <div>
              <div className="text-gray-600">UV Index</div>
              <div className={`font-medium ${uvRisk.color}`}>
                {weatherData.uvIndex} - {uvRisk.level}
              </div>
            </div>
          </div>
          
          <div className={`p-3 rounded-lg ${heatRisk.bgColor}`}>
            <div className="text-sm text-gray-600 mb-1">Heat Index</div>
            <div className={`text-lg font-semibold ${heatRisk.color}`}>
              {weatherData.heatIndex}°F - {heatRisk.level} Risk
            </div>
          </div>
        </div>
      </div>

      {/* Widget 2: Temperature Trend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Temperature Trend
        </h3>
        <div className="h-32 flex items-center justify-center">
          <LineChart 
            data={temperatureTrend} 
            color="#3b82f6"
          />
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-xs text-center">
          {temperatureTrend.map((temp, index) => (
            <div key={index} className="text-gray-600">
              {temp}°
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Last 7 readings
        </p>
      </div>

      {/* Widget 3: Health Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Health Metrics
        </h3>
        <div className="space-y-4">
          <ProgressBar
            value={Math.round(healthMetrics.hydration)}
            max={100}
            color="#10b981"
            label="Hydration Level"
          />
          
          <ProgressBar
            value={Math.round(healthMetrics.sunExposure)}
            max={100}
            color="#f59e0b"
            label="Sun Exposure"
          />
          
          <ProgressBar
            value={Math.round(healthMetrics.activityLevel)}
            max={100}
            color="#3b82f6"
            label="Activity Level"
          />
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-900 mb-1">
            💡 Recommendation
          </div>
          <div className="text-xs text-blue-700">
            {weatherData.heatIndex >= 90 
              ? "Stay hydrated and limit outdoor activities"
              : weatherData.heatIndex >= 80
              ? "Take breaks in shade and drink water regularly"
              : "Enjoy outdoor activities with sun protection"
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopWidgets
