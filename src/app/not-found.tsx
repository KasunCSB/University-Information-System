'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { useState, useEffect } from 'react'

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false
})

export default function NotFound() {
  const [animationData, setAnimationData] = useState(null)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Preload both Lottie component and animation data simultaneously
    Promise.all([
      import('lottie-react'),
      fetch('/lottie/not-found.json').then(res => res.json())
    ]).then(([, data]) => {
      setAnimationData(data)
      // Small delay to ensure smooth rendering
      requestAnimationFrame(() => {
        setShowContent(true)
      })
    }).catch(error => {
      console.error('Error loading resources:', error)
      // Show content even if animation fails
      setShowContent(true)
    })
  }, [])

  // Return nothing until everything is ready
  if (!showContent) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          {/* Lottie Animation */}
          <div className="mb-8 flex justify-center">
            <div className="w-64 h-64">
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer - Simple version for 404 page */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">UIS</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">University Information System</p>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; 2025 University Information System. Open source and free for all Sri Lankan universities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
