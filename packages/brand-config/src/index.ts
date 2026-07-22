export type BusinessStatus = 'active' | 'coming-soon';
export type NavigationType = 'internal' | 'external-app';

export interface BusinessEntry {
  id: string;
  slug: string;
  name: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  previewImage: string;
  navigationType: NavigationType;
  href: string;
  redirectPath: string;
  status: BusinessStatus;
  ctaLabel: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export const businessEntries: BusinessEntry[] = [
  {
    id: "cosmetic",
    slug: "cosmetic",
    name: "VAVAW Cosmetic",
    category: "Cosmetic",
    title: "VAVAW Cosmetic",
    subtitle: "Premium cosmetic line by VAVAW.",
    description: "A dedicated cosmetic collection under the VAVAW ecosystem.",
    backgroundImage: "/images/cosmetic-bg.jpg",
    previewImage: "/images/cosmetic-preview.jpg",
    navigationType: "internal",
    href: "/cosmetic",
    redirectPath: "/go/cosmetic",
    status: "active",
    ctaLabel: "Explore Cosmetic",
  },
  {
    id: "beauty",
    slug: "beauty",
    name: "VAVAW Beauty & Co",
    category: "Beauty & Care",
    title: "VAVAW Beauty & Co",
    subtitle: "A beauty and care destination by VAVAW.",
    description: "A dedicated beauty brand experience within the VAVAW ecosystem.",
    backgroundImage: "/images/beauty-bg.jpg",
    previewImage: "/images/beauty-preview.jpg",
    navigationType: "external-app",
    href: "https://beauty.vavaw.vn",
    redirectPath: "/go/beauty",
    status: "coming-soon",
    ctaLabel: "Visit Beauty & Co",
  },
  {
    id: "franchise",
    slug: "franchise",
    name: "VAVAW Franchise",
    category: "Franchise",
    title: "VAVAW Franchise",
    subtitle: "Franchise opportunities with VAVAW.",
    description: "Learn about business partnership and franchise opportunities.",
    backgroundImage: "/images/franchise-bg.jpg",
    previewImage: "/images/franchise-preview.jpg",
    navigationType: "external-app",
    href: "https://franchise.vavaw.vn",
    redirectPath: "/go/franchise",
    status: "coming-soon",
    ctaLabel: "Explore Franchise",
  }
];

export function getBusinessBySlug(slug: string): BusinessEntry | undefined {
  return businessEntries.find(entry => entry.slug === slug);
}
