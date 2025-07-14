export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      title: "Assignment Management",
      description: "Upload, submit, and track assignments with automated grading and feedback systems."
    },
    {
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      ),
      title: "Performance Analytics",
      description: "Comprehensive dashboards showing academic progress and performance metrics."
    },
    {
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 16H9V7h9v14z"/>
        </svg>
      ),
      title: "Course Materials",
      description: "Access lecture notes, videos, and resources from any device, anywhere."
    },
    {
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
        </svg>
      ),
      title: "Event Management",
      description: "Stay updated with university events, deadlines, and important announcements."
    },
    {
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: "Collaborative Learning",
      description: "Discussion forums, group projects, and peer-to-peer learning opportunities."
    },
    {
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>
      ),
      title: "Secure Access",
      description: "University email verification and role-based access control for students and staff."
    }
  ]

  return (
    <section className="section-padding bg-white dark:bg-gray-900">
      <div className="container-responsive">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-responsive-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need for Modern Education
          </h2>
          <p className="text-responsive-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our comprehensive platform brings together all the tools universities need 
            to deliver exceptional educational experiences.
          </p>
        </div>

        <div className="grid-responsive-3">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card-responsive hover:transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 sm:mb-6 shadow-sm mx-auto sm:mx-0">
                {feature.icon}
              </div>
              <h3 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-3 text-center sm:text-left">
                {feature.title}
              </h3>
              <p className="text-responsive-base text-gray-600 dark:text-gray-300 leading-relaxed text-center sm:text-left">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
