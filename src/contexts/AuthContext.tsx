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
  // Email verification and registration flow
  sendVerificationEmail: (email: string) => Promise<{ success: boolean; message?: string }>
  verifyEmailToken: (token: string) => Promise<{ success: boolean; message?: string; data?: { email: string; token: string; expiresAt?: string } }>
  completeRegistration: (data: { token: string; username: string; password: string; role?: string }) => Promise<{ success: boolean; message?: string }>
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
                const profileUser = profileResponse.data as User
                // Update user data with latest from server (especially email verification status)
                setUser(profileUser)
                setIsAuthenticated(true)
                
                // Update stored user data if there are changes
                if (JSON.stringify(user) !== JSON.stringify(profileUser)) {
                  safeSetToStorage('user', profileUser)
                }
              } else {
                clearAuthData()
              }
            } catch (error: unknown) {
              console.warn('Token validation failed, clearing auth data:', error)
              // Check if it's a token sync error
              if (error instanceof Error && error.message.includes('Token out of sync')) {
                console.info('Token out of sync detected, will attempt refresh on next API call')
                setUser(user) // Keep user data but they'll get refreshed tokens on next API call
                setIsAuthenticated(true)
              } else {
                clearAuthData()
              }
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
      } else if (!response.success && response.requiresEmailVerification) {
        // Store user email for email verification process
        if (response.userEmail) {
          const userDataForVerification = { email: response.userEmail }
          safeSetToStorage('user', userDataForVerification)
        }
        throw new Error(response.message || 'Email verification required')
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      // Re-throw the error so the login page can handle it
      throw error
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

  // Three-step registration methods
  const sendVerificationEmail = useCallback(async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)
      const response = await ApiService.sendVerificationEmail(email)
      return { success: response.success, message: response.message }
    } catch (error) {
      console.error('Send verification email error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email'
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verifyEmailToken = useCallback(async (token: string): Promise<{ success: boolean; message?: string; data?: { email: string; token: string; expiresAt?: string } }> => {
    try {
      setIsLoading(true)
      const response = await ApiService.verifyEmailToken(token)
      return { 
        success: response.success, 
        message: response.message,
        data: response.data 
      }
    } catch (error) {
      console.error('Verify email token error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Email verification failed'
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const completeRegistration = useCallback(async (data: { 
    token: string; 
    username: string; 
    password: string; 
    role?: string 
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)
      const response = await ApiService.completeRegistration(data)
      return { success: response.success, message: response.message }
    } catch (error) {
      console.error('Complete registration error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      sendVerificationEmail,
      verifyEmailToken,
      completeRegistration,
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
