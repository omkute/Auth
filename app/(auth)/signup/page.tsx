'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react';
import toast from 'react-hot-toast'


function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feildErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!email || !username || !password) {
      setError("All the feilds are mandatory")
      setLoading(false)
      return
    }

    try {
      // await signIn(email, password);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        
        toast.success('SignUp Successful');
        router.push('/dashboard');
      } else if (res.status === 422 && data.errors) {
        const errors: { [key: string]: string } = {}
        data.errors.forEach((err: { path: string; message: string }) => {
          const errorMessage = errors[err.path] = err.message
          setError(errorMessage)
        })
        
      }

      else {
        alert(data.error || "Something went wrong.")
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  // if (loading) return <p>Loading...</p>
  // if (error) return <p>Error...</p>

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className=" flex-col space-y-4">
          <h2 className=' text-2xl'>SignUp</h2>

          <div className="grid gap-3">
            <Label htmlFor="text">name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Om Kute"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              
              />
              {feildErrors.name && <p className="text-sm text-red-500">{feildErrors.name}</p>}
          </div>
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
           {loading ? "Loading ..." : "Signup"}

          </Button>
          <div className=" flex space-x-3">
            <p> Already have one ?</p>

            <Link className=" font-bold" href='/login'>Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp



