'use client'

import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="section-padding">
        <div className="container-responsive">
          {/* Hero Section */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-responsive-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About UIS
            </h1>
            <p className="text-responsive-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              The University Information System (UIS) is a comprehensive digital platform designed to streamline 
              academic management, enhance student experience, and foster seamless communication across Sri Lankan universities.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 lg:p-12">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-responsive-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  To revolutionize higher education management in Sri Lanka by providing an intuitive, 
                  secure, and efficient digital ecosystem that connects students, faculty, and administrators 
                  while promoting academic excellence and administrative efficiency.
                </p>
              </div>
            </div>
          </section>

          {/* Key Features Grid */}
          <section className="mb-16">
            <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Why Choose UIS?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎓",
                  title: "Student-Centric Design",
                  description: "Intuitive interface designed specifically for students and educators with easy navigation and mobile-friendly access."
                },
                {
                  icon: "🔒",
                  title: "Secure & Reliable",
                  description: "Built with modern security practices, encryption, and reliable infrastructure to protect your academic data."
                },
                {
                  icon: "📊",
                  title: "Real-time Analytics",
                  description: "Comprehensive dashboards and reporting tools for tracking academic progress and institutional metrics."
                },
                {
                  icon: "🌐",
                  title: "Multi-University Support",
                  description: "Seamlessly connects multiple universities across Sri Lanka under one unified platform."
                },
                {
                  icon: "📱",
                  title: "Mobile Responsive",
                  description: "Fully responsive design that works perfectly on all devices - desktop, tablet, and mobile."
                },
                {
                  icon: "🔄",
                  title: "Regular Updates",
                  description: "Continuous improvements and feature updates based on user feedback and technological advances."
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-responsive-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-responsive-base">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* University Partners */}
          <section className="mb-16">
            <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Partner Universities
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "University of Colombo", established: "1921" },
                  { name: "University of Peradeniya", established: "1942" },
                  { name: "University of Kelaniya", established: "1959" },
                  { name: "University of Moratuwa", established: "1966" }
                ].map((uni, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow"
                  >
                    <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">
                        {uni.name.split(' ').map(word => word[0]).join('')}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {uni.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      Est. {uni.established}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="mb-16">
            <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Built with Modern Technology
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Frontend</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p>Next.js 14</p>
                    <p>React 18</p>
                    <p>TypeScript</p>
                    <p>Tailwind CSS</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p>Server-Side Rendering</p>
                    <p>Progressive Web App</p>
                    <p>Dark Mode Support</p>
                    <p>Mobile Responsive</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Development</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p>Git Version Control</p>
                    <p>ESLint & Prettier</p>
                    <p>Component-Based</p>
                    <p>Open Source</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 lg:p-12 text-white">
              <h2 className="text-responsive-2xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-responsive-lg mb-8 opacity-90">
                Join thousands of students and faculty already using UIS to enhance their academic experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/login"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Login to UIS
                </Link>
                <Link
                  href="/Support?tab=contact"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </section>

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
  )
}
