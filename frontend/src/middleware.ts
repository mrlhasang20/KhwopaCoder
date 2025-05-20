// frontend/src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"


export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/dashboard/:path*']  // Only protect dashboard routes
}
// export function middleware(request: NextRequest) {

//   // const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'
//   // const isRootPath = request.nextUrl.pathname === '/'
  
//   // // For root path, redirect to dashboard if authenticated
//   // if (isRootPath) {
//   //   return NextResponse.next()
//   // }

//   // if (isAuthPage) {
//   //   return NextResponse.next()
//   // }

//   // // For protected routes, redirect to login if not authenticated
//   // return NextResponse.next()

//   return NextResponse.next()
// }

// // Configure the middleware to run on specific paths
// export const config = {
//   matcher: ['/dashboard/:path*', '/login', '/register']
// }