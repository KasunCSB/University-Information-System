'use client'

import { useState } from 'react'
import Image from 'next/image'
import LoadingScreen from '@/components/LoadingScreen'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <HeroSection />
      <FeaturesSection />
      
      {/* Extended Features Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-responsive">
          <div className="text-center mb-8 lg:mb-10">
            <h2 className="text-responsive-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose UIS?
            </h2>
            <p className="text-responsive-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A comprehensive university management platform built with modern technology and user-friendly design
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6 lg:space-y-8">
              {[
                {
                  image: "/images/feature-img1.png",
                  title: "Student-Centric Design",
                  description: "Intuitive interface designed for students and educators. Easy navigation, mobile-friendly, and accessible from any device."
                },
                {
                  image: "/images/feature-img2.png",
                  title: "Reliable & Secure",
                  description: "Built with security best practices and reliable infrastructure. Your academic data is protected with modern encryption and secure authentication systems."
                },
                {
                  image: "/images/feature-img3.png",
                  title: "Modern Technology",
                  description: "Built with cutting-edge web technologies for fast performance, real-time updates, and seamless user experience across all devices and platforms."
                },
                {
                  image: "/images/feature-img4.png",
                  title: "Open Source",
                  description: "Completely free and open source software. Universities can customize, extend, and contribute to the platform. No licensing fees or vendor lock-in."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:transform hover:-translate-y-2 transition-all duration-300 ease-in-out">
                  <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center`}>
                    {/* Feature Image */}
                    <div className="w-full lg:w-1/2 relative">
                      <div className="aspect-[3/2] relative bg-transparent flex items-center justify-center">
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          fill
                          className="object-contain select-none scale-75"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      </div>
                    </div>
                    
                    {/* Feature Content */}
                    <div className={`w-full lg:w-1/2 p-4 sm:p-5 lg:p-6 text-center lg:text-left ${index % 2 !== 0 ? 'lg:ml-8' : ''}`}>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Stats */}
      <section className="section-padding bg-blue-600">
        <div className="container-responsive">
          <div className="text-center mb-8">
            <h2 className="text-responsive-3xl font-bold text-white mb-4">
              Platform Capabilities
            </h2>
            <p className="text-blue-100 text-responsive-lg max-w-2xl mx-auto">
              Designed to handle the complete academic workflow
            </p>
          </div>
          <div className="grid-responsive-4 text-center">
            <div>
              <div className="text-responsive-4xl font-bold text-white mb-2">∞</div>
              <div className="text-blue-100 text-responsive-base">Unlimited Courses</div>
            </div>
            <div>
              <div className="text-responsive-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100 text-responsive-base">Access Availability</div>
            </div>
            <div>
              <div className="text-responsive-4xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-100 text-responsive-base">Open Source</div>
            </div>
            <div>
              <div className="text-responsive-4xl font-bold text-white mb-2">0</div>
              <div className="text-blue-100 text-responsive-base">Licensing Costs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container-responsive">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-responsive-xl">UIS</h3>
                  <p className="text-gray-400 text-responsive-sm">University Information System</p>
                </div>
              </div>
              <p className="text-gray-400 text-responsive-sm max-w-md">
                An open-source university management platform designed to streamline academic workflows and enhance educational experiences.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-responsive-base">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-responsive-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Installation Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contributing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-responsive-base">Community</h4>
              <ul className="space-y-2 text-gray-400 text-responsive-sm">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Issues</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discussions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Releases</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-responsive-sm">&copy; 2025 UIS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
