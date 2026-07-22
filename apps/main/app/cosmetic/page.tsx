import { Metadata } from 'next';
import { getBusinessBySlug } from '@vavaw/brand-config';

const cosmeticEntry = getBusinessBySlug('cosmetic');

export const metadata: Metadata = {
  title: cosmeticEntry?.seo.title || 'VAVAW Cosmetic',
  description: cosmeticEntry?.seo.description || 'A dedicated cosmetic collection under the VAVAW ecosystem.',
  keywords: cosmeticEntry?.seo.keywords,
  alternates: {
    canonical: cosmeticEntry?.seo.canonicalUrl || 'https://vavaw.vn/cosmetic',
  },
  openGraph: {
    title: cosmeticEntry?.seo.title || 'VAVAW Cosmetic',
    description: cosmeticEntry?.seo.description || cosmeticEntry?.description,
    url: cosmeticEntry?.seo.canonicalUrl || 'https://vavaw.vn/cosmetic',
    images: cosmeticEntry?.media.ogImage ? [cosmeticEntry.media.ogImage] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: cosmeticEntry?.seo.title || 'VAVAW Cosmetic',
    description: cosmeticEntry?.seo.description || cosmeticEntry?.description,
  },
};

export default function CosmeticPage() {
  return (
    <div style={{ padding: '4rem', fontFamily: 'sans-serif' }}>
      <h1>{cosmeticEntry?.name || 'VAVAW Cosmetic'}</h1>
      <p>{cosmeticEntry?.description}</p>
      <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>Back to Homepage</a>
    </div>
  );
}
