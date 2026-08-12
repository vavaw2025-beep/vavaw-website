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

export interface LuminousWhoNeedsItem {
  text: string;
  description?: string;
  highlight?: boolean;
}

export interface LuminousSciencePanel {
  showDescription?: boolean;
  showCaption?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  caption?: string;
  mediaSlot?: string;
  desktopMediaSlot?: string;
  mobileMediaSlot?: string;
  mediaRenderType?: "full-bleed-artwork" | "diagram" | "photo";
  desktopImageMode?: "cover" | "contain-blur";
  mobileImageMode?: "cover" | "contain-blur" | "contain";
  desktopObjectPosition?: string;
  mobileObjectPosition?: string;
}

export interface LuminousSkinBarrierMg3Plus {
  skinBarrier?: LuminousSciencePanel;
  mg3Plus?: LuminousSciencePanel;
}

export interface LuminousWhoNeedsSheerSet {
  showNote?: boolean;
  showDescription?: boolean;
  showImageCaption?: boolean;
  eyebrow?: string;
  title?: string;
  note?: string;
  description?: string;
  imageCaption?: string;
  mediaSlot?: string;
  desktopMediaSlot?: string;
  mobileMediaSlot?: string;
  desktopImageMode?: "cover" | "contain-blur";
  desktopObjectPosition?: string;
  mobileObjectPosition?: string;
  items?: LuminousWhoNeedsItem[];
}

export interface LuminousActiveIngredientItem {
  name: string;
  englishName?: string;
  role?: string;
  description?: string;
  benefit?: string;
  highlight?: boolean;
  iconType?: 'exosome' | 'collagen' | 'berry' | 'peptide' | 'hyaluronic' | 'custom';
}

export interface LuminousActiveIngredientsMap {
  eyebrow?: string;
  title?: string;
  description?: string;
  caption?: string;
  showDescription?: boolean;
  showCaption?: boolean;
  mediaSlot?: string;
  desktopMediaSlot?: string;
  mobileMediaSlot?: string;
  mediaRenderType?: 'full-bleed-artwork' | 'diagram' | 'photo';
  desktopImageMode?: 'cover' | 'contain-blur';
  mobileImageMode?: 'cover' | 'contain-blur';
  desktopObjectPosition?: string;
  mobileObjectPosition?: string;
  items?: LuminousActiveIngredientItem[];
  enableMotion?: boolean;
  motionStyle?: 'elegant-science' | 'clinical-diagram' | 'editorial-luxury';
  autoRotateIngredients?: boolean;
  showIngredientIcons?: boolean;
  highlightActiveIngredient?: boolean;
}

export interface LuminousUsageStep {
  step: string
  title: string
  description?: string
  product?: string
  timing?: string
  highlight?: boolean
}

export interface LuminousUsageGuide {
  eyebrow?: string
  title?: string
  description?: string
  note?: string
  caption?: string
  showDescription?: boolean
  showNote?: boolean
  showCaption?: boolean
  setMediaSlot?: string
  instructionMediaSlot?: string
  desktopMediaSlot?: string
  mobileMediaSlot?: string
  mediaRenderType?: 'full-bleed-artwork' | 'diagram' | 'photo'
  desktopImageMode?: 'cover' | 'contain-blur'
  mobileImageMode?: 'cover' | 'contain-blur'
  desktopObjectPosition?: string
  mobileObjectPosition?: string
  steps?: LuminousUsageStep[]
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
  whoNeedsSheerSet?: LuminousWhoNeedsSheerSet;
  skinBarrierMg3Plus?: LuminousSkinBarrierMg3Plus;
  activeIngredientsMap?: LuminousActiveIngredientsMap;
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
  skinBarrier?: {
    showDescription?: boolean;
    showCaption?: boolean;
    eyebrow?: string;
    title?: string;
    description?: string;
    caption?: string;
    mediaSlot?: string;
    desktopMediaSlot?: string;
    mobileMediaSlot?: string;
    desktopImageMode?: "cover" | "contain-blur";
  };
  mg3Plus?: {
    showDescription?: boolean;
    showCaption?: boolean;
    eyebrow?: string;
    title?: string;
    description?: string;
    caption?: string;
    mediaSlot?: string;
    desktopMediaSlot?: string;
    mobileMediaSlot?: string;
    desktopImageMode?: "cover" | "contain-blur";
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
  usageGuide?: LuminousUsageGuide;
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
