'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Dummy password for frontend demo
  const DEMO_PASSWORD = 'Admin@123'

  const handleLogin = () => {
    // Empty field check
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    // Password check
    if (password !== DEMO_PASSWORD) {
      setError('Password is wrong')
      return
    }

    // Success
    setError('')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center 
      bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            ✈️
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to your Hire-a-Helper account
        </p>

        <label className="text-sm font-medium text-gray-600">
          Email address
        </label>
        <input
          className="w-full mt-1 mb-3 px-4 py-2.5 border rounded-lg
            focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-sm font-medium text-gray-600">
          Password
        </label>
        <input
          className="w-full mt-1 mb-3 px-4 py-2.5 border rounded-lg
            focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700
            text-white py-2.5 rounded-lg transition font-medium"
        >
          Sign in
        </button>

        <p className="text-center mt-5 text-sm">
          Don’t have an account?{' '}
          <Link href="/register" className="text-blue-600 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
