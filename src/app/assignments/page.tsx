'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthenticatedHeader from '@/components/AuthenticatedHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Assignment {
  id: number
  title: string
  course: string
  courseCode: string
  dueDate: string
  type: 'assignment' | 'exam' | 'project' | 'quiz'
  status: 'pending' | 'submitted' | 'graded' | 'overdue'
  grade?: string
  points?: number
  maxPoints: number
  description: string
  submissionType: 'file' | 'text' | 'online'
}

const assignments: Assignment[] = [
  {
    id: 1,
    title: 'Database Design Project',
    course: 'Database Systems',
    courseCode: 'CS301',
    dueDate: '2025-08-05',
    type: 'project',
    status: 'pending',
    maxPoints: 100,
    description: 'Design and implement a complete database system for a library management application.',
    submissionType: 'file'
  },
  {
    id: 2,
    title: 'Algorithm Analysis Report',
    course: 'Data Structures & Algorithms',
    courseCode: 'CS301',
    dueDate: '2025-08-08',
    type: 'assignment',
    status: 'pending',
    maxPoints: 50,
    description: 'Analyze the time complexity of various sorting algorithms and provide detailed comparisons.',
    submissionType: 'file'
  },
  {
    id: 3,
    title: 'Machine Learning Quiz 2',
    course: 'Machine Learning',
    courseCode: 'CS401',
    dueDate: '2025-08-10',
    type: 'quiz',
    status: 'pending',
    maxPoints: 25,
    description: 'Online quiz covering supervised learning algorithms and evaluation metrics.',
    submissionType: 'online'
  },
  {
    id: 4,
    title: 'Web Portfolio Project',
    course: 'Web Development',
    courseCode: 'CS302',
    dueDate: '2025-07-25',
    type: 'project',
    status: 'graded',
    grade: 'A',
    points: 95,
    maxPoints: 100,
    description: 'Create a personal portfolio website using modern web technologies.',
    submissionType: 'file'
  },
  {
    id: 5,
    title: 'Linear Algebra Exam',
    course: 'Advanced Mathematics',
    courseCode: 'MATH201',
    dueDate: '2025-07-20',
    type: 'exam',
    status: 'graded',
    grade: 'B+',
    points: 87,
    maxPoints: 100,
    description: 'Midterm examination covering vector spaces, eigenvalues, and matrix transformations.',
    submissionType: 'online'
  }
]

export default function AssignmentsPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'assignment' | 'exam' | 'project' | 'quiz'>('all')

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [router])

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'graded':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
      case 'project':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
      case 'quiz':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  const filteredAssignments = assignments.filter(assignment => {
    const statusMatch = filter === 'all' || assignment.status === filter
    const typeMatch = typeFilter === 'all' || assignment.type === typeFilter
    return statusMatch && typeMatch
  })

  const pendingCount = assignments.filter(a => a.status === 'pending').length
  const gradedCount = assignments.filter(a => a.status === 'graded').length
  const gradedAssignments = assignments.filter(a => a.points)
  const avgGrade = gradedAssignments.length > 0 
    ? gradedAssignments.reduce((acc, a) => acc + (a.points! / a.maxPoints), 0) / gradedAssignments.length * 100
    : 0

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AuthenticatedHeader currentPage="assignments" />
      
      <div className="container-responsive py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Assignments & Grades
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your assignments, deadlines, and academic progress
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgGrade.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{assignments.reduce((acc, a) => acc + (a.points || 0), 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center mr-2">Status:</span>
            {['all', 'pending', 'submitted', 'graded'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status as 'all' | 'pending' | 'submitted' | 'graded')}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center mr-2">Type:</span>
            {['all', 'assignment', 'exam', 'project', 'quiz'].map((type) => (
              <Button
                key={type}
                variant={typeFilter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter(type as 'all' | 'assignment' | 'exam' | 'project' | 'quiz')}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 dark:text-white mb-2">
                      {assignment.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {assignment.courseCode}
                      </Badge>
                      <Badge className={getTypeColor(assignment.type)}>
                        {assignment.type}
                      </Badge>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {assignment.course}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    {assignment.status === 'pending' && (
                      <div className={`text-sm font-medium ${
                        getDaysUntilDue(assignment.dueDate) <= 1
                          ? 'text-red-600 dark:text-red-400'
                          : getDaysUntilDue(assignment.dueDate) <= 3
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {getDaysUntilDue(assignment.dueDate) === 0 
                          ? 'Due today!' 
                          : getDaysUntilDue(assignment.dueDate) === 1
                          ? 'Due tomorrow'
                          : `${getDaysUntilDue(assignment.dueDate)} days left`
                        }
                      </div>
                    )}
                    {assignment.grade && (
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {assignment.grade} ({assignment.points}/{assignment.maxPoints})
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {assignment.description}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    {assignment.submissionType === 'file' ? 'File Upload' : assignment.submissionType === 'online' ? 'Online Submission' : 'Text Entry'}
                  </div>
                  <div className="flex gap-2">
                    {assignment.status === 'pending' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Submit Assignment
                      </Button>
                    )}
                    {assignment.status === 'graded' && (
                      <Button variant="outline" size="sm">
                        View Feedback
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No assignments found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No assignments match your current filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
