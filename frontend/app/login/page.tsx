'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <input
        className="w-full border rounded-lg px-4 py-2 mb-4"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border rounded-lg px-4 py-2 mb-4"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={() => router.push('/dashboard')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
      >
        Login
      </button>

      <p className="text-center mt-4">
        Don't have an account?
        <span
          onClick={() => router.push('/register')}
          className="text-blue-600 cursor-pointer ml-1"
        >
          Sign Up
        </span>
      </p>
    </div>
  )
}
