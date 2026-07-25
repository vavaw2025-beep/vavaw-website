import { loadPublicHomeCms } from './load-public-cms';

export interface PublicHeroMedia {
  title: string;
  subtitle: string;
  description: string;
  backgroundImageUrl: string | null;
  previewImageUrl: string | null;
  accent: string | null;
  source: 'static' | 'supabase';
}

export async function loadPublicHeroMedia(brandKeyword: string, isPreview: boolean = false): Promise<PublicHeroMedia | null> {
  try {
    const cmsData = await loadPublicHomeCms(isPreview);
    
    // Find the slide that matches the brand keyword
    const slide = cmsData.heroSlides.find(s => 
      (s.title || '').toLowerCase().includes(brandKeyword.toLowerCase()) ||
      (s.redirectPath || '').toLowerCase().includes(brandKeyword.toLowerCase())
    );

    if (!slide) return null;

    return {
      title: slide.title,
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      backgroundImageUrl: slide.backgroundImageUrl || null,
      previewImageUrl: slide.previewImageUrl || null,
      accent: null, // loadPublicHomeCms does not return accent currently
      source: cmsData.source
    };
  } catch (error) {
    console.error(`[load-public-hero-media] Error fetching for ${brandKeyword}:`, error);
    return null;
  }
}
