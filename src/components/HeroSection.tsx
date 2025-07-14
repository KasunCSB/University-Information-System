export default function HeroSection() {
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
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 transform hover:scale-105 transition-transform duration-300">
              {/* Mock Dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-responsive-base truncate">Kamal Perera</h3>
                      <p className="text-responsive-sm text-gray-500 dark:text-gray-400 truncate">University of Kelaniya</p>
                    </div>
                  </div>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 sm:px-3 py-1 rounded-full text-responsive-xs font-medium flex-shrink-0">
                    Active
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 text-responsive-sm">Courses</h4>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">8</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 dark:text-green-100 text-responsive-sm">Assignments</h4>
                    <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">12</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white text-responsive-base">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-responsive-sm text-gray-700 dark:text-gray-300 truncate">Assignment submitted</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
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
    </section>
  )
}
