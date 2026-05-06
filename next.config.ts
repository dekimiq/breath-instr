import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  typedRoutes: true,
  staticPageGenerationTimeout: 1000,
  experimental: {},
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
