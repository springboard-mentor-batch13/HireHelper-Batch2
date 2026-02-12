'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [error, setError] = useState('')

  const handleContinue = () => {
    if (!firstName || !lastName || !email) {
      setError('Please fill all required fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setShowOtpModal(true)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center 
      bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 px-4">

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur 
        rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br 
            from-green-500 to-emerald-600 flex items-center justify-center text-white text-xl">
            👤
          </div>
          <h2 className="text-2xl font-semibold mt-3">Create Account</h2>
          <p className="text-sm text-gray-500">
            Join the Hire-a-Helper community
          </p>
        </div>

        {/* Form */}
        <div className="space-y-3">

          <div className="grid grid-cols-2 gap-3">
            <input className="auth-input" placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)} />
            <input className="auth-input" placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)} />
          </div>

          <input className="auth-input" placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)} />

          <input className="auth-input" placeholder="Phone Number (Optional)"
            onChange={(e) => setPhone(e.target.value)} />

          <div className="relative">
            <input
              className="auth-input pr-11"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <input
              className="auth-input pr-11"
              placeholder="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3.5 text-gray-400">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleContinue}
            className="w-full mt-4 py-3 rounded-xl font-medium text-white
              bg-gradient-to-r from-green-500 to-emerald-600
              hover:from-green-600 hover:to-emerald-700 transition">
            Continue
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-600 font-medium">
            Sign in
          </Link>
        </p>

        {/* OTP MODAL */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-80">
              <h3 className="text-lg font-semibold text-center mb-4">
                Choose OTP Method
              </h3>

              <button
                onClick={() =>
                  router.push(`/verify-otp?method=email&value=${email}`)
                }
                className="w-full bg-blue-500 text-white py-2 rounded-lg mb-3"
              >
                Send OTP to Email
              </button>

              <button
                onClick={() =>
                  router.push(`/verify-otp?method=phone&value=${phone}`)
                }
                className="w-full bg-purple-500 text-white py-2 rounded-lg"
              >
                Send OTP to Phone
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input styles */}
      <style jsx global>{`
        .auth-input {
          width: 100%;
          padding: 0.65rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          outline: none;
        }
        .auth-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.25);
        }
      `}</style>
    </div>
  )
}
