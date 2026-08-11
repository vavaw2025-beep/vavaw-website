
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn'),
  title: {
    default: 'VAVAW | Korean Beauty, Cosmetic & Franchise Ecosystem',
    template: '%s | VAVAW'
  },
  description: 'VAVAW is a premium Korean beauty ecosystem connecting cosmetic rituals, spa experiences, and franchise growth.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'VAVAW | Korean Beauty, Cosmetic & Franchise Ecosystem',
    description: 'VAVAW is a premium Korean beauty ecosystem connecting cosmetic rituals, spa experiences, and franchise growth.',
    url: '/',
    siteName: 'VAVAW Ecosystem',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VAVAW | Korean Beauty, Cosmetic & Franchise Ecosystem',
    description: 'VAVAW is a premium Korean beauty ecosystem connecting cosmetic rituals, spa experiences, and franchise growth.',
  },
  icons: {
    // TODO: Ensure favicon.ico and icon assets are manually uploaded to public/
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
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
import { Cormorant_Garamond, Inter } from 'next/font/google'

const cosmeticSerif = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-cosmetic-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const cosmeticSans = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-cosmetic-sans',
  display: 'swap',
})

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
    <html lang="vi" className={`bg-background ${cosmeticSerif.variable} ${cosmeticSans.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        {isPreview && <PreviewBanner />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader 
          logoUrl={brandAssets.logoMainWhite} 
          logoDarkUrl={brandAssets.logoMainDark || brandAssets.logoMainBlue || brandAssets.logoCosmeticBlue} 
        />
        {children}
      </body>
    </html>
  )
}
