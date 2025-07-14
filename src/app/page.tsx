'use client'

import { useState } from 'react'
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
      
      {/* Universities Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-responsive">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-responsive-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Participating Universities
            </h2>
            <p className="text-responsive-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join the growing network of Sri Lankan universities using our platform
            </p>
          </div>
          
          <div className="grid-responsive-4">
            {[
              { 
                name: "University of Colombo", 
                students: "15,000+", 
                established: "1921",
                location: "Colombo"
              },
              { 
                name: "University of Peradeniya", 
                students: "12,000+", 
                established: "1942",
                location: "Kandy"
              },
              { 
                name: "University of Kelaniya", 
                students: "10,000+", 
                established: "1959",
                location: "Kelaniya"
              },
              { 
                name: "University of Moratuwa", 
                students: "8,000+", 
                established: "1966",
                location: "Moratuwa"
              },
            ].map((uni, index) => (
              <div key={index} className="card-responsive hover:transform hover:-translate-y-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-2 text-responsive-base">
                  {uni.name}
                </h3>
                <div className="text-center space-y-1">
                  <p className="text-responsive-sm text-blue-600 dark:text-blue-400 font-medium">
                    {uni.students} Students
                  </p>
                  <p className="text-responsive-xs text-gray-500 dark:text-gray-400">
                    Est. {uni.established}
                  </p>
                  <p className="text-responsive-xs text-gray-500 dark:text-gray-400">
                    📍 {uni.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-blue-600">
        <div className="container-responsive">
          <div className="grid-responsive-4 text-center">
            <div>
              <div className="text-responsive-4xl font-bold text-white mb-2">25+</div>
              <div className="text-blue-100 text-responsive-base">Universities</div>
            </div>
            <div>
              <div className="text-responsive-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-blue-100 text-responsive-base">Active Students</div>
            </div>
            <div>
              <div className="text-responsive-4xl font-bold text-white mb-2">100,000+</div>
              <div className="text-blue-100 text-responsive-base">Assignments Submitted</div>
            </div>
            <div>
              <div className="text-responsive-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100 text-responsive-base">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container-responsive">
          <div className="grid-responsive-4">
            <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
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
              <p className="text-gray-400 text-responsive-sm">
                Connecting Sri Lankan universities through technology and innovation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-responsive-base">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-responsive-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Universities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-responsive-base">Support</h4>
              <ul className="space-y-2 text-gray-400 text-responsive-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-responsive-base">Connect</h4>
              <ul className="space-y-2 text-gray-400 text-responsive-sm">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-responsive-sm">&copy; 2025 University Information System. Open source and free for all Sri Lankan universities.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
