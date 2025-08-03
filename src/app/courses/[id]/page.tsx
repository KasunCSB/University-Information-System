'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthenticatedHeader from '@/components/AuthenticatedHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Define interfaces
interface Instructor {
  name: string
  title: string
  email: string
  office: string
  officeHours: string
  avatar: string
}

interface Lesson {
  id: number
  title: string
  completed: boolean
  current?: boolean
  type: 'video' | 'reading' | 'tutorial' | 'hands-on' | 'quiz'
  duration: string
}

interface Module {
  id: number
  title: string
  completed: boolean
  current?: boolean
  duration: string
  lessons?: Lesson[]
}

interface Assignment {
  id: number
  title: string
  description: string
  dueDate: string
  submitted: boolean
  grade: string | null
  points: number
  maxPoints: number
  status: string
}

interface Material {
  id: number
  title: string
  type: string
  size: string
  uploadDate: string
  description: string
}

interface Participant {
  id: number
  name: string
  role: string
  progress: number
  avatar: string
  joinDate: string
}

interface CourseDetail {
  id: number
  title: string
  code: string
  description: string
  level: string
  gradient: string
  category: string
  lastAccessed: string
  progress: number
  instructor: Instructor
  enrollment: {
    total: number
    capacity: number
    enrolled: boolean
    enrollmentDate: string
  }
  schedule: {
    lectures: Array<{
      day: string
      time: string
      location: string
    }>
  }
  modules: Module[]
  assignments: Assignment[]
  materials: Material[]
  participants: Participant[]
}

