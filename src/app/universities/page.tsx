'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Image from 'next/image'
import Link from 'next/link'

const universities = [
  {
    name: "University of Colombo",
    established: 1921,
    location: "Colombo",
    logo: "/images/feature-img1.png",
    description: "The oldest university in Sri Lanka, renowned for its academic excellence and vibrant campus life.",
    website: "https://cmb.ac.lk/",
    students: "12,000+",
    faculties: "9",
    programs: "65+"
  },
  {
    name: "University of Peradeniya",
    established: 1942,
    location: "Peradeniya, Kandy",
    logo: "/images/feature-img2.png",
    description: "Nestled in the hills, Peradeniya is known for its beautiful campus and strong research culture.",
    website: "https://www.pdn.ac.lk/",
    students: "15,000+",
    faculties: "10",
    programs: "70+"
  },
  {
    name: "University of Kelaniya",
    established: 1959,
    location: "Kelaniya",
    logo: "/images/feature-img3.png",
    description: "A leader in humanities, social sciences, and modern technology education.",
    website: "https://www.kln.ac.lk/",
    students: "11,000+",
    faculties: "8",
    programs: "55+"
  },
  {
    name: "University of Moratuwa",
    established: 1966,
    location: "Moratuwa",
    logo: "/images/feature-img4.png",
    description: "Sri Lanka's premier engineering and technology university, driving innovation and industry partnerships.",
    website: "https://www.mrt.ac.lk/",
    students: "10,000+",
    faculties: "5",
    programs: "40+"
  }
]

export default function UniversitiesPage() {
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <div className="section-padding">
        <div className="container-responsive">
          <div className="text-center mb-10">
            <h1 className="text-responsive-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Partner Universities
            </h1>
            <p className="text-responsive-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore the prestigious universities connected through the UIS platform, each contributing to Sri Lanka's higher education excellence.
            </p>
          </div>

          {/* University Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {universities.map((uni, idx) => (
              <div
                key={uni.name}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedUniversity === idx ? 'ring-2 ring-blue-500 scale-[1.02]' : ''
                }`}
                onClick={() => setSelectedUniversity(selectedUniversity === idx ? null : idx)}
              >
                {/* University Header */}
                <div className="flex items-start space-x-6 mb-6">
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image
                      src={uni.logo}
                      alt={uni.name}
                      fill
                      className="object-contain rounded-xl bg-gray-100 dark:bg-gray-700"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-responsive-xl font-bold text-gray-900 dark:text-white mb-2">
                      {uni.name}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center space-x-1">
                        <span>📍</span>
                        <span>{uni.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>📅</span>
                        <span>Est. {uni.established}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* University Description */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {uni.description}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-responsive-lg font-bold text-blue-600 dark:text-blue-400">
                      {uni.students}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Students</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-responsive-lg font-bold text-green-600 dark:text-green-400">
                      {uni.faculties}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Faculties</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-responsive-lg font-bold text-purple-600 dark:text-purple-400">
                      {uni.programs}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Programs</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Link
                    href={uni.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium text-sm flex items-center space-x-1 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Visit Website</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                  <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <svg 
                      className={`w-5 h-5 transition-transform ${selectedUniversity === idx ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Expanded Content */}
                {selectedUniversity === idx && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-t border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      UIS Integration Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">✅</span>
                        <span>Seamless student registration and enrollment</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">✅</span>
                        <span>Digital grade management and transcripts</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">✅</span>
                        <span>Integrated course scheduling and management</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">✅</span>
                        <span>Real-time communication with faculty and staff</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <section className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 lg:p-12 text-white">
            <h2 className="text-responsive-2xl font-bold mb-4">
              Your University Not Listed?
            </h2>
            <p className="text-responsive-lg mb-8 opacity-90">
              We're continuously expanding our network. Contact us to learn about joining the UIS platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/Support?tab=contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/about"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Learn More
              </Link>
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
