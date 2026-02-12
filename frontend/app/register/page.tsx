'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [strength, setStrength] = useState("")
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)

  const checkStrength = (value: string) => {
    if (value.length < 6) return "Weak"
    if (/[!@#$%^&*]/.test(value) && value.length >= 8) return "Strong"
    return "Medium"
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setStrength(checkStrength(value))
  }

  const handleContinue = () => {
    if (!fullName || !email || !phone) {
      setError("Please fill all fields.")
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

    setError("")
    setShowModal(true)
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

      <input
        className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-green-400 outline-none"
        placeholder="Full Name"
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-green-400 outline-none"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-green-400 outline-none"
        placeholder="Phone Number"
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* Password */}
      <div className="relative mb-2">
        <input
          className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-green-400 outline-none"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          onChange={(e) => handlePasswordChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-gray-500 transition"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {password && (
        <p className={`text-sm mb-3 ${
          strength === "Weak" ? "text-red-500" :
          strength === "Medium" ? "text-yellow-500" :
          "text-green-500"
        }`}>
          Strength: {strength}
        </p>
      )}

      {/* Confirm Password */}
      <div className="relative mb-3">
        <input
          className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-green-400 outline-none"
          placeholder="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-2.5 text-gray-500 transition"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={handleContinue}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
      >
        Continue
      </button>

      {/* OTP MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 fade-in">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Choose OTP Method
            </h3>

            <button
              onClick={() =>
                router.push(`/verify-otp?method=email&value=${email}`)
              }
              className="w-full bg-blue-500 text-white py-2 rounded-lg mb-2"
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
  )
}
