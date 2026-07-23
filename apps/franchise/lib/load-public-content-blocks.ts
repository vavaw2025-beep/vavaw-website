import { createClient } from '@supabase/supabase-js';
import { NormalizedContentBlock } from './public-cms-types';

export async function loadPublicContentBlocks({
  siteKey,
  pagePath,
  isPreview = false,
}: {
  siteKey: string;
  pagePath: string;
  isPreview?: boolean;
}): Promise<{
  blocks: NormalizedContentBlock[];
  source: "static" | "supabase";
  error?: string;
}> {
  const dataSource = process.env.CMS_DATA_SOURCE || 'static';

  if (!isPreview && dataSource !== 'supabase') {
    return {
      blocks: [],
      source: 'static',
    };
  }

  let supabase;
  if (isPreview) {
    const { getPreviewSupabaseClient } = await import('./supabase-preview');
    supabase = getPreviewSupabaseClient();
  } else {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase env vars missing. Falling back to static blocks.');
      return {
        blocks: [],
        source: 'static',
        error: 'Supabase credentials missing',
      };
    }
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  try {
    let query = supabase
      .from('content_blocks')
      .select('*')
      .in('site_key', [siteKey, 'main']) // Support siteKey or 'main' as requested (though usually just matching what we pass)
      .eq('page_path', pagePath)
      .order('sort_order', { ascending: true });

    if (!isPreview) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error loading content blocks for ${siteKey}${pagePath}:`, error);
      return {
        blocks: [],
        source: 'static',
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      return {
        blocks: [],
        source: 'static',
      };
    }

    // Since we queried with .in('site_key', [siteKey, 'main']), we should prioritize exact matches or just return all
    // Let's filter to match exactly siteKey, or if siteKey is cosmetic, it might use 'main' or 'cosmetic'. 
    // The instructions say: site_key = "main" or "cosmetic"
    const validBlocks = data.filter(b => b.site_key === siteKey || b.site_key === 'main' || b.site_key === 'cosmetic');

    const normalizedBlocks: NormalizedContentBlock[] = validBlocks.map(block => ({
      id: block.id,
      siteKey: block.site_key,
      pagePath: block.page_path,
      blockType: block.block_type,
      content: block.content as Record<string, unknown>,
      sortOrder: block.sort_order,
      isActive: block.is_active,
    }));

    // Re-sort in case the filter mixed up the order across site_keys
    normalizedBlocks.sort((a, b) => a.sortOrder - b.sortOrder);

    return {
      blocks: normalizedBlocks,
      source: 'supabase',
    };

  } catch (err: any) {
    console.error(`Exception loading content blocks for ${siteKey}${pagePath}:`, err);
    return {
      blocks: [],
      source: 'static',
      error: err.message,
    };
  }
}
