'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export default function VerifyOTP() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [verified, setVerified] = useState(false)
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)

  const inputs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const fullOtp = otp.join("")
    if (fullOtp.length !== 6) return

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          otp: fullOtp
        })
      })

      const data = await response.json()

      if (data.success) {
        setVerified(true)
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      } else {
        setError("Invalid OTP")
      }

    } catch (err) {
      setError("Verification failed")
    }
  }

  const isComplete = otp.every((digit) => digit !== "")

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
      <h2 className="text-2xl font-bold mb-6">Verify OTP</h2>

      {!verified ? (
        <>
          <div className="flex justify-between mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputs.current[index] = el }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-10 h-12 border rounded-lg text-center text-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          <button
            disabled={!isComplete}
            onClick={handleVerify}
            className={`w-full py-2 rounded-lg text-white transition ${
              isComplete
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Verify OTP
          </button>
        </>
      ) : (
        <div className="text-green-600 font-semibold">
          ✅ Account Verified Successfully!
        </div>
      )}
    </div>
  )
}
