import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Session from "@/models/Session"; // Uncomment if you need to invalidate server-side sessions

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();

    // Optional: Get user info before logout for cleanup
    const sessionToken = (await cookieStore).get("session")?.value;
    const accessToken = (await cookieStore).get("access")?.value;
    const refreshToken = (await cookieStore).get("refresh")?.value;

    // Optional: Invalidate session in database
    if (sessionToken || refreshToken || accessToken) {
      try {
        // revoke the Session 
        await Session.updateOne(
          { sessionId: sessionToken },
          { isRevoked: true }
        );
      } catch (error) {
         throw new Error('Invalid Tokens');
      }
    }

    // Create response with success message
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Delete all authentication cookies
    response.cookies.set({
      name: "session",
      value: "",
      expires: new Date(0), // Set to past date to delete
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    response.cookies.set({
      name: "access",
      value: "",
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    response.cookies.set({
      name: "refresh",
      value: "",
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Logout failed. Please try again.'
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}