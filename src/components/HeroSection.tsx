'use client'

import { useState } from 'react'

export default function HeroSection() {
  const [activeCard, setActiveCard] = useState<'main' | 'card1' | 'card2'>('main')

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 section-padding">
      <div className="container-responsive">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-responsive-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Unifying Sri Lankan
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {" "}Universities
                </span>
              </h1>
              <p className="text-responsive-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A free, cloud-based Learning Management System connecting all universities 
                across Sri Lanka. Access your courses, submit assignments, and collaborate 
                from anywhere.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-responsive-sm font-medium text-gray-700 dark:text-gray-300">Free & Open Source</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <span className="text-responsive-sm font-medium text-gray-700 dark:text-gray-300">Cloud-Based</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span className="text-responsive-sm font-medium text-gray-700 dark:text-gray-300">Secure Access</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="btn-primary text-responsive-base">
                Get Started Free
              </button>
              <button className="btn-secondary text-responsive-base">
                Learn More
              </button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative lg:ml-8 order-first lg:order-last">
            <div className="relative">
              {/* Background Card 1 - Furthest back */}
              <div 
                className={`absolute transition-all duration-500 cursor-pointer ${
                  activeCard === 'card1' 
                    ? 'top-0 left-0 z-30 scale-105 opacity-100 rotate-0' 
                    : '-top-6 -left-4 z-10 opacity-40 rotate-6 hover:opacity-60 hover:scale-105'
                }`}
                onClick={() => setActiveCard(activeCard === 'card1' ? 'main' : 'card1')}
              >
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-purple-200 dark:border-purple-700">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-purple-200 dark:ring-purple-800">
                        <span className="text-white font-bold text-sm">TP</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-responsive-base truncate">Thilini Perera</h3>
                        <p className="text-responsive-sm text-gray-500 dark:text-gray-400 truncate">University of Colombo</p>
                      </div>
                      {activeCard !== 'card1' && (
                        <div className="text-purple-600 dark:text-purple-400 text-xs font-medium bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
                          Click to view
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/90 dark:bg-gray-700/90 p-3 rounded-lg transform hover:scale-105 transition-transform duration-300">
                        <h4 className="font-medium text-purple-900 dark:text-purple-100 text-responsive-sm">Projects</h4>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">5</p>
                      </div>
                      <div className="bg-white/90 dark:bg-gray-700/90 p-3 rounded-lg transform hover:scale-105 transition-transform duration-300">
                        <h4 className="font-medium text-pink-900 dark:text-pink-100 text-responsive-sm">Grade</h4>
                        <p className="text-lg font-bold text-pink-600 dark:text-pink-400">A</p>
                      </div>
                    </div>
                    {activeCard === 'card1' && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-responsive-base">Recent Activity</h4>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3 p-2 bg-white/70 dark:bg-gray-600/70 rounded hover:bg-white/90 dark:hover:bg-gray-500/90 transition-colors duration-200">
                            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                            <span className="text-responsive-sm text-gray-700 dark:text-gray-300 truncate">Project completed</span>
                          </div>
                          <div className="flex items-center space-x-3 p-2 bg-white/70 dark:bg-gray-600/70 rounded hover:bg-white/90 dark:hover:bg-gray-500/90 transition-colors duration-200">
                            <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0"></div>
                            <span className="text-responsive-sm text-gray-700 dark:text-gray-300 truncate">Grade updated</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Background Card 2 - Middle */}
              <div 
                className={`absolute transition-all duration-500 cursor-pointer ${
                  activeCard === 'card2' 
                    ? 'top-0 left-0 z-30 scale-105 opacity-100 rotate-0' 
                    : '-top-3 -right-3 z-20 opacity-60 -rotate-3 hover:opacity-80 hover:scale-105'
                }`}
                onClick={() => setActiveCard(activeCard === 'card2' ? 'main' : 'card2')}
              >
                <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-800 dark:to-red-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-orange-200 dark:border-orange-700">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-orange-200 dark:ring-orange-800">
                        <span className="text-white font-bold text-sm">AR</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-responsive-base truncate">Amal Rathnayake</h3>
                        <p className="text-responsive-sm text-gray-500 dark:text-gray-400 truncate">University of Peradeniya</p>
                      </div>
                      {activeCard !== 'card2' && (
                        <div className="text-orange-600 dark:text-orange-400 text-xs font-medium bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded">
                          Click to view
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/90 dark:bg-gray-700/90 p-3 rounded-lg transform hover:scale-105 transition-transform duration-300">
                        <h4 className="font-medium text-orange-900 dark:text-orange-100 text-responsive-sm">Labs</h4>
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">7</p>
                      </div>
                      <div className="bg-white/90 dark:bg-gray-700/90 p-3 rounded-lg transform hover:scale-105 transition-transform duration-300">
                        <h4 className="font-medium text-red-900 dark:text-red-100 text-responsive-sm">Research</h4>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">3</p>
                      </div>
                    </div>
                    {activeCard === 'card2' && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-responsive-base">Recent Activity</h4>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3 p-2 bg-white/70 dark:bg-gray-600/70 rounded hover:bg-white/90 dark:hover:bg-gray-500/90 transition-colors duration-200">
                            <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                            <span className="text-responsive-sm text-gray-700 dark:text-gray-300 truncate">Lab session completed</span>
                          </div>
                          <div className="flex items-center space-x-3 p-2 bg-white/70 dark:bg-gray-600/70 rounded hover:bg-white/90 dark:hover:bg-gray-500/90 transition-colors duration-200">
                            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                            <span className="text-responsive-sm text-gray-700 dark:text-gray-300 truncate">Research paper submitted</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Card - Front */}
              <div 
                className={`relative transition-all duration-500 cursor-pointer ${
                  activeCard === 'main' 
                    ? 'z-30 scale-100' 
                    : 'z-10 scale-90 opacity-70'
                }`}
                onClick={() => setActiveCard('main')}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 transform hover:scale-105 transition-all duration-300 hover:rotate-1 border border-gray-100 dark:border-gray-700">
                  {/* Mock Dashboard */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-green-200 dark:ring-green-800">
                        <span className="text-white font-bold text-sm">TB</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-responsive-base truncate">Tharindu Bandara</h3>
                        <p className="text-responsive-sm text-gray-500 dark:text-gray-400 truncate">University of Kelaniya</p>
                      </div>
                      </div>
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 sm:px-3 py-1 rounded-full text-responsive-xs font-medium flex-shrink-0">
                        Active
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg transform hover:scale-105 transition-transform duration-300">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 text-responsive-sm">Courses</h4>
                        <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">8</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg transform hover:scale-105 transition-transform duration-300">
                        <h4 className="font-medium text-green-900 dark:text-green-100 text-responsive-sm">Assignments</h4>
                        <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">12</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white text-responsive-base">Recent Activity</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-responsive-sm text-gray-700 dark:text-gray-300 truncate">Assignment submitted</span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span className="text-responsive-sm text-gray-700 dark:text-gray-300 truncate">New course material</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
