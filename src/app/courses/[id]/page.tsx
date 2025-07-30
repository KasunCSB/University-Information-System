'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import AuthenticatedHeader from '@/components/AuthenticatedHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Course data (same as dashboard - in a real app this would come from an API)
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
    instructor: 'Dr. Sarah Johnson',
    currentGrade: 'B+',
    gradePercentage: 87,
    participantCount: 234,
    participantsList: [
      { id: 1, name: 'Alice Johnson', avatar: 'AJ', grade: 'A', progress: 85 },
      { id: 2, name: 'Bob Smith', avatar: 'BS', grade: 'B+', progress: 78 },
      { id: 3, name: 'Carol Davis', avatar: 'CD', grade: 'A-', progress: 92 },
      { id: 4, name: 'David Wilson', avatar: 'DW', grade: 'B', progress: 70 },
      { id: 5, name: 'Emma Brown', avatar: 'EB', grade: 'A+', progress: 95 }
    ],
    weeklyContent: [
      { 
        week: 1, 
        title: 'Introduction to Programming', 
        status: 'completed', 
        score: 95,
        assignments: [
          { name: 'Hello World Program', type: 'coding', dueDate: '2025-01-15', status: 'submitted', score: 95 },
          { name: 'Basic Syntax Quiz', type: 'quiz', dueDate: '2025-01-18', status: 'submitted', score: 95 }
        ]
      },
      { 
        week: 2, 
        title: 'Variables and Data Types', 
        status: 'completed', 
        score: 88,
        assignments: [
          { name: 'Variable Declaration Exercise', type: 'coding', dueDate: '2025-01-25', status: 'submitted', score: 90 },
          { name: 'Data Types Assignment', type: 'assignment', dueDate: '2025-01-28', status: 'submitted', score: 86 }
        ]
      },
      { 
        week: 3, 
        title: 'Control Structures', 
        status: 'completed', 
        score: 82,
        assignments: [
          { name: 'If-Else Conditions', type: 'coding', dueDate: '2025-02-05', status: 'submitted', score: 85 },
          { name: 'Loop Structures Quiz', type: 'quiz', dueDate: '2025-02-08', status: 'submitted', score: 79 }
        ]
      },
      { 
        week: 4, 
        title: 'Functions and Methods', 
        status: 'current', 
        score: null,
        assignments: [
          { name: 'Function Implementation', type: 'coding', dueDate: '2025-02-15', status: 'pending', score: null },
          { name: 'Method Overloading Project', type: 'project', dueDate: '2025-02-18', status: 'pending', score: null }
        ]
      },
      { 
        week: 5, 
        title: 'Object-Oriented Programming', 
        status: 'locked', 
        score: null,
        assignments: [
          { name: 'Class Design Exercise', type: 'coding', dueDate: '2025-02-25', status: 'locked', score: null },
          { name: 'Inheritance Project', type: 'project', dueDate: '2025-02-28', status: 'locked', score: null }
        ]
      },
      { 
        week: 6, 
        title: 'Data Structures Basics', 
        status: 'locked', 
        score: null,
        assignments: [
          { name: 'Array Implementation', type: 'coding', dueDate: '2025-03-05', status: 'locked', score: null },
          { name: 'Final Project Proposal', type: 'project', dueDate: '2025-03-08', status: 'locked', score: null }
        ]
      }
    ]
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
    instructor: 'Prof. Michael Chen',
    currentGrade: 'A-',
    gradePercentage: 92,
    participantCount: 156,
    participantsList: [
      { id: 6, name: 'Frank Miller', avatar: 'FM', grade: 'A+', progress: 88 },
      { id: 7, name: 'Grace Lee', avatar: 'GL', grade: 'A', progress: 91 },
      { id: 8, name: 'Henry Clark', avatar: 'HC', grade: 'B+', progress: 75 },
      { id: 9, name: 'Ivy Chen', avatar: 'IC', grade: 'A-', progress: 83 },
      { id: 10, name: 'Jack White', avatar: 'JW', grade: 'B', progress: 68 }
    ],
    weeklyContent: [
      { 
        week: 1, 
        title: 'Calculus Review', 
        status: 'completed', 
        score: 98,
        assignments: [
          { name: 'Derivative Problems', type: 'assignment', dueDate: '2025-01-20', status: 'submitted', score: 98 },
          { name: 'Integration Quiz', type: 'quiz', dueDate: '2025-01-23', status: 'submitted', score: 98 }
        ]
      },
      { 
        week: 2, 
        title: 'Linear Algebra', 
        status: 'completed', 
        score: 94,
        assignments: [
          { name: 'Matrix Operations', type: 'assignment', dueDate: '2025-01-30', status: 'submitted', score: 95 },
          { name: 'Vector Spaces Project', type: 'project', dueDate: '2025-02-02', status: 'submitted', score: 93 }
        ]
      },
      { 
        week: 3, 
        title: 'Differential Equations', 
        status: 'completed', 
        score: 89,
        assignments: [
          { name: 'ODE Solutions', type: 'assignment', dueDate: '2025-02-10', status: 'submitted', score: 91 },
          { name: 'PDE Analysis', type: 'assignment', dueDate: '2025-02-13', status: 'submitted', score: 87 }
        ]
      },
      { 
        week: 4, 
        title: 'Complex Numbers', 
        status: 'current', 
        score: null,
        assignments: [
          { name: 'Complex Arithmetic', type: 'assignment', dueDate: '2025-02-20', status: 'pending', score: null },
          { name: 'Polar Form Quiz', type: 'quiz', dueDate: '2025-02-23', status: 'pending', score: null }
        ]
      },
      { 
        week: 5, 
        title: 'Fourier Analysis', 
        status: 'locked', 
        score: null,
        assignments: [
          { name: 'Fourier Series', type: 'assignment', dueDate: '2025-03-01', status: 'locked', score: null },
          { name: 'Transform Applications', type: 'project', dueDate: '2025-03-05', status: 'locked', score: null }
        ]
      },
      { 
        week: 6, 
        title: 'Probability Theory', 
        status: 'locked', 
        score: null,
        assignments: [
          { name: 'Probability Distributions', type: 'assignment', dueDate: '2025-03-10', status: 'locked', score: null },
          { name: 'Statistical Analysis Project', type: 'project', dueDate: '2025-03-15', status: 'locked', score: null }
        ]
      }
    ]
  },
  // Add other courses as needed...
]

