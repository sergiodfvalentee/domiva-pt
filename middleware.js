import { NextResponse } from 'next/server'

console.log('🔧 Middleware em modo de desenvolvimento offline')

// Simplified security headers for development
const developmentHeaders = {
  // Basic Content Security Policy for development
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-src 'none'",
    "object-src 'none'"
  ].join('; '),
  
  // Basic security headers
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}

export function middleware(request) {
  console.log(`🔄 Processing request: ${request.nextUrl.pathname}`)
  
  const response = NextResponse.next()
  
  // Apply basic security headers for development
  Object.entries(developmentHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add custom header to identify development mode
  response.headers.set('X-Development-Mode', 'offline')
  
  // Log all requests in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ Request processed: ${request.nextUrl.pathname}`)
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 