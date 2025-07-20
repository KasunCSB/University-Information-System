'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

export default function EmailVerificationPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const handleResend = async () => {
    setIsResending(true)
    setResendMessage('')
    
    // Dummy handler function - simulate API call
    setTimeout(() => {
      setIsResending(false)
      setResendMessage('Verification email sent successfully!')
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setResendMessage('')
      }, 5000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">          
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Verify Your Email Address
            </h1>
            
            {/* Email Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-2">
              We have sent a verification link to{' '}
              <span className="font-medium text-blue-600 dark:text-blue-400">
                example@university.ac.lk
              </span>
              .
            </p>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              Click on the link to complete the verification process.
            </p>
          </div>

          {/* Verification Card */}
          <div className="bg-white dark:bg-gray-800 py-8 px-6 sm:px-8 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="space-y-6">
              {/* Status Message */}
              {resendMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-400 text-center">
                    {resendMessage}
                  </p>
                </div>
              )}

              {/* Instructions */}
              <div className="text-center space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    <strong>Check your inbox:</strong> The email may take a few minutes to arrive. 
                    Don&apos;t forget to check your spam folder.
                  </p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Didn&apos;t receive the email?
                </p>

                {/* Resend Button */}
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isResending ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="text-center space-y-4">
            {/* Trouble with email verification */}
            <div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Trouble with email verification? Reset password instead
              </Link>
            </div>

            {/* Back to Home */}
            <div>
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
