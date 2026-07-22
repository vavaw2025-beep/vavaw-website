import type { Metadata } from 'next';
import { getBusinessBySlug } from '@vavaw/brand-config';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
