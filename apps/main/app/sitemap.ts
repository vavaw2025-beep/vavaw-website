import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn';
  const products = [
    'luminous-revitalization-sheer-set',
    'cellurevive-ampoule',
    'regenaglow-nourish-sheer-cream',
    'calmiance-superior-sheer-gel',
    'p30-boost-facial-hydrating-toner',
    'gentle-activation-renew-ampoule',
    'p30-boost-facial-moisturizer',
    'lumiglow-rosy-sheer-sunscreen'
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cosmetic`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...products.map((product) => ({
      url: `${baseUrl}/cosmetic/products/${product}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
