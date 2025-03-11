/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: process.env.NODE_ENV === 'development',
    minimumCacheTTL: 60,
  },
  experimental: {
    serverActions: true,
    optimizePackageImports: ['@/components/ui'],
  },
  // Optimizaciones para Vercel
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'standalone',
  // Configuración de caché y optimización
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default nextConfig 