// Course data (in a real app, this would come from an API)
const courseData: Record<string, CourseDetail> = {
  '1': {
    id: 1,
    title: 'Computer Science Fundamentals',
    code: 'CS101',
    description: 'Learn fundamentals of computer science and programming. This comprehensive course covers basic programming concepts, data types, control structures, functions, and problem-solving techniques using modern programming languages.',
    level: 'Level I',
    gradient: 'from-blue-500 to-cyan-500',
    category: 'Computer Science',
    lastAccessed: '2025-07-23',
    progress: 75,
    instructor: {
      name: 'Dr. Sarah Johnson',
      title: 'Professor of Computer Science',
      email: 'sarah.johnson@university.edu',
      office: 'CS Building, Room 301',
      officeHours: 'Mon, Wed, Fri: 2:00-4:00 PM',
      avatar: '/avatars/sarah-johnson.jpg'
    },
    enrollment: {
      total: 156,
      capacity: 200,
      enrolled: true,
      enrollmentDate: '2025-01-15'
    },
    schedule: {
      lectures: [
        { day: 'Monday', time: '10:00 AM - 11:30 AM', location: 'CS Auditorium 101' },
        { day: 'Wednesday', time: '10:00 AM - 11:30 AM', location: 'CS Auditorium 101' },
        { day: 'Friday', time: '2:00 PM - 3:30 PM', location: 'CS Lab 201' }
      ]
    },
    modules: [
      {
        id: 1,
        title: 'Introduction to Programming',
        completed: true,
        duration: '2 weeks',
        lessons: [
          { id: 1, title: 'What is Programming?', completed: true, type: 'video', duration: '15 min' },
          { id: 2, title: 'Setting up Development Environment', completed: true, type: 'tutorial', duration: '30 min' },
          { id: 3, title: 'Your First Program', completed: true, type: 'hands-on', duration: '45 min' },
          { id: 4, title: 'Programming Fundamentals Quiz', completed: true, type: 'quiz', duration: '20 min' }
        ]
      },
      {
        id: 2,
        title: 'Variables and Data Types',
        completed: true,
        duration: '3 weeks',
        lessons: [
          { id: 5, title: 'Understanding Variables', completed: true, type: 'video', duration: '20 min' },
          { id: 6, title: 'Primitive Data Types', completed: true, type: 'reading', duration: '25 min' },
          { id: 7, title: 'Type Conversion', completed: true, type: 'tutorial', duration: '35 min' },
          { id: 8, title: 'Variables Practice Lab', completed: true, type: 'hands-on', duration: '60 min' }
        ]
      },
      {
        id: 3,
        title: 'Control Structures',
        completed: false,
        current: true,
        duration: '4 weeks',
        lessons: [
          { id: 9, title: 'Conditional Statements', completed: true, type: 'video', duration: '25 min' },
          { id: 10, title: 'Loops and Iteration', completed: true, type: 'video', duration: '30 min' },
          { id: 11, title: 'Nested Control Structures', completed: false, current: true, type: 'tutorial', duration: '40 min' },
          { id: 12, title: 'Control Flow Practice', completed: false, type: 'hands-on', duration: '50 min' }
        ]
      },
      {
        id: 4,
        title: 'Functions and Methods',
        completed: false,
        duration: '3 weeks',
        lessons: [
          { id: 13, title: 'Introduction to Functions', completed: false, type: 'video', duration: '20 min' },
          { id: 14, title: 'Parameters and Return Values', completed: false, type: 'tutorial', duration: '35 min' },
          { id: 15, title: 'Scope and Lifetime', completed: false, type: 'reading', duration: '15 min' },
          { id: 16, title: 'Function Design Lab', completed: false, type: 'hands-on', duration: '70 min' }
        ]
      },
      {
        id: 5,
        title: 'Arrays and Collections',
        completed: false,
        duration: '4 weeks',
        lessons: [
          { id: 17, title: 'Introduction to Arrays', completed: false, type: 'video', duration: '25 min' },
          { id: 18, title: 'Array Operations', completed: false, type: 'tutorial', duration: '40 min' },
          { id: 19, title: 'Multi-dimensional Arrays', completed: false, type: 'video', duration: '30 min' },
          { id: 20, title: 'Array Algorithms', completed: false, type: 'hands-on', duration: '60 min' }
        ]
      }
    ],
    assignments: [
      {
        id: 1,
        title: 'Hello World Program',
        description: 'Create your first program that displays "Hello, World!" to the console.',
        dueDate: '2025-02-05',
        submitted: true,
        grade: 'A',
        points: 10,
        maxPoints: 10,
        status: 'graded'
      },
      {
        id: 2,
        title: 'Variable Calculator',
        description: 'Build a simple calculator that performs basic arithmetic operations using variables.',
        dueDate: '2025-02-15',
        submitted: true,
        grade: 'A-',
        points: 18,
        maxPoints: 20,
        status: 'graded'
      },
      {
        id: 3,
        title: 'Control Flow Challenge',
        description: 'Solve programming problems using conditional statements and loops.',
        dueDate: '2025-08-05',
        submitted: false,
        grade: null,
        points: 0,
        maxPoints: 25,
        status: 'pending'
      },
      {
        id: 4,
        title: 'Function Library',
        description: 'Create a library of reusable functions for common programming tasks.',
        dueDate: '2025-08-15',
        submitted: false,
        grade: null,
        points: 0,
        maxPoints: 30,
        status: 'upcoming'
      }
    ],
    materials: [
      {
        id: 1,
        title: 'Course Syllabus',
        type: 'pdf',
        size: '245 KB',
        uploadDate: '2025-01-10',
        description: 'Complete course syllabus with learning objectives and assessment criteria'
      },
      {
        id: 2,
        title: 'Programming Environment Setup Guide',
        type: 'pdf',
        size: '1.2 MB',
        uploadDate: '2025-01-15',
        description: 'Step-by-step guide to setting up your development environment'
      },
      {
        id: 3,
        title: 'Code Examples - Week 1-5',
        type: 'zip',
        size: '856 KB',
        uploadDate: '2025-02-20',
        description: 'Collection of code examples from the first five weeks of the course'
      },
      {
        id: 4,
        title: 'Reference Guide - Data Types',
        type: 'pdf',
        size: '432 KB',
        uploadDate: '2025-02-10',
        description: 'Quick reference guide for primitive and complex data types'
      },
      {
        id: 5,
        title: 'Practice Problems Set 1',
        type: 'pdf',
        size: '678 KB',
        uploadDate: '2025-01-25',
        description: 'Additional practice problems for reinforcing core concepts'
      }
    ],
    participants: [
      {
        id: 1,
        name: 'Alice Chen',
        role: 'student',
        progress: 92,
        avatar: '/avatars/alice-chen.jpg',
        joinDate: '2025-01-15'
      },
      {
        id: 2,
        name: 'Bob Johnson',
        role: 'student',
        progress: 78,
        avatar: '/avatars/bob-johnson.jpg',
        joinDate: '2025-01-15'
      },
      {
        id: 3,
        name: 'Carol Davis',
        role: 'student',
        progress: 85,
        avatar: '/avatars/carol-davis.jpg',
        joinDate: '2025-01-16'
      },
      {
        id: 4,
        name: 'David Wilson',
        role: 'teaching_assistant',
        progress: 100,
        avatar: '/avatars/david-wilson.jpg',
        joinDate: '2025-01-10'
      },
      {
        id: 5,
        name: 'Emma Rodriguez',
        role: 'student',
        progress: 69,
        avatar: '/avatars/emma-rodriguez.jpg',
        joinDate: '2025-01-17'
      }
    ]
  },
  '2': {
    id: 2,
    title: 'Advanced Mathematics',
    code: 'MATH201',
    description: 'Complex mathematical concepts and their applications in real-world scenarios. Topics include calculus, linear algebra, differential equations, and statistical analysis.',
    level: 'Level II',
    gradient: 'from-purple-500 to-pink-500',
    category: 'Mathematics',
    lastAccessed: '2025-07-24',
    progress: 60,
    instructor: {
      name: 'Prof. Michael Chen',
      title: 'Professor of Mathematics',
      email: 'michael.chen@university.edu',
      office: 'Math Building, Room 205',
      officeHours: 'Tue, Thu: 1:00-3:00 PM',
      avatar: '/avatars/michael-chen.jpg'
    },
    enrollment: {
      total: 89,
      capacity: 120,
      enrolled: true,
      enrollmentDate: '2025-01-15'
    },
    schedule: {
      lectures: [
        { day: 'Tuesday', time: '9:00 AM - 10:30 AM', location: 'Math Auditorium 150' },
        { day: 'Thursday', time: '9:00 AM - 10:30 AM', location: 'Math Auditorium 150' }
      ]
    },
    modules: [
      {
        id: 1,
        title: 'Advanced Calculus',
        completed: true,
        duration: '4 weeks',
        lessons: [
          { id: 1, title: 'Multivariable Calculus', completed: true, type: 'video', duration: '30 min' },
          { id: 2, title: 'Partial Derivatives', completed: true, type: 'tutorial', duration: '45 min' },
          { id: 3, title: 'Multiple Integrals', completed: true, type: 'hands-on', duration: '60 min' }
        ]
      },
      {
        id: 2,
        title: 'Linear Algebra Applications',
        completed: false,
        current: true,
        duration: '5 weeks',
        lessons: [
          { id: 4, title: 'Matrix Operations', completed: true, type: 'video', duration: '25 min' },
          { id: 5, title: 'Eigenvalues and Eigenvectors', completed: false, current: true, type: 'tutorial', duration: '40 min' },
          { id: 6, title: 'Linear Transformations', completed: false, type: 'hands-on', duration: '50 min' }
        ]
      }
    ],
    assignments: [
      {
        id: 1,
        title: 'Calculus Problem Set 1',
        description: 'Solve advanced calculus problems involving derivatives and integrals.',
        dueDate: '2025-08-08',
        submitted: false,
        grade: null,
        points: 0,
        maxPoints: 25,
        status: 'pending'
      }
    ],
    materials: [
      {
        id: 1,
        title: 'Mathematics Textbook',
        type: 'pdf',
        size: '15 MB',
        uploadDate: '2025-01-10',
        description: 'Comprehensive mathematics textbook covering all course topics'
      }
    ],
    participants: [
      {
        id: 1,
        name: 'John Smith',
        role: 'student',
        progress: 75,
        avatar: '/avatars/john-smith.jpg',
        joinDate: '2025-01-15'
      }
    ]
  },
  '3': {
    id: 3,
    title: 'Electronics Engineering',
    code: 'EE202',
    description: 'Study electronic circuits and systems, including analog and digital electronics, microprocessors, and circuit design principles.',
    level: 'Level II',
    gradient: 'from-orange-500 to-red-500',
    category: 'Engineering',
    lastAccessed: '2025-07-22',
    progress: 45,
    instructor: {
      name: 'Dr. Amanda Wilson',
      title: 'Associate Professor of Electrical Engineering',
      email: 'amanda.wilson@university.edu',
      office: 'Engineering Building, Room 310',
      officeHours: 'Mon, Wed: 3:00-5:00 PM',
      avatar: '/avatars/amanda-wilson.jpg'
    },
    enrollment: {
      total: 67,
      capacity: 80,
      enrolled: true,
      enrollmentDate: '2025-01-15'
    },
    schedule: {
      lectures: [
        { day: 'Monday', time: '2:00 PM - 3:30 PM', location: 'Engineering Lab 205' },
        { day: 'Wednesday', time: '2:00 PM - 3:30 PM', location: 'Engineering Lab 205' },
        { day: 'Friday', time: '10:00 AM - 11:30 AM', location: 'Engineering Lecture Hall' }
      ]
    },
    modules: [
      {
        id: 1,
        title: 'Circuit Analysis Fundamentals',
        completed: true,
        duration: '3 weeks'
      },
      {
        id: 2,
        title: 'Digital Electronics',
        completed: false,
        current: true,
        duration: '4 weeks'
      }
    ],
    assignments: [
      {
        id: 1,
        title: 'Circuit Design Lab',
        description: 'Design and simulate basic electronic circuits using simulation software.',
        dueDate: '2025-08-10',
        submitted: false,
        grade: null,
        points: 0,
        maxPoints: 30,
        status: 'pending'
      }
    ],
    materials: [],
    participants: []
  },
  '4': {
    id: 4,
    title: 'Data Structures & Algorithms',
    code: 'CS301',
    description: 'Advanced programming concepts and algorithm design, including complexity analysis, sorting algorithms, graph algorithms, and data structure optimization.',
    level: 'Level III',
    gradient: 'from-green-500 to-emerald-500',
    category: 'Computer Science',
    lastAccessed: '2025-07-24',
    progress: 85,
    instructor: {
      name: 'Dr. Robert Kim',
      title: 'Professor of Computer Science',
      email: 'robert.kim@university.edu',
      office: 'CS Building, Room 405',
      officeHours: 'Tue, Thu: 11:00 AM - 1:00 PM',
      avatar: '/avatars/robert-kim.jpg'
    },
    enrollment: {
      total: 124,
      capacity: 150,
      enrolled: true,
      enrollmentDate: '2025-01-15'
    },
    schedule: {
      lectures: [
        { day: 'Tuesday', time: '1:00 PM - 2:30 PM', location: 'CS Auditorium 102' },
        { day: 'Thursday', time: '1:00 PM - 2:30 PM', location: 'CS Auditorium 102' }
      ]
    },
    modules: [
      {
        id: 1,
        title: 'Algorithm Analysis',
        completed: true,
        duration: '3 weeks'
      },
      {
        id: 2,
        title: 'Advanced Data Structures',
        completed: false,
        current: true,
        duration: '4 weeks'
      }
    ],
    assignments: [
      {
        id: 1,
        title: 'Algorithm Implementation',
        description: 'Implement and analyze various sorting and searching algorithms.',
        dueDate: '2025-08-12',
        submitted: false,
        grade: null,
        points: 0,
        maxPoints: 35,
        status: 'pending'
      }
    ],
    materials: [],
    participants: []
  },
  '5': {
    id: 5,
    title: 'Machine Learning',
    code: 'CS401',
    description: 'Explore AI and machine learning concepts, including supervised and unsupervised learning, neural networks, and deep learning applications.',
    level: 'Level III',
    gradient: 'from-indigo-500 to-purple-500',
    category: 'Computer Science',
    lastAccessed: '2025-07-21',
    progress: 30,
    instructor: {
      name: 'Dr. Lisa Zhang',
      title: 'Professor of Artificial Intelligence',
      email: 'lisa.zhang@university.edu',
      office: 'CS Building, Room 501',
      officeHours: 'Mon, Fri: 10:00 AM - 12:00 PM',
      avatar: '/avatars/lisa-zhang.jpg'
    },
    enrollment: {
      total: 98,
      capacity: 120,
      enrolled: true,
      enrollmentDate: '2025-01-15'
    },
    schedule: {
      lectures: [
        { day: 'Monday', time: '3:00 PM - 4:30 PM', location: 'CS Lab 301' },
        { day: 'Wednesday', time: '3:00 PM - 4:30 PM', location: 'CS Lab 301' },
        { day: 'Friday', time: '1:00 PM - 2:30 PM', location: 'CS Auditorium 103' }
      ]
    },
    modules: [
      {
        id: 1,
        title: 'Introduction to ML',
        completed: true,
        duration: '2 weeks'
      },
      {
        id: 2,
        title: 'Supervised Learning',
        completed: false,
        current: true,
        duration: '4 weeks'
      }
    ],
    assignments: [
      {
        id: 1,
        title: 'ML Model Training',
        description: 'Train and evaluate machine learning models on provided datasets.',
        dueDate: '2025-08-15',
        submitted: false,
        grade: null,
        points: 0,
        maxPoints: 40,
        status: 'upcoming'
      }
    ],
    materials: [],
    participants: []
  },
  '6': {
    id: 6,
    title: 'Web Development',
    code: 'CS302',
    description: 'Learn modern web development technologies including HTML5, CSS3, JavaScript, React, Node.js, and database integration.',
    level: 'Level II',
    gradient: 'from-teal-500 to-blue-500',
    category: 'Computer Science',
    lastAccessed: '2025-07-23',
    progress: 90,
    instructor: {
      name: 'Dr. James Miller',
      title: 'Senior Lecturer in Web Technologies',
      email: 'james.miller@university.edu',
      office: 'CS Building, Room 250',
      officeHours: 'Wed, Fri: 2:00-4:00 PM',
      avatar: '/avatars/james-miller.jpg'
    },
    enrollment: {
      total: 145,
      capacity: 160,
      enrolled: true,
      enrollmentDate: '2025-01-15'
    },
    schedule: {
      lectures: [
        { day: 'Monday', time: '11:00 AM - 12:30 PM', location: 'CS Lab 202' },
        { day: 'Wednesday', time: '11:00 AM - 12:30 PM', location: 'CS Lab 202' },
        { day: 'Friday', time: '9:00 AM - 10:30 AM', location: 'CS Auditorium 101' }
      ]
    },
    modules: [
      {
        id: 1,
        title: 'Frontend Development',
        completed: true,
        duration: '4 weeks'
      },
      {
        id: 2,
        title: 'Backend Development',
        completed: true,
        duration: '4 weeks'
      },
      {
        id: 3,
        title: 'Full-Stack Integration',
        completed: false,
        current: true,
        duration: '3 weeks'
      }
    ],
    assignments: [
      {
        id: 1,
        title: 'Portfolio Website',
        description: 'Create a complete portfolio website using modern web technologies.',
        dueDate: '2025-08-18',
        submitted: true,
        grade: 'A',
        points: 48,
        maxPoints: 50,
        status: 'graded'
      }
    ],
    materials: [],
    participants: []
  }
  // Add more courses as needed
}

