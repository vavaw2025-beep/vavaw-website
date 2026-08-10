import { redirect } from 'next/navigation';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { CosmeticPageManager } from './CosmeticPageManager';
import { ContentBlockRecord, MediaAssetRecord } from '@vavaw/db';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Cosmetic Page Management | VAVAW Admin',
};

export default async function CosmeticPage() {
  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    redirect('/auth/login');
  }

  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4 text-slate-900">Cosmetic Page Management</h1>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md">
          CMS features are disabled in mock mode. Please switch to Supabase data source.
        </div>
      </div>
    );
  }

  const supabase = await getAdminServerSupabaseClient();
  
  // Fetch blocks
  const { data: blocksData, error: blocksError } = await supabase
    .from('content_blocks')
    .select('*')
    .in('page_path', ['/cosmetic', '/cosmetic/products/luminous-revitalization-sheer-set', '/cosmetic/products/cellurevive-ampoule', '/cosmetic/products/regenaglow-nourish-sheer-cream'])
    .order('sort_order', { ascending: true });
    
  if (blocksError) {
    console.error("Error fetching cosmetic blocks:", blocksError);
  }
  
  const blocks = blocksData || [];

  // Fetch cosmetic media slots
  const { data: mediaData, error: mediaError } = await supabase
    .from('media_assets')
    .select('*')
    .eq('metadata->>purpose', 'cosmetic-page-media');

  if (mediaError) {
    console.error("Error fetching cosmetic media:", mediaError);
  }

  const media = mediaData || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <CosmeticPageManager initialBlocks={blocks} mediaAssets={media} role={profile.role} />
    </div>
  );
}
