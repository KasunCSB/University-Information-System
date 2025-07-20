'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'

export default function ContactPage() {
  const router = useRouter()
  
  // Reusable link class for consistency
  const linkCardClassName = "block p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition-shadow text-center"

  useEffect(() => {
    // Redirect to support page with contact tab after a short delay
    const timer = setTimeout(() => {
      try {
        router.push('/Support?tab=contact')
      } catch (error) {
        console.error('Navigation error:', error)
        // Fallback to window.location if router fails
        if (typeof window !== 'undefined') {
          window.location.href = '/Support?tab=contact'
        }
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="section-padding">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto text-center">
            {/* Header Section */}
            <div className="mb-12">
              <h1 className="text-responsive-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Us
              </h1>
              <p className="text-responsive-xl text-gray-600 dark:text-gray-300 mb-8">
                Get in touch with our support team for assistance with UIS
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-4">📧</div>
                <h2 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Technical Support
                </h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center justify-center space-x-2">
                    <span>✉️</span>
                    <span>support@university-uis.edu</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>📞</span>
                    <span>+94 11 123 4567</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🕒</span>
                    <span>Mon-Fri, 8:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-4">🎓</div>
                <h2 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Academic Support
                </h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center justify-center space-x-2">
                    <span>✉️</span>
                    <span>academic@university-uis.edu</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>📞</span>
                    <span>+94 11 123 4568</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🏢</span>
                    <span>Academic Office, Building A</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Redirect Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 mb-8">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-responsive-lg font-semibold text-gray-900 dark:text-white mb-4">
                Redirecting to Support Center...
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You'll be automatically redirected to our comprehensive Support Center where you can access 
                our contact form, FAQ, and additional resources.
              </p>
              
              {/* Manual Navigation */}
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/Support?tab=contact"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <span>📧</span>
                  <span>Go to Contact Form</span>
                </Link>
                <Link
                  href="/Support?tab=faq"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors inline-flex items-center space-x-2"
                >
                  <span>❓</span>
                  <span>View FAQ</span>
                </Link>
                <Link
                  href="/Support"
                  className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
                >
                  <span>🏠</span>
                  <span>Support Center</span>
                </Link>
              </div>
            </div>

            {/* Alternative Contact Methods */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
              <h3 className="text-responsive-lg font-semibold text-gray-900 dark:text-white mb-6">
                Other Ways to Reach Us
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Link
                  href="/Support?tab=github"
                  className={linkCardClassName}
                >
                  <div className="text-2xl mb-2">🐛</div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Report Issues</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">GitHub Issues</p>
                </Link>
                
                <Link
                  href="/Support?tab=tips"
                  className={linkCardClassName}
                >
                  <div className="text-2xl mb-2">💡</div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Tips & Tricks</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Help Yourself</p>
                </Link>
                
                <Link
                  href="/about"
                  className={linkCardClassName}
                >
                  <div className="text-2xl mb-2">ℹ️</div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">About UIS</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Learn More</p>
                </Link>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-12">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
