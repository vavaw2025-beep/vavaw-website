export interface ProductLandingInsideSetItem {
  name: string;
  size: string;
  role: string;
  description: string;
  mediaSlot: string;
}

export interface ProductLandingRecoveryStep {
  step: string;
  title: string;
  description: string;
}

export interface ProductLandingTechnology {
  name: string;
  role: string;
  description: string;
  product: string; // The product it's found in, or "Cả hai sản phẩm"
}

export interface ProductLandingInfoItem {
  label: string;
  value: string;
}

export interface ProductLandingSpaBridge {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ProductLandingCta {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ProductLandingContent {
  eyebrow: string;
  title: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  heroMediaSlot: string;
  heroDesktopMediaSlot?: string;
  heroMobileMediaSlot?: string;
  heroMediaDesktop?: string;
  heroMediaMobile?: string;
  
  antiGravity?: {
    eyebrow?: string;
    title?: string;
    showHeadline?: boolean;
    headline?: string;
    showDescription?: boolean;
    description?: string;
    mediaSlot?: string;
    desktopMediaSlot?: string;
    mobileMediaSlot?: string;
    desktopObjectPosition?: string;
    mobileObjectPosition?: string;
    desktopImageMode?: "cover" | "contain-blur";
    mobileImageMode?: "cover" | "contain";
    caption?: string;
    callouts?: Array<{
      label?: string;
      value?: string;
      description?: string;
      x?: number;
      y?: number;
      align?: string;
    }>;
  };
  whoNeedsSet?: {
    eyebrow?: string;
    title?: string;
    note?: string;
    description?: string;
    mediaSlot?: string;
    imageCaption?: string;
    items?: Array<{
      text?: string;
    }>;
  };
  barrierScience?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    mediaSlot?: string;
    mg3Eyebrow?: string;
    mg3Title?: string;
    mg3Description?: string;
    mg3MediaSlot?: string;
  };
  activeIngredients?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    mediaSlot?: string;
    ingredients?: Array<{
      name?: string;
      subtitle?: string;
      description?: string;
    }>;
  };
  usageGuide?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    mediaSlot?: string;
    instructionMediaSlot?: string;
    note?: string;
    steps?: Array<{
      step?: string;
      title?: string;
      description?: string;
    }>;
  };
  productDetailForm?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    offlineTitle?: string;
    offlineDescription?: string;
    offlineMediaSlot?: string;
    info?: Array<{
      label?: string;
      value?: string;
    }>;
    ingredientGroups?: Array<{
      title?: string;
      subtitle?: string;
      ingredients?: string;
    }>;
    cautions?: string[];
    storage?: string;
    qualityGuarantee?: string;
  };
  insideSet: ProductLandingInsideSetItem[];
  recoveryLogic: ProductLandingRecoveryStep[];
  activeTech: ProductLandingTechnology[];
  whoItsFor: string[];
  howToUse: ProductLandingRecoveryStep[]; // Reuse step/title/desc structure
  
  spaBridge: ProductLandingSpaBridge;
  productInfo: ProductLandingInfoItem[];
  finalCta: ProductLandingCta;
}
