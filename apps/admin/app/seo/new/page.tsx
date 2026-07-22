import { redirect } from 'next/navigation';
import { canManageSeo } from '@vavaw/auth';
import { getMediaAssets } from '@vavaw/db';
import { getAdminDataSourceMode } from '../../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../../lib/admin-profile';
import { SeoForm } from '../SeoForm';

export default async function NewSeoSettingPage() {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    redirect('/seo');
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || !canManageSeo(profile.role)) {
    redirect('/seo');
  }

  const supabase = await getAdminServerSupabaseClient();
  const { data: mData } = await getMediaAssets(supabase);
  const mediaAssets = mData
    ? mData.map((m) => ({
        id: m.id,
        site_key: m.site_key,
        type: m.type,
        url: m.url,
        alt_text: m.alt_text,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create SEO Setting</h1>
        <p className="mt-1 text-sm text-slate-500">Add metadata configuration for a new page or site key.</p>
      </div>

      <SeoForm mediaAssets={mediaAssets} />
    </div>
  );
}
