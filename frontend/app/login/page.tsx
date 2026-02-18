'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()

  // Login State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Forgot Password State
  const [view, setView] = useState<'login' | 'forgot-password'>('login')
  const [fpStep, setFpStep] = useState<1 | 2 | 3>(1)
  const [fpEmail, setFpEmail] = useState('')
  const [fpOtp, setFpOtp] = useState('')
  const [fpNewPassword, setFpNewPassword] = useState('')
  const [fpConfirmPassword, setFpConfirmPassword] = useState('')
  const [fpLoading, setFpLoading] = useState(false)
  const [fpError, setFpError] = useState('')
  const [fpMessage, setFpMessage] = useState('')

  // -------------------------
  // LOGIN LOGIC
  // -------------------------
  const handleLogin = async () => {
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Login failed')
      }

      // Store token based on Remember Me
      if (rememberMe) {
        localStorage.setItem('token', data.access_token)
      } else {
        sessionStorage.setItem('token', data.access_token)
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // -------------------------
  // FORGOT PASSWORD LOGIC
  // -------------------------
  const handleRequestOtp = async () => {
    setFpError('')
    setFpMessage('')
    setFpLoading(true)

    try {
      const res = await fetch('http://127.0.0.1:8000/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fpEmail })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to send OTP')

      setFpMessage('OTP sent to your email')
      setFpStep(2)
    } catch (err: any) {
      setFpError(err.message)
    } finally {
      setFpLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    // Optional: Just verify locally or hit an endpoint.
    // Since we'll verify again at final step, let's just move next for UX or check correctness.
    // But we need to be sure OTP is correct before showing password field? 
    // Actually, the backend API uses OTP to reset password directly.
    // Let's verify it first using the existing verify-otp endpoint to give immediate feedback.

    setFpError('')
    setFpLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fpEmail, otp: fpOtp })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Invalid OTP')
      }

      setFpStep(3)
    } catch (err: any) {
      setFpError(err.message)
    } finally {
      setFpLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (fpNewPassword !== fpConfirmPassword) {
      setFpError("Passwords do not match")
      return
    }

    setFpError('')
    setFpLoading(true)

    try {
      const res = await fetch('http://127.0.0.1:8000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: fpEmail,
          otp: fpOtp,
          new_password: fpNewPassword
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to reset password')

      setFpMessage('Password reset successfully! Please login.')
      setTimeout(() => {
        setView('login')
        setFpStep(1)
        setFpEmail('')
        setFpOtp('')
        setFpNewPassword('')
        setFpConfirmPassword('')
        setFpMessage('')
      }, 2000)
    } catch (err: any) {
      setFpError(err.message)
    } finally {
      setFpLoading(false)
    }
  }

  // -------------------------
  // RENDER HELPERS
  // -------------------------
  const renderForgotPassword = () => (
    <>
      <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        {fpStep === 1 && "Enter your email to receive an OTP"}
        {fpStep === 2 && "Enter the OTP sent to your email"}
        {fpStep === 3 && "Set your new password"}
      </p>

      {/* STEP 1: EMAIL */}
      {fpStep === 1 && (
        <>
          <label className="text-sm font-medium text-gray-600">Email address</label>
          <input
            className="w-full mt-1 mb-4 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your email"
            value={fpEmail}
            onChange={(e) => setFpEmail(e.target.value)}
          />
          <button
            onClick={handleRequestOtp}
            disabled={fpLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition font-medium disabled:opacity-50"
          >
            {fpLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </>
      )}

      {/* STEP 2: OTP */}
      {fpStep === 2 && (
        <>
          <label className="text-sm font-medium text-gray-600">Enter OTP</label>
          <input
            className="w-full mt-1 mb-4 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-widest text-lg"
            placeholder="000000"
            value={fpOtp}
            onChange={(e) => setFpOtp(e.target.value)}
            maxLength={6}
          />
          <button
            onClick={handleVerifyOtp}
            disabled={fpLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition font-medium disabled:opacity-50"
          >
            {fpLoading ? 'Verifying...' : 'Verify & Continue'}
          </button>
          <button
            onClick={() => setFpStep(1)}
            className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Wrong email? Go back
          </button>
        </>
      )}

      {/* STEP 3: NEW PASSWORD */}
      {fpStep === 3 && (
        <>
          <label className="text-sm font-medium text-gray-600">New Password</label>
          <input
            className="w-full mt-1 mb-4 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="New password"
            type="password"
            value={fpNewPassword}
            onChange={(e) => setFpNewPassword(e.target.value)}
          />
          <label className="text-sm font-medium text-gray-600">Confirm Password</label>
          <input
            className="w-full mt-1 mb-4 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Confirm password"
            type="password"
            value={fpConfirmPassword}
            onChange={(e) => setFpConfirmPassword(e.target.value)}
          />
          <button
            onClick={handleResetPassword}
            disabled={fpLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition font-medium disabled:opacity-50"
          >
            {fpLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </>
      )}

      {fpError && (
        <p className="text-red-500 text-sm text-center mt-4">{fpError}</p>
      )}
      {fpMessage && (
        <p className="text-green-500 text-sm text-center mt-4">{fpMessage}</p>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setView('login')
            setFpStep(1)
            setFpError('')
            setFpMessage('')
          }}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Back to Login
        </button>
      </div>
    </>
  )

  const renderLogin = () => (
    <>
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
        className="w-full mt-1 mb-4 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="text-sm font-medium text-gray-600">
        Password
      </label>
      <input
        className="w-full mt-1 mb-4 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Enter your password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex justify-between items-center text-sm mb-5">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-blue-600"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
        </label>
        <span
          className="text-blue-600 cursor-pointer hover:underline"
          onClick={() => setView('forgot-password')}
        >
          Forgot password?
        </span>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition font-medium disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>

      <p className="text-center mt-5 text-sm">
        Don’t have an account?{' '}
        <Link href="/register" className="text-blue-600 font-medium">
          Sign up
        </Link>
      </p>
    </>
  )

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            ✈️
          </div>
        </div>

        {view === 'login' ? renderLogin() : renderForgotPassword()}

      </div>
    </div>
  )
}
