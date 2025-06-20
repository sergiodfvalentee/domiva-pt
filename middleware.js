import { NextResponse } from 'next/server'

// Rate limiting store (in production, use Redis or database)
const rateLimit = new Map()

// Security headers
const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://cdn.vercel-insights.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://vercel.live https://vitals.vercel-insights.com wss://*.supabase.co",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Prevent XSS attacks
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  
  // HTTPS enforcement
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
}

// Rate limiting configuration (VERY relaxed for development)
const RATE_LIMIT_CONFIG = {
  // Authentication endpoints (very relaxed for development)
  '/api/auth': { requests: 1000, window: 15 * 60 * 1000 }, // 1000 requests per 15 minutes
  '/login': { requests: 1000, window: 15 * 60 * 1000 },
  '/criar-conta': { requests: 1000, window: 60 * 60 * 1000 }, // 1000 registrations per hour (dev mode)
  '/recuperar-password': { requests: 1000, window: 60 * 60 * 1000 },
  
  // General pages
  'default': { requests: 1000, window: 15 * 60 * 1000 } // 1000 requests per 15 minutes
}

function getRateLimitKey(ip, path) {
  return `${ip}:${path}`
}

function checkRateLimit(request) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const path = request.nextUrl.pathname
  
  // Find matching rate limit config
  let config = RATE_LIMIT_CONFIG.default
  for (const [pattern, patternConfig] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pattern !== 'default' && path.startsWith(pattern)) {
      config = patternConfig
      break
    }
  }
  
  const key = getRateLimitKey(ip, path)
  const now = Date.now()
  const windowStart = now - config.window
  
  // Get or create rate limit entry
  if (!rateLimit.has(key)) {
    rateLimit.set(key, [])
  }
  
  const requests = rateLimit.get(key)
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => timestamp > windowStart)
  
  // Check if rate limit exceeded
  if (validRequests.length >= config.requests) {
    return false
  }
  
  // Add current request
  validRequests.push(now)
  rateLimit.set(key, validRequests)
  
  return true
}

function sanitizeInput(value) {
  if (typeof value !== 'string') return value
  
  // Remove potentially dangerous characters
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

function validateRequest(request) {
  const contentType = request.headers.get('content-type') || ''
  
  // Block requests with suspicious content types
  const dangerousTypes = [
    'application/x-www-form-urlencoded', // Only if not expected
    'text/html',
    'application/xml'
  ]
  
  // Allow JSON and form data for API endpoints
  if (request.nextUrl.pathname.startsWith('/api/') || 
      request.nextUrl.pathname.includes('login') || 
      request.nextUrl.pathname.includes('criar-conta')) {
    const allowedTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data'
    ]
    
    if (contentType && !allowedTypes.some(type => contentType.includes(type)) && 
        !contentType.includes('text/plain')) {
      return false
    }
  }
  
  return true
}

export function middleware(request) {
  const response = NextResponse.next()
  
  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Check rate limiting
  if (!checkRateLimit(request)) {
    console.warn(`Rate limit exceeded for ${request.ip} on ${request.nextUrl.pathname}`)
    return new NextResponse(
      JSON.stringify({
        error: 'Muitas tentativas. Tente novamente mais tarde.',
        code: 'RATE_LIMIT_EXCEEDED'
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '900', // 15 minutes
          ...securityHeaders
        }
      }
    )
  }
  
  // Validate request
  if (!validateRequest(request)) {
    console.warn(`Suspicious request blocked from ${request.ip}`)
    return new NextResponse(
      JSON.stringify({
        error: 'Pedido inválido',
        code: 'INVALID_REQUEST'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...securityHeaders
        }
      }
    )
  }
  
  // Log security events in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔒 Security check passed for ${request.nextUrl.pathname}`)
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 