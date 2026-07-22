import { Metadata } from 'next';
import { getBusinessBySlug } from '@vavaw/brand-config';

const cosmeticEntry = getBusinessBySlug('cosmetic');

export const metadata: Metadata = {
  title: cosmeticEntry?.seo?.title || 'VAVAW Cosmetic',
  description: cosmeticEntry?.seo?.description || cosmeticEntry?.description || 'A dedicated cosmetic collection under the VAVAW ecosystem.',
  openGraph: {
    title: cosmeticEntry?.seo?.title || 'VAVAW Cosmetic',
    description: cosmeticEntry?.seo?.description || cosmeticEntry?.description,
    url: 'https://vavaw.vn/cosmetic',
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