export default function CourseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [username, setUsername] = useState('')
  const [course, setCourse] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'assignments'>('overview')

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const user = localStorage.getItem('user')
    
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    setUsername(user || 'User')
    
    // Find the course by ID
    const courseId = parseInt(params.id as string)
    const foundCourse = courses.find(c => c.id === courseId)
    
    if (!foundCourse) {
      router.push('/dashboard')
      return
    }
    
    setCourse(foundCourse)
  }, [router, params.id])

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400'
    if (percentage >= 80) return 'text-blue-600 dark:text-blue-400'
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <AuthenticatedHeader username={username} currentPage="courses" />

      {/* Course Header */}
      <div className={`bg-gradient-to-r ${course.gradient} relative`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-responsive py-8 lg:py-12 relative">
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard">
              <Button variant="outline" className="text-white hover:bg-white/20 border border-white/20 bg-transparent">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                {course.code}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                {course.level}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                Grade: {course.currentGrade}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-white/90 mb-6 leading-relaxed">
                {course.description}
              </p>
              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                  <span>{course.participantCount} students</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{course.progress}%</div>
                    <div className="text-white/80 text-sm mb-4">Course Progress</div>
                    <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                      <div 
                        className="h-3 bg-white rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${getGradeColor(course.gradePercentage)} bg-white rounded-lg py-2`}>
                      {course.currentGrade}
                    </div>
                    <div className="text-white/80 text-sm">Current Grade ({course.gradePercentage}%)</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <main className="container-responsive py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Course Overview
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === 'participants'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Participants ({course.participantCount})
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === 'assignments'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All Assignments
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Weekly Course Content
            </h2>
            <div className="space-y-6">
              {course.weeklyContent.map((week: any) => (
                <Card key={week.week} className={`border-0 shadow-lg ${
                  week.status === 'completed' ? 'border-l-4 border-l-green-500' :
                  week.status === 'current' ? 'border-l-4 border-l-blue-500' :
                  'border-l-4 border-l-gray-300'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          week.status === 'completed' ? 'bg-green-500' :
                          week.status === 'current' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}>
                          {week.week}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Week {week.week}: {week.title}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            week.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            week.status === 'current' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {week.status}
                          </span>
                        </div>
                      </div>
                      {week.score && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{week.score}%</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Week Score</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Week Assignments */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {week.assignments?.map((assignment: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              assignment.type === 'quiz' ? 'bg-purple-500' :
                              assignment.type === 'project' ? 'bg-orange-500' :
                              assignment.type === 'lab' ? 'bg-teal-500' :
                              assignment.type === 'exam' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}>
                              {assignment.type === 'quiz' ? 'Q' :
                               assignment.type === 'project' ? 'P' :
                               assignment.type === 'lab' ? 'L' :
                               assignment.type === 'exam' ? 'E' : 'A'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{assignment.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {assignment.score && (
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {assignment.score}%
                              </div>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                              assignment.status === 'submitted' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                              assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {assignment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Course Participants
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.participantsList.map((participant: any) => (
                <Card key={participant.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {participant.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{participant.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Progress: {participant.progress}%
                          </span>
                          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                            participant.grade.includes('A') ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            participant.grade.includes('B') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {participant.grade}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(participant.progress)}`}
                        style={{ width: `${participant.progress}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              All Course Assignments
            </h2>
            <div className="space-y-4">
              {course.weeklyContent.flatMap((week: any) => 
                week.assignments?.map((assignment: any, index: number) => (
                  <Card key={`${week.week}-${index}`} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                            assignment.type === 'quiz' ? 'bg-purple-500' :
                            assignment.type === 'project' ? 'bg-orange-500' :
                            assignment.type === 'lab' ? 'bg-teal-500' :
                            assignment.type === 'exam' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`}>
                            {assignment.type === 'quiz' ? 'Q' :
                             assignment.type === 'project' ? 'P' :
                             assignment.type === 'lab' ? 'L' :
                             assignment.type === 'exam' ? 'E' : 'A'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{assignment.name}</h3>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Week {week.week}: {week.title} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {assignment.score && (
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">{assignment.score}%</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                            </div>
                          )}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                            assignment.status === 'submitted' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
