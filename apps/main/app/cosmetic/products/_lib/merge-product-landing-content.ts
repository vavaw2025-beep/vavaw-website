import { ProductLandingContent } from '../_components/product-landing-types';

/**
 * Merges a CMS content block payload with a static fallback.
 * Ensures all fields are safely populated, arrays are guaranteed,
 * and handles legacy CMS key names.
 */
export function mergeProductLandingContent(
  fallback: ProductLandingContent,
  cmsContent?: unknown
): ProductLandingContent {
  const block = (cmsContent || {}) as any;

  // Scalar fields with fallback support
  const eyebrow = block.eyebrow || fallback.eyebrow;
  const title = block.title || fallback.title;
  const headline = block.headline || fallback.headline;
  const description = block.description || fallback.description;
  const ctaLabel = block.primaryCtaLabel || block.ctaLabel || fallback.ctaLabel;
  const ctaHref = block.primaryCtaHref || block.ctaHref || fallback.ctaHref;
  const secondaryCtaLabel = block.secondaryCtaLabel || fallback.secondaryCtaLabel;
  const secondaryCtaHref = block.secondaryCtaHref || fallback.secondaryCtaHref;
  const heroMediaSlot = block.heroMediaSlot || fallback.heroMediaSlot;

  // Array: insideSet / setProducts
  const insideSetRaw = block.insideSet || block.setProducts;
  const insideSet = Array.isArray(insideSetRaw) && insideSetRaw.length > 0
    ? insideSetRaw.map((p: any) => ({
        name: p.name || '',
        size: p.size || '',
        role: p.role || '',
        description: p.description || '',
        mediaSlot: p.mediaSlot || ''
      }))
    : fallback.insideSet;

  // Array: recoveryLogic / recoverySteps
  const recoveryStepsRaw = block.recoverySteps || block.recoveryLogic;
  const recoveryLogic = Array.isArray(recoveryStepsRaw) && recoveryStepsRaw.length > 0
    ? recoveryStepsRaw.map((step: any, idx: number) => ({
        step: step.step || `0${idx + 1}`,
        title: step.title || '',
        description: step.description || ''
      }))
    : fallback.recoveryLogic;

  // Array: activeTech / technologies
  const techRaw = block.technologies || block.activeTech;
  const activeTech = Array.isArray(techRaw) && techRaw.length > 0
    ? techRaw.map((t: any) => ({
        name: t.name || '',
        role: t.role || '',
        description: t.description || '',
        product: t.foundIn || t.product || ''
      }))
    : fallback.activeTech;

  // Array: whoItsFor / whoFor
  const whoForRaw = block.whoFor || block.whoItsFor;
  const whoItsFor = Array.isArray(whoForRaw) && whoForRaw.length > 0
    ? whoForRaw.map((item: any) => typeof item === 'string' ? item : (item.text || ''))
    : fallback.whoItsFor;

  // Array: howToUse
  let howToUse = fallback.howToUse;
  if (Array.isArray(block.howToUse) && block.howToUse.length > 0) {
    howToUse = block.howToUse.map((item: any, idx: number) => {
      if (typeof item === 'string') {
        return { step: `0${idx + 1}`, title: item, description: '' };
      }
      return {
        step: item.step || `0${idx + 1}`,
        title: item.title || item.text || '',
        description: item.description || ''
      };
    });
  }

  // Object: spaBridge
  const spaBridgeRaw = (block.spaBridge || {}) as any;
  const spaBridge = {
    title: spaBridgeRaw.title || block.spaBridgeTitle || fallback.spaBridge.title,
    description: spaBridgeRaw.description || block.spaBridgeDescription || fallback.spaBridge.description,
    ctaLabel: spaBridgeRaw.ctaLabel || block.spaBridgeCtaLabel || fallback.spaBridge.ctaLabel,
    ctaHref: spaBridgeRaw.ctaHref || block.spaBridgeCtaHref || fallback.spaBridge.ctaHref,
  };

  // Array: productInfo
  const productInfoRaw = block.productInfo;
  const productInfo = Array.isArray(productInfoRaw) && productInfoRaw.length > 0
    ? productInfoRaw.map((info: any) => ({
        label: info.label || '',
        value: info.value || ''
      }))
    : fallback.productInfo;

  // Object: finalCta
  const finalCtaRaw = (block.finalCta || {}) as any;
  const finalCta = {
    title: finalCtaRaw.title || block.finalTitle || fallback.finalCta.title,
    description: finalCtaRaw.description || block.finalDescription || fallback.finalCta.description,
    ctaLabel: finalCtaRaw.ctaLabel || block.finalCtaLabel || fallback.finalCta.ctaLabel,
    ctaHref: finalCtaRaw.ctaHref || block.finalCtaHref || fallback.finalCta.ctaHref,
  };

  // Luminous Set custom blocks
  const antiGravity = block.antiGravity || fallback.antiGravity;
  const whoNeedsSet = block.whoNeedsSet || fallback.whoNeedsSet;
  const barrierScience = block.barrierScience || fallback.barrierScience;
  const activeIngredients = block.activeIngredients || fallback.activeIngredients;
  const usageGuide = block.usageGuide || fallback.usageGuide;
  const productDetailForm = block.productDetailForm || fallback.productDetailForm;

  return {
    eyebrow,
    title,
    headline,
    description,
    ctaLabel,
    ctaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
    heroMediaSlot,
    insideSet,
    recoveryLogic,
    activeTech,
    whoItsFor,
    howToUse,
    spaBridge,
    productInfo,
    finalCta,
    antiGravity,
    whoNeedsSet,
    barrierScience,
    activeIngredients,
    usageGuide,
    productDetailForm
  };
}
