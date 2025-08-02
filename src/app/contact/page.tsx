'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  // Reusable form input class
  const inputClassName = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 transition-colors"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle contact form submission here
    if (process.env.NODE_ENV === 'development') {
      console.log('Contact form submitted:', formData)
    }
    // You could add API call here
    alert('Thank you for your message! We will get back to you soon.')
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="section-padding">
        <div className="container-responsive">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-responsive-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Us
            </h1>
            <p className="text-responsive-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get in touch with our team for support, questions, or collaboration opportunities
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-8">
                  Get in Touch
                </h2>
                
                {/* Contact Cards */}
                <div className="space-y-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-responsive-lg font-semibold text-gray-900 dark:text-white">Email</h3>
                        <p className="text-gray-600 dark:text-gray-300">support@university-uis.edu</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-responsive-lg font-semibold text-gray-900 dark:text-white">Phone</h3>
                        <p className="text-gray-600 dark:text-gray-300">+94 11 123 4567</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-responsive-lg font-semibold text-gray-900 dark:text-white">GitHub</h3>
                        <p className="text-gray-600 dark:text-gray-300">github.com/KasunCSB/University-Information-System</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
                  <h3 className="text-responsive-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Support Hours
                  </h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p><span className="font-medium">Monday - Friday:</span> 8:00 AM - 6:00 PM</p>
                    <p><span className="font-medium">Saturday:</span> 9:00 AM - 2:00 PM</p>
                    <p><span className="font-medium">Sunday:</span> Closed</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-8">
                  Send us a Message
                </h2>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className={inputClassName}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className={inputClassName}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={inputClassName}
                        placeholder="What is this about?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        className={inputClassName}
                        placeholder="Please describe your question or concern in detail..."
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full btn-primary flex justify-center items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Send Message</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Additional Help Section */}
            <div className="mt-16">
              <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Other Ways to Get Help
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Link
                  href="/Support?tab=faq"
                  className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 text-center"
                >
                  <div className="text-3xl mb-4">❓</div>
                  <h3 className="text-responsive-lg font-semibold text-gray-900 dark:text-white mb-2">
                    FAQ
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Find answers to commonly asked questions
                  </p>
                </Link>
                
                <Link
                  href="/Support?tab=github"
                  className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 text-center"
                >
                  <div className="text-3xl mb-4">🐛</div>
                  <h3 className="text-responsive-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Report a Bug
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Report technical issues on GitHub
                  </p>
                </Link>
                
                <Link
                  href="/Support?tab=tips"
                  className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 text-center"
                >
                  <div className="text-3xl mb-4">💡</div>
                  <h3 className="text-responsive-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Tips & Tricks
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Learn how to make the most of UIS
                  </p>
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
      <Footer />
    </div>
  )
}
