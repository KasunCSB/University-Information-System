'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { safeGetFromStorage, safeSetToStorage, safeRemoveFromStorage } from '@/lib/storageUtils'
import ApiService, { AuthResponse } from '@/lib/apiService'

interface User {
  id: string
  username: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  isEmailVerified: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: { username: string; email: string; password: string; role?: string }) => Promise<boolean>
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
      safeRemoveFromStorage('accessToken')
      safeRemoveFromStorage('refreshToken')
      setUser(null)
      setIsAuthenticated(false)
    }

    const checkAuth = async () => {
      try {
        if (typeof window === 'undefined') {
          setIsLoading(false)
          return
        }

        const authResult = safeGetFromStorage<string>('isAuthenticated')
        const userResult = safeGetFromStorage<User>('user')
        const tokenResult = safeGetFromStorage<string>('accessToken')
        
        if (authResult.success && authResult.data === 'true' && 
            userResult.success && userResult.data && 
            tokenResult.success && tokenResult.data) {
          
          const user = userResult.data
          
          // Validate user object structure
          if (user && typeof user === 'object' && user.id && user.username && user.email && user.role) {
            try {
              // Verify token is still valid by fetching profile
              const profileResponse = await ApiService.getProfile()
              if (profileResponse.success && profileResponse.data) {
                setUser(profileResponse.data as User)
                setIsAuthenticated(true)
              } else {
                clearAuthData()
              }
            } catch (error: unknown) {
              console.warn('Token validation failed, clearing auth data:', error)
              clearAuthData()
            }
          } else {
            console.warn('Invalid user data structure, clearing auth')
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
      
      const response: AuthResponse = await ApiService.login({ email, password })
      
      if (response.success && response.user && response.tokens) {
        const userData: User = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          role: response.user.role as 'student' | 'teacher' | 'admin',
          isEmailVerified: response.user.isEmailVerified
        }
        
        // Store auth data
        const authResult = safeSetToStorage('isAuthenticated', 'true')
        const userResult = safeSetToStorage('user', userData)
        const tokenResult = safeSetToStorage('accessToken', response.tokens.accessToken)
        const refreshResult = safeSetToStorage('refreshToken', response.tokens.refreshToken)
        
        if (authResult.success && userResult.success && tokenResult.success && refreshResult.success) {
          setUser(userData)
          setIsAuthenticated(true)
          return true
        } else {
          console.error('Failed to store auth data')
          return false
        }
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (userData: { 
    username: string; 
    email: string; 
    password: string; 
    role?: string 
  }): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const response: AuthResponse = await ApiService.register(userData)
      
      if (response.success) {
        return true
      }
      
      return false
    } catch (error) {
      console.error('Registration error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      const refreshToken = safeGetFromStorage<string>('refreshToken')
      
      if (refreshToken.success && refreshToken.data) {
        await ApiService.logout(refreshToken.data)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage regardless of API call success
      setUser(null)
      setIsAuthenticated(false)
      
      safeRemoveFromStorage('isAuthenticated')
      safeRemoveFromStorage('user')
      safeRemoveFromStorage('accessToken')
      safeRemoveFromStorage('refreshToken')
    }
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
      register,
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
