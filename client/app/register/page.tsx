"use client"

import { useState } from "react"
import Link from "next/link"

export default function RegisterPage() {

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const handleSubmit = (e:React.FormEvent) =>{
    e.preventDefault()
    console.log({name,email,password})
  }

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-bold text-center mb-6">
          Create EventHub Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-3 rounded"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded hover:bg-gray-800"
          >
            Register
          </button>

        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600">
            Login
          </Link>
        </p>

      </div>

    </div>

  )
}