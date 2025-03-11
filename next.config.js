/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        undici: false,
        fetch: false,
      }

      // Excluir undici del bundle del cliente
      config.module.rules.push({
        test: /node_modules\/undici/,
        loader: 'ignore-loader',
      })
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['undici'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseio.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://*.googleapis.com https://*.gstatic.com https://*.firebasestorage.googleapis.com",
              "connect-src 'self' https://*.firebase.googleapis.com https://*.firebaseio.com https://*.firebasestorage.googleapis.com",
              "frame-src 'self' https://*.firebaseapp.com",
              "media-src 'self' https://*.firebasestorage.googleapis.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
