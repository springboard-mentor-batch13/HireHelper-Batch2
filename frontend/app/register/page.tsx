'use client'

import { useState, useRef, useEffect } from 'react'
import { Eye, EyeOff, Check, X } from 'lucide-react'
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

  // Password Strength State
  const [passwordScore, setPasswordScore] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [otpError, setOtpError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const otpInputs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    checkPasswordStrength(password)
  }, [password])

  const checkPasswordStrength = (pass: string) => {
    const feedback = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    }

    setPasswordFeedback(feedback)

    let score = 0
    if (feedback.length) score++
    if (feedback.uppercase) score++
    if (feedback.lowercase) score++
    if (feedback.number) score++
    if (feedback.special) score++

    setPasswordScore(score)
  }

  const getStrengthColor = () => {
    if (passwordScore <= 2) return 'bg-red-500'
    if (passwordScore === 3) return 'bg-yellow-500'
    if (passwordScore >= 4) return 'bg-green-500'
    return 'bg-gray-200'
  }

  const getStrengthLabel = () => {
    if (passwordScore === 0) return 'Very Weak'
    if (passwordScore <= 2) return 'Weak'
    if (passwordScore === 3) return 'Good'
    if (passwordScore >= 4) return 'Strong'
    return ''
  }

  const handleContinue = async () => {
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill all required fields.')
      return
    }

    if (passwordScore < 3) {
      setError('Password is too weak. Please ensure it meets the requirements.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      // Request OTP
      const res = await fetch('http://127.0.0.1:8000/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          phone_number: phone,
          password: password
        })
      })

      if (!res.ok) {
        throw new Error('Failed to send OTP')
      }

      setShowOtpModal(true)
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value !== "" && index < 5) {
      otpInputs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpInputs.current[index - 1]?.focus()
    }
  }

  const verifyAndSignup = async () => {
    const otpValue = otp.join('')
    if (otpValue.length !== 6) return

    setIsVerifying(true)
    setOtpError('')

    try {
      // 1. Verify OTP
      const verifyRes = await fetch('http://127.0.0.1:8000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue })
      })

      const verifyData = await verifyRes.json()

      if (!verifyRes.ok || verifyData.error) {
        throw new Error(verifyData.error || 'Invalid OTP')
      }

      // 2. Create Account
      const signupRes = await fetch('http://127.0.0.1:8000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phone,
          password
        })
      })

      if (!signupRes.ok) {
        throw new Error('Failed to create account')
      }

      // Success
      router.push('/login')

    } catch (err: any) {
      setOtpError(err.message || 'Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setStrength(checkStrength(value))
  }
const handleContinue = async () => {
  if (!firstName || !lastName || !email) {
    setError("Please fill all required fields.")
    return
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.")
    return
  }

  if (strength === "Weak") {
    setError("Password is too weak.")
    return
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone,
        password: password
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      setError(result.detail || "Failed to send OTP")
      return
    }

    router.push(`/verify-otp?email=${email}`)

  } catch {
    setError("Something went wrong")
  }
}
  return (
    <div className="min-h-screen w-full flex items-center justify-center 
      bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 px-4 py-8">

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
              value={password}
            />
            <button type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password Strength Meter */}
          {password && (
            <div className="space-y-2 mb-2">
              <div className="flex gap-1 h-1.5 w-full">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s}
                    className={`h-full flex-1 rounded-full transition-all duration-300
                            ${passwordScore >= s ? getStrengthColor() : 'bg-gray-200'}`}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className={`font-medium transition-colors duration-300
                        ${passwordScore <= 2 ? 'text-red-500' :
                    passwordScore === 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                  Strength: {getStrengthLabel()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <RequirementItem met={passwordFeedback.length} label="8+ chars" />
                <RequirementItem met={passwordFeedback.uppercase} label="Uppercase" />
                <RequirementItem met={passwordFeedback.lowercase} label="Lowercase" />
                <RequirementItem met={passwordFeedback.number} label="Number" />
                <RequirementItem met={passwordFeedback.special} label="Special char" />
              </div>
            </div>
          )}

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
            disabled={isLoading || passwordScore < 3}
            className="w-full mt-4 py-3 rounded-xl font-medium text-white
              bg-gradient-to-r from-green-500 to-emerald-600
              hover:from-green-600 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Sending OTP...' : 'Continue'}
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl">
              <h3 className="text-xl font-semibold text-center mb-2">
                Verify Email
              </h3>
              <p className="text-center text-gray-500 text-sm mb-6">
                Enter the 6-digit code sent to<br />
                <span className="font-medium text-gray-900">{email}</span>
              </p>

              <div className="flex justify-between mb-6 gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputs.current[index] = el
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-12 h-14 border-2 border-slate-200 rounded-xl text-center text-xl font-bold 
                    focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition"
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-red-500 text-center text-sm mb-4">{otpError}</p>
              )}

              <button
                onClick={verifyAndSignup}
                disabled={isVerifying || otp.join('').length !== 6}
                className="w-full py-3 rounded-xl font-medium text-white
                  bg-gradient-to-r from-green-500 to-emerald-600
                  hover:from-green-600 hover:to-emerald-700 transition disabled:opacity-50">
                {isVerifying ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              <button
                onClick={() => setShowOtpModal(false)}
                className="w-full mt-3 text-gray-500 text-sm hover:text-gray-700">
                Cancel
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

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs transition-colors duration-300
            ${met ? 'text-green-600' : 'text-gray-400'}`}>
      {met ? <Check size={12} /> : <X size={12} />}
      <span>{label}</span>
    </div>
  )
}
