export type NavigationType = 'internal' | 'external-app';
export type BusinessStatus = 'active' | 'coming-soon';

export interface BusinessTheme {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  mode?: 'dark' | 'light';
}

export interface BusinessMedia {
  backgroundImage: string;
  previewImage: string;
  logo?: string;
  cardImage?: string;
}

export interface BusinessSeo {
  title?: string;
  description?: string;
  ogImage?: string;
}

export interface BusinessEntry {
  id: string;
  slug: string;
  name: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  navigationType: NavigationType;
  href: string;
  redirectPath: string;
  status: BusinessStatus;
  sortOrder: number;
  ctaLabel: string;
  theme: BusinessTheme;
  media: BusinessMedia;
  seo?: BusinessSeo;
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
    navigationType: "internal",
    href: "/cosmetic",
    redirectPath: "/go/cosmetic",
    status: "active",
    sortOrder: 1,
    ctaLabel: "Explore Cosmetic",
    theme: {
      primaryColor: "#e11d48",
      mode: "dark",
    },
    media: {
      backgroundImage: "/images/cosmetic-bg.jpg",
      previewImage: "/images/cosmetic-preview.jpg",
    },
    seo: {
      title: "VAVAW Cosmetic - Premium Beauty Line",
      description: "Discover the VAVAW Cosmetic collection.",
    },
  },
  {
    id: "beauty",
    slug: "beauty",
    name: "VAVAW Beauty & Co",
    category: "Beauty & Care",
    title: "VAVAW Beauty & Co",
    subtitle: "A beauty and care destination by VAVAW.",
    description: "A dedicated beauty brand experience within the VAVAW ecosystem.",
    navigationType: "external-app",
    href: "https://beauty.vavaw.vn",
    redirectPath: "/go/beauty",
    status: "coming-soon",
    sortOrder: 2,
    ctaLabel: "Visit Beauty & Co",
    theme: {
      primaryColor: "#0284c7",
      mode: "dark",
    },
    media: {
      backgroundImage: "/images/beauty-bg.jpg",
      previewImage: "/images/beauty-preview.jpg",
    },
    seo: {
      title: "VAVAW Beauty & Co",
      description: "Beauty and care destination.",
    },
  },
  {
    id: "franchise",
    slug: "franchise",
    name: "VAVAW Franchise",
    category: "Franchise",
    title: "VAVAW Franchise",
    subtitle: "Franchise opportunities with VAVAW.",
    description: "Learn about business partnership and franchise opportunities.",
    navigationType: "external-app",
    href: "https://franchise.vavaw.vn",
    redirectPath: "/go/franchise",
    status: "coming-soon",
    sortOrder: 3,
    ctaLabel: "Explore Franchise",
    theme: {
      primaryColor: "#d97706",
      mode: "dark",
    },
    media: {
      backgroundImage: "/images/franchise-bg.jpg",
      previewImage: "/images/franchise-preview.jpg",
    },
    seo: {
      title: "VAVAW Franchise",
      description: "Franchise opportunities with VAVAW.",
    },
  },
];

export function getBusinessBySlug(slug: string): BusinessEntry | undefined {
  return businessEntries.find((entry) => entry.slug === slug);
}

export function getActiveBusinessEntries(): BusinessEntry[] {
  return businessEntries.filter((entry) => entry.status === 'active');
}

export function getExternalBusinessEntries(): BusinessEntry[] {
  return businessEntries.filter((entry) => entry.navigationType === 'external-app');
}

export function getInternalBusinessEntries(): BusinessEntry[] {
  return businessEntries.filter((entry) => entry.navigationType === 'internal');
}

export function getSortedBusinessEntries(): BusinessEntry[] {
  return [...businessEntries].sort((a, b) => a.sortOrder - b.sortOrder);
}
