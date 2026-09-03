import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (
    pathname.startsWith("/wp-admin") ||
    pathname.startsWith("/wp-login.php") ||
    pathname.startsWith("/wp-json") ||
    pathname.startsWith("/wp-content") ||
    pathname.startsWith("/wp-includes") ||
    pathname === "/xmlrpc.php"
  ) {
    // Target the cPanel web server IP
    const targetUrl = `http://118.139.178.174${pathname}${search}`
    
    // Set Host header to galcare.com so Apache routes to the correct virtualhost
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("host", "galcare.com")

    return NextResponse.rewrite(new URL(targetUrl), {
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/wp-admin",
    "/wp-admin/:path*",
    "/wp-login.php",
    "/wp-json/:path*",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/xmlrpc.php",
  ],
}
