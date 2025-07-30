'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthenticatedHeader from '@/components/AuthenticatedHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Course data with gradient backgrounds instead of images
const courses = [
  {
    id: 1,
    title: 'Computer Science Fundamentals',
    code: 'CS101',
    description: 'Learn fundamentals of computer science and programming',
    level: 'Level I',
    gradient: 'from-blue-500 to-cyan-500',
    category: 'Computer Science',
    lastAccessed: '2025-07-23',
    progress: 75,
    instructor: 'Dr. Sarah Johnson'
  },
  {
    id: 2,
    title: 'Advanced Mathematics',
    code: 'MATH201',
    description: 'Complex mathematical concepts and their applications',
    level: 'Level II',
    gradient: 'from-purple-500 to-pink-500',
    category: 'Mathematics',
    lastAccessed: '2025-07-24',
    progress: 60,
    instructor: 'Prof. Michael Chen'
  },
  {
    id: 3,
    title: 'Electronics Engineering',
    code: 'EE202',
    description: 'Study electronic circuits and systems',
    level: 'Level II',
    gradient: 'from-orange-500 to-red-500',
    category: 'Engineering',
    lastAccessed: '2025-07-22',
    progress: 45,
    instructor: 'Dr. Amanda Wilson'
  },
  {
    id: 4,
    title: 'Data Structures & Algorithms',
    code: 'CS301',
    description: 'Advanced programming concepts and algorithm design',
    level: 'Level III',
    gradient: 'from-green-500 to-emerald-500',
    category: 'Computer Science',
    lastAccessed: '2025-07-24',
    progress: 85,
    instructor: 'Dr. Robert Kim'
  },
  {
    id: 5,
    title: 'Machine Learning',
    code: 'CS401',
    description: 'Explore AI and machine learning concepts',
    level: 'Level III',
    gradient: 'from-indigo-500 to-purple-500',
    category: 'Computer Science',
    lastAccessed: '2025-07-21',
    progress: 30,
    instructor: 'Dr. Lisa Zhang'
  },
  {
    id: 6,
    title: 'Web Development',
    code: 'CS302',
    description: 'Learn modern web development technologies',
    level: 'Level II',
    gradient: 'from-teal-500 to-blue-500',
    category: 'Computer Science',
    lastAccessed: '2025-07-23',
    progress: 90,
    instructor: 'Dr. James Miller'
  },
]

const courseCategories = ['All', 'Computer Science', 'Mathematics', 'Engineering']
const sortOptions = [
  { value: 'last_accessed', label: 'Last accessed' },
  { value: 'name', label: 'Course name' },
  { value: 'level', label: 'Level' },
  { value: 'code', label: 'Course code' }
]

export default function DashboardPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('last_accessed')
  const [searchQuery, setSearchQuery] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const user = localStorage.getItem('user')
    
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    setUsername(user || 'User')
  }, [router])

  // Filter and sort courses
  const filteredAndSortedCourses = courses
    .filter(course => {
      const matchesCategory = category === 'All' || course.category === category
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'level':
          return a.level.localeCompare(b.level)
        case 'code':
          return a.code.localeCompare(b.code)
        default:
          return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
      }
    })

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <AuthenticatedHeader username={username} currentPage="dashboard" />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
        <div className="container-responsive py-6 sm:py-8 lg:py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              Welcome Back, {username}! 👋
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Ready to continue your learning journey? Track your progress and discover new courses.
            </p>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{courses.length}</div>
                <div className="text-blue-100 text-sm sm:text-base font-medium">Enrolled Courses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)}%
                </div>
                <div className="text-blue-100 text-sm sm:text-base font-medium">Average Progress</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {courses.filter(course => course.progress >= 80).length}
                </div>
                <div className="text-blue-100 text-sm sm:text-base font-medium">Near Completion</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container-responsive py-6 sm:py-8 lg:py-10">
        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/courses" className="group">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Browse Courses
                </span>
              </div>
            </Link>
            
            <Link href="/communication" className="group">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">
                  Messages
                </span>
              </div>
            </Link>
            
            <Link href="/university-info" className="group">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Universities
                </span>
              </div>
            </Link>
            
            <button className="group" onClick={() => setSearchQuery('assignment')}>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  Assignments
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Your Courses
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Continue learning from where you left off
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 sm:mb-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-sm"
              >
                {courseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 pr-4 py-3 text-sm"
                />
                <svg className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                View
              </label>
              <Button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                variant="outline"
                className="w-full justify-start px-4 py-3 h-auto"
              >
                {viewMode === 'grid' ? (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List View
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                    Grid View
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Course Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6' 
            : 'space-y-4'
        }`}>
          {filteredAndSortedCourses.map(course => (
            <Card key={course.id} className={`overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg ${
              viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
            }`}>
              {/* Course Header with Gradient */}
              <div className={`bg-gradient-to-r ${course.gradient} relative ${
                viewMode === 'list' ? 'sm:w-48 sm:min-h-full h-32 sm:h-auto' : 'h-36 sm:h-40'
              }`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/20">
                    {course.code}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/20">
                    {course.level}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors border border-white/20">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                
                {/* Progress indicator on image for list view */}
                {viewMode === 'list' && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full h-2 border border-white/20">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <CardContent className={`${viewMode === 'list' ? 'flex-1 p-6' : 'p-5 lg:p-6'}`}>
                <div className={`${viewMode === 'list' ? 'flex flex-col justify-between h-full' : ''}`}>
                  <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm lg:text-base leading-relaxed">
                      {course.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{course.instructor}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar (hidden in list view as it's shown on image) */}
                  {viewMode === 'grid' && (
                    <div className="mb-5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Progress
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(course.progress)}`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className={`flex ${viewMode === 'list' ? 'justify-between' : 'justify-between'} items-center`}>
                    <Button size="md" className="px-6 py-2.5 flex-shrink-0 min-w-[140px]">
                      <Link href={`/courses/${course.id}`} className="flex items-center">
                        Continue Learning
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </Button>
                    <div className="text-right ml-4">
                      {viewMode === 'list' && (
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {course.progress}% Complete
                        </div>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(course.lastAccessed).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedCourses.length === 0 && (
          <div className="text-center py-12 lg:py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No courses found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              We couldn&apos;t find any courses matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  setSearchQuery('')
                  setCategory('All')
                  setSortBy('last_accessed')
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
              <Button>
                <Link href="/courses">
                  Browse All Courses
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
