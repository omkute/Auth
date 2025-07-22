import { NextRequest, NextResponse } from "next/server";
import { decryptAccessToken, decryptRefreshToken } from "./lib/session";
import Session from "./models/Session";

// define Routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export async function middleware(request: NextRequest) {


  // Path
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)


  // get the cookies for storage 
  const sessionToken = request.cookies.get("session")?.value
  const accessCookie = request.cookies.get("access")?.value
  const refreshCookie = request.cookies.get("refresh")?.value

  let refreshToken = null
  let accessToken = null

  if (sessionToken) console.log("Session Check ");
  if (accessCookie) console.log("access Check ");
  if (refreshCookie) console.log("refresh Check ");


  console.log("⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ - Warnning - ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️");
  try {
    if (accessCookie) {
      console.warn("Decrypting Access token... ");
      accessToken = await decryptAccessToken(accessCookie)
      console.log("Decrypting Access token Complete... ", accessToken);
      // const ValidAccessToken = (accessToken && 'expired' in accessToken && accessToken.exp)

      if (accessToken && accessToken.userId && accessToken.sessionId) {
        console.log(" Checking in DB");
        
        const session = await Session.findOne({
          userId: accessToken.userId,
          sessionId: accessToken.sessionId
        })
        console.log(session._id);
        
        if (!session || session.isRevoked || session.expiresAt < Date.now() || session.absoluteExpiry < Date.now()) {
          accessToken = null
        }

      }
      //  if (!ValidAccessToken) {
      //         accessToken = null
      //       }
    }

  } catch (error) {
    console.warn("Access Cookie error", error);

  }



  //   try {
  //     if (refreshCookie) {
  //       refreshToken = await decryptRefreshToken(refreshCookie)
  //       const ValidRefreshToken = (refreshToken && 'expired' in refreshToken && refreshToken.exp)
  //       console.log("Refresh validation : ", ValidRefreshToken);

  //       if (refreshToken) {
  //         accessToken = null
  //       }
  //     }
  //   } catch (error) {
  //     console.log("Refresh Cookie error", error);

  //   }

  //const isAuthenticated = !!(accessToken && accessToken.exp && sessionToken);


  // Debug Logs 

  // console.log("Refresh Token is ", refreshToken);
  // console.log("Valid Access Token ⚠️", accessToken);
  // console.log("SessionId ", sessionToken);
  // console.log(`Middleware: Processing ${path}, Protected: ${isProtectedRoute}, Public: ${isPublicRoute}`)
  // console.log(`Path: ${path} | Authenticated: ${isAuthenticated}`);
  // console.log("Autheniticated: ", isAuthenticated);

  // if (isPublicRoute && isAuthenticated) {
  //   if (isAuthenticated) {
  //     return NextResponse.redirect(new URL('/dashboard', request.nextUrl))

  //   }
  //   return NextResponse.next()
  // }
  // if (isProtectedRoute && !isAuthenticated) {
  //   if (!isAuthenticated) {
  //     return NextResponse.redirect(new URL('/login', request.nextUrl))

  //   }
  // }


  let response = NextResponse.next();

  // if (!accessToken) {
  //   request.cookies.delete("access");
  // }
  // if (!refreshToken) {
  //   request.cookies.delete("refresh");
  //   request.cookies.delete("session");
  // }

  return response;


}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}