type LessonType = 'video' | 'reading' | 'tutorial' | 'hands-on' | 'quiz'

const getLessonIcon = (type: LessonType) => {
  switch (type) {
    case 'video':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'reading':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case 'tutorial':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    case 'hands-on':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    case 'quiz':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    default:
      return null
  }
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    case 'zip':
      return (
        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    default:
      return (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
  }
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const courseId = params.id as string
  const course = courseData[courseId as keyof typeof courseData]

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [router])

  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <AuthenticatedHeader currentPage="courses" />
        <div className="container-responsive py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The course you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AuthenticatedHeader currentPage="courses" />
      
      {/* Course Header */}
      <div className={`bg-gradient-to-r ${course.gradient} relative`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-responsive py-8 lg:py-12 relative z-10">
          <div className="flex items-start justify-between mb-6">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                  {course.code}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                  {course.level}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                  {course.category}
                </Badge>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>
              
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                {course.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white mb-1">{course.progress}%</div>
                  <div className="text-white/80 text-sm">Progress</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white mb-1">{course.enrollment.total}</div>
                  <div className="text-white/80 text-sm">Students Enrolled</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white mb-1">{course.modules.length}</div>
                  <div className="text-white/80 text-sm">Modules</div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-white">Course Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Modules Completed</span>
                        <span>{course.modules.filter(m => m.completed).length}/{course.modules.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Assignments Submitted</span>
                        <span>{course.assignments.filter(a => a.submitted).length}/{course.assignments.length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container-responsive">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'content', label: 'Course Content' },
              { id: 'assignments', label: 'Assignments' },
              { id: 'materials', label: 'Materials' },
              { id: 'participants', label: 'Participants' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="container-responsive py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Instructor Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {course.instructor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {course.instructor.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{course.instructor.title}</p>
                      <div className="mt-3 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <p>📧 {course.instructor.email}</p>
                        <p>🏢 {course.instructor.office}</p>
                        <p>🕐 Office Hours: {course.instructor.officeHours}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Class Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {course.schedule.lectures.map((lecture, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{lecture.day}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{lecture.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{lecture.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Enrollment</span>
                    <span className="font-medium">{course.enrollment.total}/{course.enrollment.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Your Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Enrolled Since</span>
                    <span className="font-medium">{new Date(course.enrollment.enrollmentDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={() => setActiveTab('content')}>
                    Continue Learning
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('assignments')}>
                    View Assignments
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('materials')}>
                    Download Materials
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Content</h2>
              <Badge variant="outline">
                {course.modules.filter(m => m.completed).length} of {course.modules.length} modules completed
              </Badge>
            </div>

            <div className="space-y-4">
              {course.modules.map((module, index) => (
                <Card key={module.id} className={`${module.current ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          module.completed 
                            ? 'bg-green-500 text-white' 
                            : module.current
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {module.completed ? '✓' : index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Duration: {module.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {module.current && (
                          <Badge className="bg-blue-500 text-white">Current</Badge>
                        )}
                        {module.completed && (
                          <Badge className="bg-green-500 text-white">Completed</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {module.lessons && (
                    <CardContent>
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => (
                          <div 
                            key={lesson.id} 
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                              lesson.current 
                                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                                : lesson.completed 
                                ? 'bg-green-50 dark:bg-green-900/20' 
                                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                            } ${!lesson.completed ? 'cursor-pointer' : ''}`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                lesson.completed 
                                  ? 'bg-green-500 text-white' 
                                  : lesson.current
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}>
                                {lesson.completed ? (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <div className="w-2 h-2 bg-current rounded-full"></div>
                                )}
                              </div>
                              
                              <div className={`text-${lesson.completed ? 'green' : lesson.current ? 'blue' : 'gray'}-600 dark:text-${lesson.completed ? 'green' : lesson.current ? 'blue' : 'gray'}-400`}>
                                {getLessonIcon(lesson.type)}
                              </div>
                              
                              <div>
                                <p className={`font-medium ${
                                  lesson.completed 
                                    ? 'text-green-900 dark:text-green-100' 
                                    : lesson.current
                                    ? 'text-blue-900 dark:text-blue-100'
                                    : 'text-gray-900 dark:text-white'
                                }`}>
                                  {lesson.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                  {lesson.type} • {lesson.duration}
                                </p>
                              </div>
                            </div>
                            
                            {!lesson.completed && (
                              <Button size="sm" variant={lesson.current ? "default" : "outline"}>
                                {lesson.current ? 'Continue' : 'Start'}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h2>
              <Badge variant="outline">
                {course.assignments.filter(a => a.submitted).length} of {course.assignments.length} submitted
              </Badge>
            </div>

            <div className="grid gap-4">
              {course.assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {assignment.title}
                          </h3>
                          <Badge variant={
                            assignment.status === 'graded' ? 'default' :
                            assignment.status === 'pending' ? 'secondary' :
                            'outline'
                          }>
                            {assignment.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {assignment.description}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                          
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Points: {assignment.points}/{assignment.maxPoints}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        {assignment.submitted ? (
                          <>
                            {assignment.grade && (
                              <Badge className={`${
                                assignment.points >= assignment.maxPoints * 0.9 
                                  ? 'bg-green-500' 
                                  : assignment.points >= assignment.maxPoints * 0.8 
                                  ? 'bg-blue-500' 
                                  : 'bg-yellow-500'
                              } text-white`}>
                                Grade: {assignment.grade}
                              </Badge>
                            )}
                            <Button variant="outline" size="sm">
                              View Submission
                            </Button>
                          </>
                        ) : (
                          <Button size="sm">
                            {assignment.status === 'upcoming' ? 'View Details' : 'Submit Assignment'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Materials</h2>
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download All
              </Button>
            </div>

            <div className="grid gap-4">
              {course.materials.map((material) => (
                <Card key={material.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getFileIcon(material.type)}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {material.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {material.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Size: {material.size}</span>
                            <span>•</span>
                            <span>Uploaded: {new Date(material.uploadDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="uppercase">{material.type}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Preview
                        </Button>
                        <Button size="sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Participants</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{course.enrollment.total} total participants</span>
                <Badge variant="outline">
                  {course.participants.filter(p => p.role === 'student').length} students
                </Badge>
              </div>
            </div>

            <div className="grid gap-4">
              {course.participants.map((participant) => (
                <Card key={participant.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {participant.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant={participant.role === 'teaching_assistant' ? 'default' : 'secondary'}>
                              {participant.role.replace('_', ' ')}
                            </Badge>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Joined {new Date(participant.joinDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {participant.role === 'student' && (
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Progress: {participant.progress}%
                          </div>
                          <div className="w-24">
                            <Progress value={participant.progress} className="h-2" />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
