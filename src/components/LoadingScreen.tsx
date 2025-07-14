'use client'

import { useEffect, useState } from 'react'

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete(), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* University Logo Animation */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-blue-600" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in">
            University Information System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 animate-fade-in-delay">
            Connecting Sri Lankan Universities
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto space-y-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading... {Math.round(progress)}%
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}
