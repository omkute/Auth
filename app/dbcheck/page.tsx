'use client'

import { useEffect, useState } from "react"

export default function DBCheckPage() {
  const [status, setStatus] = useState("Checking...")
  const [error, setError] = useState("")

  useEffect(() => {
    const checkDB = async () => {
      try {
        const res = await fetch("/api/dbcheck")
        const data = await res.json()

        if (data.success) {
          setStatus(data.message)
        } else {
          setStatus("Failed")
          setError(data.message)
        }
      } catch (err) {
        setStatus("Error")
        setError("Could not connect to API")
        console.log(err);
        
      }
    }

    checkDB()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">MongoDB Connection Status</h1>
      <p className="mt-2 text-green-600">{status}</p>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  )
}
