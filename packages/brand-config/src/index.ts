export type NavigationType = "internal" | "external-app";

export type BusinessStatus = "active" | "coming-soon" | "draft";

export type BusinessTheme = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
};

export type BusinessMedia = {
  backgroundImage: string;
  previewImage: string;
  ogImage: string;
  introVideo?: string;
  cosmeticProductEditorial?: string;
  cosmeticTextureRitual?: string;
  cosmeticCleanPromise?: string;
};

export type BusinessSeo = {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
};

export type BusinessEntry = {
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
  seo: BusinessSeo;
};

export const businessEntries: BusinessEntry[] = [
  {
    id: "cosmetic",
    slug: "cosmetic",
    name: "VAVAW Cosmetic",
    category: "Cosmetic",
    title: "VAVAW Cosmetic",
    subtitle: "A refined ritual of beauty.",
    description:
      "Curated formulations and sophisticated palettes designed to elevate your daily routine.",
    navigationType: "internal",
    href: "/cosmetic",
    redirectPath: "/go/cosmetic",
    status: "active",
    sortOrder: 1,
    ctaLabel: "Explore Cosmetic",
    theme: {
      primary: "#050A5C",
      secondary: "#101A8C",
      background: "#FFFFFF",
      text: "#1F2933",
      accent: "#EEF1F6",
    },
    media: {
      backgroundImage: "/PASTE_ACTUAL_PUBLIC_URL",
      previewImage: "/PASTE_ACTUAL_PUBLIC_URL",
      ogImage: "/PASTE_ACTUAL_PUBLIC_URL",
      cosmeticProductEditorial: "/PASTE_ACTUAL_PUBLIC_URL",
      cosmeticTextureRitual: "/PASTE_ACTUAL_PUBLIC_URL",
      cosmeticCleanPromise: "/PASTE_ACTUAL_PUBLIC_URL",
    },
    seo: {
      title: "VAVAW Cosmetic - Premium Beauty Line",
      description: "Discover the VAVAW Cosmetic collection.",
      keywords: ["vavaw", "cosmetic", "beauty", "skincare", "premium"],
      canonicalUrl: "https://vavaw.vn/cosmetic",
    },
  },
  {
    id: "beauty",
    slug: "beauty",
    name: "VAVAW Beauty & Co",
    category: "Beauty & Care",
    title: "VAVAW Beauty & Co",
    subtitle: "Sanctuary for skin and self.",
    description:
      "A holistic destination for advanced care, combining modern techniques with timeless wellness principles.",
    navigationType: "external-app",
    href: process.env.NEXT_PUBLIC_BEAUTY_URL || "https://beauty.vavaw.vn",
    redirectPath: "/go/beauty",
    status: "coming-soon",
    sortOrder: 2,
    ctaLabel: "Visit Beauty & Co",
    theme: {
      primary: "#0284c7",
      secondary: "#0369a1",
      background: "#020617",
      text: "#ffffff",
      accent: "#38bdf8",
    },
    media: {
      backgroundImage: "/PASTE_ACTUAL_PUBLIC_URL",
      previewImage: "/PASTE_ACTUAL_PUBLIC_URL",
      ogImage: "/PASTE_ACTUAL_PUBLIC_URL",
    },
    seo: {
      title: "VAVAW Beauty & Co",
      description: "Beauty and care destination.",
      keywords: ["vavaw", "beauty", "care", "skincare"],
      canonicalUrl: "https://beauty.vavaw.vn",
    },
  },
  {
    id: "franchise",
    slug: "franchise",
    name: "VAVAW Franchise",
    category: "Franchise",
    title: "VAVAW Franchise",
    subtitle: "Partnership in premium growth.",
    description:
      "Strategic business opportunities within the expanding VAVAW ecosystem.",
    navigationType: "external-app",
    href: process.env.NEXT_PUBLIC_FRANCHISE_URL || "https://franchise.vavaw.vn",
    redirectPath: "/go/franchise",
    status: "coming-soon",
    sortOrder: 3,
    ctaLabel: "Explore Franchise",
    theme: {
      primary: "#d97706",
      secondary: "#b45309",
      background: "#0c0a09",
      text: "#ffffff",
      accent: "#fbbf24",
    },
    media: {
      backgroundImage: "/PASTE_ACTUAL_PUBLIC_URL",
      previewImage: "/PASTE_ACTUAL_PUBLIC_URL",
      ogImage: "/PASTE_ACTUAL_PUBLIC_URL",
    },
    seo: {
      title: "VAVAW Franchise",
      description: "Franchise opportunities with VAVAW.",
      keywords: ["vavaw", "franchise", "business", "partnership"],
      canonicalUrl: "https://franchise.vavaw.vn",
    },
  },
];

export function getBusinessBySlug(slug: string): BusinessEntry | undefined {
  return businessEntries.find((entry) => entry.slug === slug);
}

export function getSortedBusinessEntries(): BusinessEntry[] {
  return [...businessEntries].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getActiveBusinessEntries(): BusinessEntry[] {
  return businessEntries.filter((entry) => entry.status === "active");
}

export function getComingSoonBusinessEntries(): BusinessEntry[] {
  return businessEntries.filter((entry) => entry.status === "coming-soon");
}

export function getExternalBusinessEntries(): BusinessEntry[] {
  return businessEntries.filter(
    (entry) => entry.navigationType === "external-app"
  );
}

export function getInternalBusinessEntries(): BusinessEntry[] {
  return businessEntries.filter(
    (entry) => entry.navigationType === "internal"
  );
}

export function getBusinessMedia(slug: string): BusinessMedia | undefined {
  return getBusinessBySlug(slug)?.media;
}

export function getBusinessSeo(slug: string): BusinessSeo | undefined {
  return getBusinessBySlug(slug)?.seo;
}
