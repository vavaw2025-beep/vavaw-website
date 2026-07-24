import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://vavaw.vn'),
  title: {
    default: 'VAVAW | Brand Ecosystem',
    template: '%s | VAVAW'
  },
  description: 'VAVAW is a premium multi-brand ecosystem spanning cosmetics, beauty & care, and franchise opportunities.',
  openGraph: {
    title: 'VAVAW | Brand Ecosystem',
    description: 'VAVAW is a premium multi-brand ecosystem spanning cosmetics, beauty & care, and franchise opportunities.',
    url: 'https://vavaw.vn',
    siteName: 'VAVAW Ecosystem',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VAVAW | Brand Ecosystem',
    description: 'VAVAW is a premium multi-brand ecosystem spanning cosmetics, beauty & care, and franchise opportunities.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9f7f4' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f10' },
  ],
}

import { draftMode } from 'next/headers'
import { PreviewBanner } from '@/components/preview-banner'
import { SiteHeader } from '@/components/site-header'
import { loadPublicBrandAssets } from '@/lib/load-public-brand-assets'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isPreview = (await draftMode()).isEnabled;
  const brandAssets = await loadPublicBrandAssets('main');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VAVAW Ecosystem',
    url: 'https://vavaw.vn',
    logo: 'https://vavaw.vn/icon.svg',
    sameAs: [
      'https://beauty.vavaw.vn',
      'https://franchise.vavaw.vn'
    ]
  };

  return (
    <html lang="vi" className="bg-background" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        {isPreview && <PreviewBanner />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader logoUrl={brandAssets.logoMainWhite} />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
