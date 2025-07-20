'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'

const faqs = [
  {
    question: "How do I reset my UIS password?",
    answer: "You can reset your password by clicking the 'Forgot Password' link on the login page. Enter your username or email, and you'll receive reset instructions."
  },
  {
    question: "Why can't I access certain features?",
    answer: "Access to features depends on your user role (student, faculty, admin). Contact your university's IT department if you believe you should have access to additional features."
  },
  {
    question: "How do I update my profile information?",
    answer: "After logging in, navigate to your profile section where you can update your personal information, contact details, and preferences."
  },
  {
    question: "Is UIS mobile-friendly?",
    answer: "Yes! UIS is designed to be fully responsive and works seamlessly on mobile devices, tablets, and desktops."
  },
  {
    question: "How do I report a technical issue?",
    answer: "You can report issues through our GitHub repository or contact support directly. Include details about your browser, device, and steps to reproduce the issue."
  }
]

const tips = [
  {
    title: "Keep Your Browser Updated",
    description: "For the best experience, use the latest version of Chrome, Firefox, Safari, or Edge.",
    icon: "🌐"
  },
  {
    title: "Enable Notifications",
    description: "Allow browser notifications to receive important updates about your academic activities.",
    icon: "🔔"
  },
  {
    title: "Use Bookmarks",
    description: "Bookmark frequently used pages like your dashboard, course materials, and grade reports.",
    icon: "⭐"
  },
  {
    title: "Regular Data Backup",
    description: "Download and backup important documents and course materials regularly.",
    icon: "💾"
  },
  {
    title: "Check System Status",
    description: "Visit our status page during maintenance windows or if you experience connectivity issues.",
    icon: "📊"
  }
]

// Separate component for search params to avoid hydration issues
function SupportContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('faq')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  // Set initial tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams?.get('tab')
    if (tabParam && ['faq', 'contact', 'github', 'tips'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Reusable form input class
  const inputClassName = "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  
  // Reusable resource link class
  const resourceLinkClassName = "block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <div className="section-padding">
      <div className="container-responsive">
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-responsive-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Support Center
          </h1>
          <p className="text-responsive-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions, get help, and learn tips to make the most of your UIS experience
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'faq', label: 'FAQ', icon: '❓' },
            { id: 'contact', label: 'Contact', icon: '📧' },
            { id: 'github', label: 'Report Issue', icon: '🐛' },
            { id: 'tips', label: 'Tips & Tricks', icon: '💡' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <h3 className="text-responsive-lg font-semibold text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        expandedFAQ === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 dark:text-gray-300 text-responsive-base">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Section */}
        {activeTab === 'contact' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Get in Touch
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Technical Support
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-600">📧</span>
                    <span className="text-gray-600 dark:text-gray-300">support@university-uis.edu</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-600">📞</span>
                    <span className="text-gray-600 dark:text-gray-300">+94 11 123 4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-600">🕒</span>
                    <span className="text-gray-600 dark:text-gray-300">Mon-Fri, 8:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Academic Support
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">📧</span>
                    <span className="text-gray-600 dark:text-gray-300">academic@university-uis.edu</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">📞</span>
                    <span className="text-gray-600 dark:text-gray-300">+94 11 123 4568</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">🏢</span>
                    <span className="text-gray-600 dark:text-gray-300">Academic Office, Building A</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Contact
              </h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className={inputClassName}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className={inputClassName}
                  />
                </div>
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className={inputClassName}
                ></textarea>
                <button type="submit" className="btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}

        {/* GitHub Issues Section */}
        {activeTab === 'github' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Report Issues on GitHub
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🐛</div>
                <p className="text-gray-600 dark:text-gray-300 text-responsive-lg">
                  Found a bug or have a feature request? Help us improve UIS by reporting it on GitHub.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h3 className="text-responsive-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                    🐛 Bug Reports
                  </h3>
                  <p className="text-red-600 dark:text-red-300 text-sm">
                    Report functionality issues, errors, or unexpected behavior
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-responsive-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    💡 Feature Requests
                  </h3>
                  <p className="text-blue-600 dark:text-blue-300 text-sm">
                    Suggest new features or improvements to existing functionality
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Before reporting an issue, please:
                </h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                  <li className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>Check if the issue already exists in our repository</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>Include detailed steps to reproduce the problem</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>Mention your browser, device, and operating system</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>Add screenshots if the issue is visual</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Link
                  href="https://github.com/KasunCSB/University-Information-System/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>Report Issue on GitHub</span>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Repository: KasunCSB/University-Information-System
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        {activeTab === 'tips' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Tips & Tricks
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <div className="text-3xl mb-4">{tip.icon}</div>
                  <h3 className="text-responsive-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-responsive-base">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Additional Resources */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8">
              <h3 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Additional Resources
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <Link
                  href="/"
                  className={resourceLinkClassName}
                >
                  <div className="text-2xl mb-2">🏠</div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Home Page</span>
                </Link>
                <Link
                  href="/login"
                  className={resourceLinkClassName}
                >
                  <div className="text-2xl mb-2">🔐</div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Login Portal</span>
                </Link>
                <Link
                  href="/signup"
                  className={resourceLinkClassName}
                >
                  <div className="text-2xl mb-2">📝</div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Sign Up</span>
                </Link>
              </div>
            </div>
          </div>
        )}

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
  )
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
      }>
        <SupportContent />
      </Suspense>
    </div>
  )
}
