import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@vavaw/brand-config", "@vavaw/db", "@vavaw/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zrgnoeyfnfhatqkkhskf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}




export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG || 'vavaw',
  project: process.env.SENTRY_PROJECT || 'vavaw',
}, {
  widenClientFileUpload: true,
  transpileClientSDK: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
