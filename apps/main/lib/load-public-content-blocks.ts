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
  rawCount?: number;
  activeCount?: number;
  fallbackReason?: string;
}> {
  const dataSource = process.env.CMS_DATA_SOURCE || 'static';

  if (!isPreview && dataSource !== 'supabase') {
    return {
      blocks: [],
      source: 'static',
      fallbackReason: 'CMS_DATA_SOURCE is not supabase'
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
        fallbackReason: 'Supabase credentials missing'
      };
    }
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  try {
    let query = supabase
      .from('content_blocks')
      .select('*')
      .in('site_key', [siteKey, 'main']) // Support siteKey or 'main' as requested
      .eq('page_path', pagePath)
      .order('sort_order', { ascending: true });

    // Fetch all (active + inactive) to compute metrics
    const { data, error } = await query;

    if (error) {
      console.error(`Error loading content blocks for ${siteKey}${pagePath}:`, error);
      return {
        blocks: [],
        source: 'static',
        error: error.message,
        fallbackReason: error.message,
      };
    }

    if (!data || data.length === 0) {
      console.log(`[loadPublicContentBlocks] No blocks found for ${siteKey}${pagePath}`);
      return {
        blocks: [],
        source: 'static',
        fallbackReason: 'No blocks returned from CMS'
      };
    }

    // Filter to exact match site key
    const validBlocks = data.filter(b => b.site_key === siteKey || b.site_key === 'main' || b.site_key === 'cosmetic');
    
    const rawCount = validBlocks.length;
    const activeBlocks = validBlocks.filter(b => b.is_active);
    const activeCount = activeBlocks.length;

    // Filter out inactive blocks unless in preview mode
    const blocksToReturn = isPreview ? validBlocks : activeBlocks;
    
    if (blocksToReturn.length === 0 && !isPreview) {
       return {
         blocks: [],
         source: 'static',
         rawCount,
         activeCount,
         fallbackReason: 'All returned blocks were inactive'
       };
    }

    const normalizedBlocks: NormalizedContentBlock[] = blocksToReturn.map(block => ({
      id: block.id,
      siteKey: block.site_key,
      pagePath: block.page_path,
      blockType: block.block_type,
      content: block.content as Record<string, unknown>,
      sortOrder: block.sort_order,
      isActive: block.is_active,
    }));

    normalizedBlocks.sort((a, b) => a.sortOrder - b.sortOrder);

    return {
      blocks: normalizedBlocks,
      source: 'supabase',
      rawCount,
      activeCount
    };

  } catch (err: any) {
    console.error(`Exception loading content blocks for ${siteKey}${pagePath}:`, err);
    return {
      blocks: [],
      source: 'static',
      error: err.message,
      fallbackReason: err.message,
    };
  }
}
