import type { Metadata } from 'next';
import { getBusinessBySlug } from '@vavaw/brand-config';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

const franchiseEntry = getBusinessBySlug('franchise');

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRANCHISE_URL || 'https://franchise.vavaw.vn'),
  title: franchiseEntry?.seo.title || 'VAVAW Franchise | Korean Beauty Business Opportunity',
  description: franchiseEntry?.seo.description || 'Learn about business partnership and franchise opportunities with VAVAW.',
  keywords: franchiseEntry?.seo.keywords,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: franchiseEntry?.seo.title || 'VAVAW Franchise | Korean Beauty Business Opportunity',
    description: franchiseEntry?.seo.description || franchiseEntry?.description,
    url: '/',
    siteName: 'VAVAW Franchise',
    locale: 'vi_VN',
    type: 'website',
    images: franchiseEntry?.media.ogImage ? [franchiseEntry.media.ogImage] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: franchiseEntry?.seo.title || 'VAVAW Franchise | Korean Beauty Business Opportunity',
    description: franchiseEntry?.seo.description || franchiseEntry?.description,
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
};

import { draftMode } from 'next/headers';
import { PreviewBanner } from '@/components/preview-banner';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isPreview = (await draftMode()).isEnabled;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VAVAW Franchise',
    url: 'https://franchise.vavaw.vn',
    logo: 'https://vavaw.vn/icon.svg',
    parentOrganization: {
      '@type': 'Organization',
      name: 'VAVAW Ecosystem',
      url: 'https://vavaw.vn'
    }
  };

  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-[#FAFAFA] text-[#111111] min-h-screen flex flex-col">
        {isPreview && <PreviewBanner />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
