import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  max: number
  message?: string
  statusCode?: number
}

interface RateLimitStore {
  count: number
  timestamp: number
  blocked?: boolean
  lastViolation?: number
}

// Configuraciones de Rate Limiting por ruta
const rateLimitConfigs: Record<string, RateLimitConfig> = {
  default: {
    windowMs: 60 * 1000, // 1 minuto
    max: 60, // límite de solicitudes por ventana
    message: 'Too Many Requests',
    statusCode: 429,
  },
  '/api': {
    windowMs: 60 * 1000,
    max: 30,
    message: 'API rate limit exceeded',
    statusCode: 429,
  },
  '/auth': {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5,
    message: 'Authentication rate limit exceeded',
    statusCode: 429,
  },
}

// Almacén en memoria para rate limiting
const rateLimitStore = new Map<string, RateLimitStore>()

// Función para limpiar el almacén periódicamente
function cleanupRateLimitStore() {
  const now = Date.now()
  Array.from(rateLimitStore.entries()).forEach(([key, value]) => {
    // Limpiar entradas antiguas
    if (now - value.timestamp > 24 * 60 * 60 * 1000) {
      // 24 horas
      rateLimitStore.delete(key)
    }
    // Desbloquear IPs después de un período
    else if (value.blocked && now - (value.lastViolation || 0) > 60 * 60 * 1000) {
      // 1 hora
      value.blocked = false
      value.count = 0
    }
  })
}

// Limpiar cada hora
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 60 * 60 * 1000)
}

function getRateLimitConfig(path: string): RateLimitConfig {
  // Encontrar la configuración más específica que coincida con la ruta
  const matchingPath = Object.keys(rateLimitConfigs)
    .filter((p) => path.startsWith(p))
    .sort((a, b) => b.length - a.length)[0]

  return rateLimitConfigs[matchingPath] || rateLimitConfigs.default
}

function getClientIdentifier(request: NextRequest): string {
  // Combinar IP con User-Agent para mayor precisión
  const ip = request.ip || 'anonymous'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return `${ip}-${userAgent}`
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  try {
    // Obtener identificador del cliente
    const clientId = getClientIdentifier(request)
    const path = request.nextUrl.pathname
    const config = getRateLimitConfig(path)

    // Rate Limiting
    const now = Date.now()
    const store = rateLimitStore.get(clientId) || { count: 0, timestamp: now }

    // Verificar si el cliente está bloqueado
    if (store.blocked) {
      return new NextResponse(config.message, {
        status: config.statusCode,
        headers: {
          'Retry-After': '3600',
          'Content-Type': 'text/plain',
        },
      })
    }

    // Reiniciar contador si ha pasado la ventana de tiempo
    if (now - store.timestamp > config.windowMs) {
      store.count = 0
      store.timestamp = now
    }

    store.count++

    // Verificar límite de velocidad
    if (store.count > config.max) {
      store.blocked = true
      store.lastViolation = now
      rateLimitStore.set(clientId, store)

      return new NextResponse(config.message, {
        status: config.statusCode,
        headers: {
          'Retry-After': '60',
          'Content-Type': 'text/plain',
          'X-RateLimit-Limit': config.max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': (Math.ceil(now / 1000) + 60).toString(),
        },
      })
    }

    rateLimitStore.set(clientId, store)

    // Headers de Rate Limit
    response.headers.set('X-RateLimit-Limit', config.max.toString())
    response.headers.set('X-RateLimit-Remaining', (config.max - store.count).toString())
    response.headers.set(
      'X-RateLimit-Reset',
      (Math.ceil(store.timestamp / 1000) + config.windowMs / 1000).toString()
    )

    // Headers de Seguridad Adicionales
    const securityHeaders = {
      'X-DNS-Prefetch-Control': 'on',
      'X-Download-Options': 'noopen',
      'X-Permitted-Cross-Domain-Policies': 'none',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Expect-CT': 'max-age=86400, enforce',
    }

    // Aplicar headers de seguridad
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Prevenir clickjacking con excepciones
    if (!request.nextUrl.pathname.startsWith('/iframe-allowed')) {
      response.headers.set('X-Frame-Options', 'DENY')
    }

    // CSP específico por ruta
    if (request.nextUrl.pathname.startsWith('/admin')) {
      response.headers.set(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "connect-src 'self'",
          "frame-ancestors 'none'",
          "form-action 'self'",
          "base-uri 'self'",
          "object-src 'none'",
        ].join('; ')
      )
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
