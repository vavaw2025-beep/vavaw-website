export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  image: string;
  gradient: string;
}

export interface Brand {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  image: string;
  cardImage: string;
  brandName: string;
  tagline: string;
  ctaLabel: string;
  link: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  link: string;
}

// Hero Banner Data
export const heroBanners: HeroBanner[] = [
  {
    id: "essence",
    title: "Essence",
    subtitle: "Redefining luxury through minimalist beauty and timeless elegance",
    cta: "Explore Essence",
    ctaLink: "#",
    image: "/images/hero-luxury-lifestyle.png",
    gradient: "from-slate-900 via-slate-800 to-amber-900",
  },
  {
    id: "nexus",
    title: "Nexus",
    subtitle: "Innovation meets precision in our cutting-edge technology ecosystem",
    cta: "Discover Nexus",
    ctaLink: "#",
    image: "/images/hero-tech-innovation.png",
    gradient: "from-blue-950 via-indigo-900 to-orange-900",
  },
  {
    id: "forge",
    title: "Forge",
    subtitle: "Heritage craftsmanship forged with contemporary excellence",
    cta: "Experience Forge",
    ctaLink: "#",
    image: "/images/hero-heritage-craft.png",
    gradient: "from-amber-950 via-orange-900 to-slate-900",
  },
];

// Brand Carousel Data
export const brands: Brand[] = [
  {
    id: "essence",
    title: "Essence",
    subtitle: "Redefining luxury through minimalist beauty",
    description: "Premium beauty and skincare with timeless elegance and sustainable practices",
    category: "Beauty",
    image: "/images/brand-essence.png",
    cardImage: "/images/brand-essence.png",
    brandName: "Essence",
    tagline: "Pure luxury redefined",
    ctaLabel: "Explore Essence",
    link: "#",
  },
  {
    id: "nexus",
    title: "Nexus",
    subtitle: "Innovation meets precision",
    description: "Advanced technology solutions for enterprise and consumer markets worldwide",
    category: "Technology",
    image: "/images/brand-nexus.png",
    cardImage: "/images/brand-nexus.png",
    brandName: "Nexus",
    tagline: "The future of tech",
    ctaLabel: "Discover Nexus",
    link: "#",
  },
  {
    id: "forge",
    title: "Forge",
    subtitle: "Heritage craftsmanship forged with excellence",
    description: "Artisanal craft and manufacturing with contemporary design sensibilities",
    category: "Craft",
    image: "/images/brand-forge.png",
    cardImage: "/images/brand-forge.png",
    brandName: "Forge",
    tagline: "Craftsmanship evolved",
    ctaLabel: "Experience Forge",
    link: "#",
  },
  {
    id: "aurora",
    title: "Aurora",
    subtitle: "Wellness and lifestyle luxury",
    description: "Transformative wellness experiences and premium lifestyle products",
    category: "Wellness",
    image: "/images/brand-aurora.png",
    cardImage: "/images/brand-aurora.png",
    brandName: "Aurora",
    tagline: "Wellness redefined",
    ctaLabel: "Discover Aurora",
    link: "#",
  },
  {
    id: "lumina",
    title: "Lumina",
    subtitle: "Illuminating possibilities",
    description: "Innovative lighting and smart home solutions for modern living",
    category: "Innovation",
    image: "/images/brand-essence.png",
    cardImage: "/images/brand-essence.png",
    brandName: "Lumina",
    tagline: "Light your world",
    ctaLabel: "Explore Lumina",
    link: "#",
  },
  {
    id: "zenith",
    title: "Zenith",
    subtitle: "Reaching new heights",
    description: "Premium travel and hospitality experiences across the globe",
    category: "Travel",
    image: "/images/brand-nexus.png",
    cardImage: "/images/brand-nexus.png",
    brandName: "Zenith",
    tagline: "Excellence in travel",
    ctaLabel: "Discover Zenith",
    link: "#",
  },
  {
    id: "prism",
    title: "Prism",
    subtitle: "Seeing the world differently",
    description: "Cutting-edge eyewear and visual technology for the discerning customer",
    category: "Fashion",
    image: "/images/brand-forge.png",
    cardImage: "/images/brand-forge.png",
    brandName: "Prism",
    tagline: "Vision perfected",
    ctaLabel: "View Collection",
    link: "#",
  },
];

// News & Highlights Data
export const newsItems: NewsItem[] = [
  {
    id: "news-01",
    title: "Aurora Launches Spring Collection",
    excerpt:
      "Discover the new wellness collection that redefines luxury self-care with innovative formulations and sustainable practices.",
    image: "/images/news-campaign-01.png",
    date: "March 15, 2024",
    category: "Launch",
    link: "#",
  },
  {
    id: "news-02",
    title: "Nexus Unveils Next-Gen Platform",
    excerpt:
      "Our flagship technology platform now features AI-driven personalization and enhanced security protocols for enterprise solutions.",
    image: "/images/news-campaign-02.png",
    date: "March 12, 2024",
    category: "Innovation",
    link: "#",
  },
  {
    id: "news-03",
    title: "Forge x Design Collective Collaboration",
    excerpt:
      "A limited edition partnership bringing together timeless craftsmanship with contemporary artistic vision.",
    image: "/images/news-campaign-03.png",
    date: "March 8, 2024",
    category: "Collaboration",
    link: "#",
  },
];

// Company Info
export const companyInfo = {
  name: "Prestige Holdings",
  tagline: "Crafting Exceptional Experiences Across Industries",
  description:
    "For over two decades, Prestige Holdings has been at the forefront of creating iconic brands that define their categories. We combine heritage craftsmanship with contemporary innovation to deliver exceptional value across beauty, technology, and lifestyle sectors.",
  founded: "2004",
  locations: "Global presence in 45+ countries",
  team: "2,500+ talented professionals",
  mission:
    "To create transformative brand experiences that resonate with discerning audiences worldwide.",
};
