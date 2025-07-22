'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login attempt:', formData)
  }

  return (
    <div className="min-h-screen bg-[url('/images/campus-bg.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
      <div className="w-[420px] h-[480px] bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-2xl backdrop-blur-sm">
        <div className="w-full h-full flex flex-col items-center justify-start px-8 py-10">
          {/* University Logo and Name */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
              University Information System
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Welcome back! Please login to your account.
            </p>
          </div>

          {/* Login Form */}
          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-[350px] h-[45px] px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 transition-colors mx-auto block"
                placeholder="Username"
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-[350px] h-[45px] px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 transition-colors mx-auto block"
                placeholder="Password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-[350px] h-[50px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 mx-auto block"
            >
              Log in
            </button>

            {/* Additional Links */}
            <div className="flex flex-col items-center space-y-3 mt-4 text-sm">
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Lost password?
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">Language:</span>
                <button type="button" className="text-gray-900 dark:text-white hover:underline">English</button>
              </div>
              <button type="button" className="text-gray-600 dark:text-gray-400 hover:underline text-xs">
                Cookies notice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

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
                placeholder="Enter your username"
              />
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
                placeholder="Enter your password"
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <Link
                href="/reset-password"
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105"
            >
              Log In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account yet?{' '}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
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
