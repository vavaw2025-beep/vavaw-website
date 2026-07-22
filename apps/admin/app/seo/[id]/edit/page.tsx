import { redirect, notFound } from 'next/navigation';
import { canManageSeo } from '@vavaw/auth';
import { getMediaAssets } from '@vavaw/db';
import { getAdminDataSourceMode } from '../../../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../../../lib/admin-profile';
import { SeoForm } from '../../SeoForm';

export default async function EditSeoSettingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    redirect('/seo');
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || !canManageSeo(profile.role)) {
    redirect('/seo');
  }

  const supabase = await getAdminServerSupabaseClient();

  const { data: setting } = await supabase
    .from('seo_settings')
    .select('*')
    .eq('id', id)
    .single();

  if (!setting) {
    notFound();
  }

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
        <h1 className="text-2xl font-bold text-slate-900">Edit SEO Setting</h1>
        <p className="mt-1 text-sm text-slate-500">
          Updating metadata for <code className="bg-slate-100 px-1 rounded text-slate-800">{setting.site_key}{setting.path}</code>
        </p>
      </div>

      <SeoForm initialData={setting} mediaAssets={mediaAssets} isEdit />
    </div>
  );
}
