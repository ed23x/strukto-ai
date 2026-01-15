import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect API routes and handler routes
  if (pathname.startsWith('/api/') || pathname.startsWith('/handler/')) {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      // For API routes, return 401
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: "Authentication required. Please sign in to access this resource." },
          { status: 401 }
        );
      }
      
      // For handler routes, redirect to sign in
      return NextResponse.redirect(
        new URL('/handler/sign-in', request.url)
      );
    }
  }

  // For protected pages, check if user exists and redirect if not
  if (pathname.startsWith('/profile') || pathname.startsWith('/dashboard')) {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.redirect(
        new URL('/handler/sign-in', request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/handler/:path*',
    '/profile/:path*',
    '/dashboard/:path*',
    '/sign-in/:path*',
  ],
};