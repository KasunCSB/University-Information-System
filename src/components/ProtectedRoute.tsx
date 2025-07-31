'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: 'student' | 'teacher' | 'admin'
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireRole,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requireRole && user && user.role !== requireRole) {
        router.push('/dashboard') // Redirect to dashboard if wrong role
        return
      }
    }
  }, [isAuthenticated, user, isLoading, requireAuth, requireRole, redirectTo, router])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Don't render children if auth requirements aren't met
  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (requireRole && user && user.role !== requireRole) {
    return null
  }

  return <>{children}</>
}
