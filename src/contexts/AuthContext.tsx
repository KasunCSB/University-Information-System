'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { safeGetFromStorage, safeSetToStorage, safeRemoveFromStorage } from '@/lib/storageUtils'

interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'teacher' | 'admin'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    const clearAuthData = () => {
      safeRemoveFromStorage('isAuthenticated')
      safeRemoveFromStorage('user')
      setUser(null)
      setIsAuthenticated(false)
    }

    const checkAuth = () => {
      try {
        if (typeof window === 'undefined') {
          setIsLoading(false)
          return
        }

        const authResult = safeGetFromStorage<string>('isAuthenticated')
        const userResult = safeGetFromStorage<User>('user')
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth check details:', { 
            authSuccess: authResult.success,
            authData: authResult.data,
            userSuccess: userResult.success,
            userType: typeof userResult.data
          })
        }
        
        if (authResult.success && authResult.data === 'true' && userResult.success && userResult.data) {
          const user = userResult.data
          
          // Validate user object structure with detailed logging
          if (user && typeof user === 'object' && user.id && user.name && user.email && user.role) {
            setUser(user)
            setIsAuthenticated(true)
          } else {
            console.warn('Invalid user data structure, clearing auth:', {
              user,
              hasId: user && typeof user === 'object' && 'id' in user,
              hasName: user && typeof user === 'object' && 'name' in user,
              hasEmail: user && typeof user === 'object' && 'email' in user,
              hasRole: user && typeof user === 'object' && 'role' in user,
              type: typeof user
            })
            clearAuthData()
          }
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Simulate API call with basic validation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Basic validation (in a real app, this would be server-side)
      if (!email || !password) {
        return false
      }
      
      // Determine user role based on credentials (for demo purposes)
      let userRole: 'student' | 'teacher' | 'admin' = 'student'
      let userName = email
      
      // Check for admin credentials
      if (email.toLowerCase() === 'admin' && password === 'admin123') {
        userRole = 'admin'
        userName = 'Administrator'
      } else if (email.toLowerCase().includes('teacher') || email.toLowerCase().includes('prof')) {
        userRole = 'teacher'
        userName = `Prof. ${email.split('@')[0]}`
      } else {
        // Extract name from email or use email
        userName = email.includes('@') ? email.split('@')[0] : email
        userName = userName.charAt(0).toUpperCase() + userName.slice(1)
      }
      
      // Mock successful login with proper user object
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        name: userName,
        email: email.includes('@') ? email : `${email}@university.edu`,
        role: userRole
      }
      
      // Safely store user data with error handling
      const authResult = safeSetToStorage('isAuthenticated', 'true')
      const userResult = safeSetToStorage('user', mockUser)
      
      if (authResult.success && userResult.success) {
        setUser(mockUser)
        setIsAuthenticated(true)
        return true
      } else {
        console.error('Failed to store auth data:', { authResult, userResult })
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    
    // Safely clear localStorage
    safeRemoveFromStorage('isAuthenticated')
    safeRemoveFromStorage('user')
  }, [])

  const updateUser = useCallback((userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      
      // Safely update localStorage
      const result = safeSetToStorage('user', updatedUser)
      if (!result.success) {
        console.error('Failed to update user data in localStorage:', result.error)
      }
    }
  }, [user])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
