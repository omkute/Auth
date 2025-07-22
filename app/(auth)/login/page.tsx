'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import React, { useState } from "react"
import toast from "react-hot-toast"

export default function LoginPage() {

  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feildErrors, setFeildErrors] = useState("")



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError("All the Feilds are mandatory")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {

        toast.success('Login Successful');
        
      } else if (res.status === 422 && data.errors) {
        const parsedErrors = JSON.parse(data.error)

        const errorMessages = parsedErrors.map((error: any) => error.message).join(', ')

        setError(errorMessages)
        // toast.error(errorMessages)
        return
      }
      else {
        setError(data.error)
        // toast.error('Username or Password are invalid');
        // alert(data.error || "Something went wrong.")
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // if (loading) return <p>Loading...</p>
  // if (error) return <p>Error...,{error}</p>


  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className=" flex-col space-y-4">
          <h2 className=' text-2xl'>Login</h2>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-2 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error ? <p className=" text-red-400">{error}</p> : ""}

          </div>
          <Button type="submit" onClick={handleSubmit} className="w-full cursor-pointer">
            {loading ? "Loading ..." : "Login"}
          </Button>
          <div className=" flex space-x-3">
            <p> Create new one ?</p>
            <Link className=" font-bold" href='signup'>Signup</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
