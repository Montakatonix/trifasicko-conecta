import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Eliminar las cabeceras CSP existentes para evitar duplicados
  response.headers.delete('Content-Security-Policy')

  // Agregar las nuevas cabeceras CSP
  response.headers.set(
    'Content-Security-Policy',
    `
      default-src 'self' https: http:;
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:;
      style-src 'self' 'unsafe-inline' https: http:;
      img-src 'self' data: blob: https: http:;
      font-src 'self' data: https: http:;
      connect-src 'self' https: http: wss: ws:;
      frame-src 'self' https: http:;
      media-src 'self' https: http:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()
  )

  return response
}

export const config = {
  matcher: '/:path*',
} 