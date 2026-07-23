import type { Metadata } from 'next';
import { getBusinessBySlug } from '@vavaw/brand-config';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

const franchiseEntry = getBusinessBySlug('franchise');

export const metadata: Metadata = {
  metadataBase: new URL('https://franchise.vavaw.vn'),
  title: franchiseEntry?.seo.title || 'VAVAW Franchise',
  description: franchiseEntry?.seo.description || 'Learn about business partnership and franchise opportunities with VAVAW.',
  keywords: franchiseEntry?.seo.keywords,
  alternates: {
    canonical: franchiseEntry?.seo.canonicalUrl || 'https://franchise.vavaw.vn',
  },
  openGraph: {
    title: franchiseEntry?.seo.title || 'VAVAW Franchise',
    description: franchiseEntry?.seo.description || franchiseEntry?.description,
    url: franchiseEntry?.seo.canonicalUrl || 'https://franchise.vavaw.vn',
    siteName: 'VAVAW Franchise',
    locale: 'vi_VN',
    type: 'website',
    images: franchiseEntry?.media.ogImage ? [franchiseEntry.media.ogImage] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: franchiseEntry?.seo.title || 'VAVAW Franchise',
    description: franchiseEntry?.seo.description || franchiseEntry?.description,
  },
};

import { draftMode } from 'next/headers';
import { PreviewBanner } from '@/components/preview-banner';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isPreview = (await draftMode()).isEnabled;

  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-[#FAFAFA] text-[#111111] min-h-screen flex flex-col">
        {isPreview && <PreviewBanner />}
        {children}
      </body>
    </html>
  );
}
