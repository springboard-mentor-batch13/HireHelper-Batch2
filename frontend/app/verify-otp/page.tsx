'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export default function VerifyOTP() {
  const router = useRouter()

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [verified, setVerified] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(30)
  const [canResend, setCanResend] = useState<boolean>(false)

  const inputs = useRef<Array<HTMLInputElement | null>>([])

  // ⏳ Countdown Logic
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

    if (value !== "" && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const isComplete = otp.every((digit) => digit !== "")

  const handleVerify = () => {
    if (!isComplete) return

    setVerified(true)

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  const handleResend = () => {
    if (!canResend) return

    setTimer(30)
    setCanResend(false)
    setOtp(["", "", "", "", "", ""])
    inputs.current[0]?.focus()

    console.log("OTP Resent")
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
      <h2 className="text-2xl font-bold mb-6">Verify OTP</h2>

      {!verified ? (
        <>
          <div className="flex justify-between mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputs.current[index] = el
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-12 border rounded-lg text-center text-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            ))}
          </div>

          <button
            disabled={!isComplete}
            onClick={handleVerify}
            className={`w-full py-2 rounded-lg text-white transition ${
              isComplete
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Verify & Create Account
          </button>

          {/* 🔁 RESEND SECTION */}
          <div className="mt-4 text-sm">
            {!canResend ? (
              <p className="text-gray-500">
                Resend OTP in <span className="font-semibold">{timer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="fade-in text-green-600 font-semibold">
          ✅ Account Created Successfully!
          <p className="text-gray-500 text-sm mt-2">
            Redirecting to login...
          </p>
        </div>
      )}
    </div>
  )
}
