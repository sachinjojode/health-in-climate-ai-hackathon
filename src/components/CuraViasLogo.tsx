import React from 'react'

interface CuraViasLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

/**
 * CuraVias Logo Component
 * A medical-themed logo with a cross symbol and the CuraVias brand name
 */
const CuraViasLogo: React.FC<CuraViasLogoProps> = ({ 
  size = 'md', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} bg-cura-500 rounded-xl flex items-center justify-center shadow-lg`}>
        <svg 
          className="w-3/4 h-3/4 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold text-cura-700`}>
            CuraVias
          </span>
          <span className="text-xs text-cura-600 font-medium">
            Health Monitoring
          </span>
        </div>
      )}
    </div>
  )
}

export default CuraViasLogo
