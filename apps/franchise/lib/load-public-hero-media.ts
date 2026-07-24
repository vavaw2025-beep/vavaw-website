import { createClient } from '@supabase/supabase-js';

export interface PublicHeroMedia {
  title: string;
  subtitle: string;
  description: string;
  backgroundImageUrl: string | null;
  previewImageUrl: string | null;
  accent: string | null;
  source: 'supabase';
}

export async function loadPublicHeroMedia(brandKeyword: string): Promise<PublicHeroMedia | null> {
  const dataSource = process.env.CMS_DATA_SOURCE || 'static';
  if (dataSource !== 'supabase') return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get active slide matching the brand keyword
    const { data: slides, error: slideError } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .ilike('title', `%${brandKeyword}%`)
      .limit(1);

    if (slideError || !slides || slides.length === 0) return null;

    const slide = slides[0];

    let backgroundImageUrl = null;
    let previewImageUrl = null;

    if (slide.background_media_id) {
      const { data: bgMedia } = await supabase
        .from('media_assets')
        .select('url')
        .eq('id', slide.background_media_id)
        .single();
      if (bgMedia && bgMedia.url) {
        backgroundImageUrl = bgMedia.url;
      }
    }

    if (slide.preview_media_id) {
      const { data: prevMedia } = await supabase
        .from('media_assets')
        .select('url')
        .eq('id', slide.preview_media_id)
        .single();
      if (prevMedia && prevMedia.url) {
        previewImageUrl = prevMedia.url;
      }
    }

    return {
      title: slide.title,
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      backgroundImageUrl,
      previewImageUrl,
      accent: slide.accent || null,
      source: 'supabase'
    };
  } catch (error) {
    console.error(`[load-public-hero-media] Error fetching for ${brandKeyword}:`, error);
    return null;
  }
}
