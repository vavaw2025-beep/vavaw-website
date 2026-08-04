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
      .eq('site_key', 'main')
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

    const activeBlocks = data.filter(b => b.is_active);
    
    // In this updated query, data should already be filtered by is_active if not in preview mode.
    // We compute lengths for debug badge.
    const rawCount = data.length;
    const activeCount = activeBlocks.length;

    const blocksToReturn = isPreview ? data : activeBlocks;
    
    if (blocksToReturn.length === 0 && !isPreview) {
       return {
         blocks: [],
         source: 'static',
         rawCount,
         activeCount,
         fallbackReason: 'All returned blocks were inactive'
       };
    }

    const normalizedBlocks: NormalizedContentBlock[] = blocksToReturn.map(block => {
      // Safely resolve the section key according to actual DB schema
      const rawSectionKey = block.block_type ?? (block as any).blockType ?? block.content?.sectionKey ?? '';
      
      return {
        id: block.id,
        siteKey: block.site_key,
        pagePath: block.page_path,
        blockType: block.block_type, // The DB column block_type
        content: {
          ...(block.content as Record<string, unknown>),
          sectionKey: rawSectionKey // Inject it safely so mapping doesn't break
        },
        sortOrder: block.sort_order,
        isActive: block.is_active,
      };
    });

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
