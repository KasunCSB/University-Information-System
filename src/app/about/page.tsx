'use client'

import Link from 'next/link'
import Header from '@/components/Header'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="section-padding">
        <div className="container-responsive">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-responsive-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              About UIS
            </h1>
            <p className="text-responsive-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A comprehensive University Information System designed to connect and empower Sri Lankan higher education institutions
            </p>
          </div>

          {/* Mission Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 mb-12">
              <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Our Mission
              </h2>
              <p className="text-responsive-lg text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                To revolutionize higher education in Sri Lanka by providing a unified, accessible, and efficient platform 
                that connects universities, students, faculty, and administrators in a seamless digital ecosystem.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-3">
                Student-Centered
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Designed with students in mind, providing easy access to courses, grades, schedules, and academic resources.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-3">
                Cloud-Based
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Accessible from anywhere with an internet connection, ensuring continuity of education and administration.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-3">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built with security and privacy at its core, protecting sensitive academic and personal information.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-3">
                University Network
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connecting all major Sri Lankan universities in a unified system for better collaboration and resource sharing.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-3">
                Mobile Responsive
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fully responsive design that works seamlessly on desktops, tablets, and mobile devices.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🆓</div>
              <h3 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-3">
                Free & Open Source
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Completely free to use and open source, promoting transparency and community-driven development.
              </p>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-16">
            <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Built with Modern Technology
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
                <div className="text-2xl mb-2">⚛️</div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">React & Next.js</span>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
                <div className="text-2xl mb-2">🎨</div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Tailwind CSS</span>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
                <div className="text-2xl mb-2">📱</div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Progressive Web App</span>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
                <div className="text-2xl mb-2">🔧</div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">TypeScript</span>
              </div>
            </div>
          </div>

          {/* Team/Contact Section */}
          <div className="text-center mb-16">
            <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white mb-6">
              Get Involved
            </h2>
            <p className="text-responsive-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              UIS is an open-source project welcoming contributions from developers, educators, and institutions. 
              Join us in building the future of university education technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="https://github.com/KasunCSB/University-Information-System"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>View on GitHub</span>
              </Link>
              <Link
                href="/contact"
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <span>📧</span>
                <span>Contact Us</span>
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
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
