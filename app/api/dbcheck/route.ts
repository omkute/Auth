// app/api/dbcheck/route.ts
import dbConnect from "@/utils/connectDB"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await dbConnect()
    return NextResponse.json({ success: true, message: "Connected to MongoDB successfully!" })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "MongoDB connection failed", error: error.message },
      { status: 500 }
    )
  }
}
