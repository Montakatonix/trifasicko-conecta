import { withContentlayer } from 'next-contentlayer'
import withBundleAnalyzer from '@next/bundle-analyzer'

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

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
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones de webpack aquí
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })
    }
    return config
  },
}

export default withAnalyzer(nextConfig) 