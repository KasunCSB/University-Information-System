'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'

export default function CompleteRegistrationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { completeRegistration, verifyEmailToken, isLoading } = useAuth()
  
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [tokenExpiration, setTokenExpiration] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'teacher' | 'admin'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const verifyToken = async () => {
      const tokenParam = searchParams.get('token')
      const expiresParam = searchParams.get('expires')
      
      if (!tokenParam) {
        setError('Invalid or missing verification token. Please request a new verification email.')
        return
      }
      
      // Check if token has expired based on URL parameter
      if (expiresParam) {
        const expirationTime = parseInt(expiresParam) * 1000 // Convert from seconds to milliseconds
        const now = Date.now()
        
        if (expirationTime <= now) {
          setError('This verification link has expired. Please request a new verification email.')
          return
        }
        
        // Set expiration time for display
        setTokenExpiration(new Date(expirationTime).toLocaleString())
      }
      
      setToken(tokenParam)
      
      try {
        const result = await verifyEmailToken(tokenParam)
        if (result.success && result.data) {
          setEmail(result.data.email)
          setIsTokenValid(true)
          
          // Update expiration time if returned from server
          if (result.data.expiresAt) {
            setTokenExpiration(new Date(result.data.expiresAt).toLocaleString())
          }
        } else {
          setError(result.message || 'Invalid or expired verification token.')
        }
      } catch (error) {
        console.error('Token verification error:', error)
        if (error instanceof Error) {
          if (error.message.includes('expired')) {
            setError('This verification link has expired. Please request a new verification email.')
          } else if (error.message.includes('Invalid token')) {
            setError('Invalid verification token format. Please request a new verification email.')
          } else {
            setError('Failed to verify token. Please try again or request a new verification email.')
          }
        } else {
          setError('Failed to verify token. Please try again.')
        }
      }
    }

    verifyToken()
  }, [searchParams, verifyEmailToken])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError('Invalid or missing verification token.')
      return
    }

    // Validation
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
      return
    }

    try {
      const result = await completeRegistration({
        token,
        username: formData.username,
        password: formData.password,
        role: formData.role
      })

      if (result.success) {
        setSuccess('Account created successfully! Redirecting to your dashboard...')
        
        // Redirect based on role after a delay
        setTimeout(() => {
          switch (formData.role) {
            case 'admin':
              router.push('/admin')
              break
            case 'teacher':
              router.push('/courses') // Teacher course management
              break
            case 'student':
            default:
              router.push('/courses') // Student course view
              break
          }
        }, 2000)
      } else {
        setError(result.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Complete registration error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.'
      setError(errorMessage)
    }
  }

  if (!isTokenValid && !error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Verifying your email...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Registration
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
              {email && `Creating account for ${email}`}
            </p>
            {tokenExpiration && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Link expires: {tokenExpiration}
              </p>
            )}
          </div>

          {/* Registration Form */}
          <div className="bg-white dark:bg-gray-800 py-8 px-6 sm:px-8 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700">
            {isTokenValid ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-600 shadow-lg">
                    <Image
                      src="/images/login-avatar.png"
                      alt="Registration Avatar"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 transition-colors"
                    placeholder="Choose a username"
                    minLength={3}
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 transition-colors"
                    placeholder="Create a strong password"
                    minLength={6}
                  />
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 transition-colors"
                    placeholder="Confirm your password"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition-all duration-200 ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
                <div className="mt-4">
                  <Link
                    href="/signup"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Request a new verification email
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
