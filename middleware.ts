import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/session" // <- your custom decrypt function from jose
import { isPast } from "date-fns"

const publicRoutes = [ "/login", "/signup"]

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  const sessionCookie = req.cookies.get("session")?.value

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    const session = await decrypt(sessionCookie) as { role: string; expiresAt: string }

    if (!session || !session.expiresAt || isPast(new Date(session.expiresAt))) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    const role = session.role

    // Route-based role protection
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (pathname.startsWith("/moderator") && !["admin", "moderator"].includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    // ✅ allowed
    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

// Only run middleware for role-based routes
export const config = {
  matcher: [
    "/admin/:path*",
    "/moderator/:path*",
    "/dashboard/:path*"
  ],
}
