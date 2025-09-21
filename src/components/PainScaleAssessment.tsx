import React, { useState } from 'react'

interface PainScaleAssessmentProps {
  onComplete: (rating: number) => void
  patientRisk: 'low' | 'medium' | 'high'
}

/**
 * Pain Scale Assessment component with smiley faces
 * Based on the standard 0-10 pain scale used by healthcare professionals
 */
const PainScaleAssessment: React.FC<PainScaleAssessmentProps> = ({
  onComplete
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  // Reset state when component mounts (every time it's opened)
  React.useEffect(() => {
    setSelectedRating(null)
    setIsCompleted(false)
  }, [])

  const painScaleData = [
    { value: 0, emoji: '😊', label: 'No pain', description: 'I feel great!' },
    { value: 2, emoji: '🙂', label: 'Mild', description: 'A little uncomfortable' },
    { value: 4, emoji: '😐', label: 'Moderate', description: 'Noticeable discomfort' },
    { value: 6, emoji: '😕', label: 'Severe', description: 'Significant pain' },
    { value: 8, emoji: '😫', label: 'Very Severe', description: 'Intense pain' },
    { value: 10, emoji: '😵', label: 'Unbearable', description: 'Worst possible pain' }
  ]

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating)
  }

  const handleSubmit = () => {
    if (selectedRating !== null) {
      setIsCompleted(true)
      onComplete(selectedRating)
    }
  }

  if (isCompleted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Assessment Complete
        </h3>
        <p className="text-green-700">
          You rated your condition as: <span className="font-semibold">{selectedRating}/10</span>
        </p>
        <p className="text-sm text-green-600 mt-2">
          Thank you for providing this information to help us monitor your health.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          How are you feeling right now?
        </h3>
        <p className="text-blue-700 text-sm">
          Please rate your current condition on a scale of 0 (feeling great) to 10 (unbearable pain/discomfort)
        </p>
      </div>

      <div className="space-y-4">
        {painScaleData.map((item) => (
          <button
            key={item.value}
            onClick={() => handleRatingSelect(item.value)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedRating === item.value
                ? 'border-blue-500 bg-blue-100 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{item.emoji}</span>
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-900">
                  {item.value}/10 - {item.label}
                </div>
                <div className="text-sm text-gray-600">
                  {item.description}
                </div>
              </div>
              {selectedRating === item.value && (
                <div className="text-blue-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={selectedRating === null}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            selectedRating !== null
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit Assessment
        </button>
      </div>

      <div className="mt-4 text-xs text-blue-600 text-center">
        <p>This information helps Dr. Fitzpatrick's team provide better care</p>
      </div>
    </div>
  )
}

export default PainScaleAssessment
