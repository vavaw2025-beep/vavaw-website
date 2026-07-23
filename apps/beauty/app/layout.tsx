import type { Metadata } from 'next';
import { getBusinessBySlug } from '@vavaw/brand-config';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { draftMode } from 'next/headers';
import { PreviewBanner } from '@/components/preview-banner';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

const beautyEntry = getBusinessBySlug('beauty');

export const metadata: Metadata = {
  metadataBase: new URL('https://beauty.vavaw.vn'),
  title: beautyEntry?.seo.title || 'VAVAW Beauty & Co',
  description: beautyEntry?.seo.description || 'A dedicated beauty brand experience within the VAVAW ecosystem.',
  keywords: beautyEntry?.seo.keywords,
  alternates: {
    canonical: beautyEntry?.seo.canonicalUrl || 'https://beauty.vavaw.vn',
  },
  openGraph: {
    title: beautyEntry?.seo.title || 'VAVAW Beauty & Co',
    description: beautyEntry?.seo.description || beautyEntry?.description,
    url: beautyEntry?.seo.canonicalUrl || 'https://beauty.vavaw.vn',
    siteName: 'VAVAW Beauty & Co',
    locale: 'vi_VN',
    type: 'website',
    images: beautyEntry?.media.ogImage ? [beautyEntry.media.ogImage] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: beautyEntry?.seo.title || 'VAVAW Beauty & Co',
    description: beautyEntry?.seo.description || beautyEntry?.description,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isPreview = (await draftMode()).isEnabled;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VAVAW Beauty',
    url: 'https://beauty.vavaw.vn',
    logo: 'https://vavaw.vn/icon.svg',
    parentOrganization: {
      '@type': 'Organization',
      name: 'VAVAW Ecosystem',
      url: 'https://vavaw.vn'
    }
  };

  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable} bg-background`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        {isPreview && <PreviewBanner />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
