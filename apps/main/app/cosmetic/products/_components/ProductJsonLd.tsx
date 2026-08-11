import { ProductLandingContent } from './product-landing-types';

interface ProductJsonLdProps {
  content: ProductLandingContent;
  canonicalPath: string;
  cosmeticMedia: any;
}

export function ProductJsonLd({ content, canonicalPath, cosmeticMedia }: ProductJsonLdProps) {
  // 1. Canonical URL safety
  const getSafeBaseUrl = () => {
    let base = process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn';
    // strip trailing slash
    base = base.replace(/\/$/, '');
    
    // safe fallback if missing or dangerous
    if (!base || base.includes('localhost') || base.includes('vercel.app')) {
      return 'https://vavaw.vn';
    }
    return base;
  };

  const safeBaseUrl = getSafeBaseUrl();
  const canonicalUrl = `\${safeBaseUrl}\${canonicalPath}`;

  // 2. Product image safety
  const resolveProductImage = (): string | undefined => {
    const srcUrl = cosmeticMedia[content.heroMediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.luminousSet;
    if (!srcUrl || !srcUrl.trim() || srcUrl.includes('PASTE_')) {
      return undefined;
    }
    const cleanUrl = srcUrl.trim();
    if (cleanUrl.startsWith('http')) {
      return cleanUrl;
    }
    if (cleanUrl.startsWith('/')) {
      return `\${safeBaseUrl}\${cleanUrl}`;
    }
    return `\${safeBaseUrl}/\${cleanUrl}`;
  };

  const productImageUrl = resolveProductImage();

  // 3. JSON-LD output structure
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `\${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: content.title,
        description: content.description,
        isPartOf: {
          '@type': 'WebSite',
          name: 'VAVAW',
          url: safeBaseUrl
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: safeBaseUrl
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'VAVAW Cosmetic',
            item: `\${safeBaseUrl}/cosmetic`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: content.title,
            item: canonicalUrl
          }
        ]
      },
      {
        '@type': 'Product',
        '@id': `\${canonicalUrl}#product`,
        name: content.title,
        description: content.description,
        brand: {
          '@type': 'Brand',
          name: 'VAVAW Cosmetic'
        },
        category: 'Cosmetic',
        url: canonicalUrl,
        ...(productImageUrl ? { image: productImageUrl } : {})
      },
      {
        '@type': 'Brand',
        name: 'VAVAW Cosmetic',
        url: `\${safeBaseUrl}/cosmetic`
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
