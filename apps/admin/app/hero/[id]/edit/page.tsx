import { redirect, notFound } from 'next/navigation';
import { canManageHero } from '@vavaw/auth';
import { getBusinessEntries } from '@vavaw/db';
import { getAdminDataSourceMode } from '../../../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../../../lib/admin-profile';
import { HeroForm } from '../../HeroForm';

export default async function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    redirect('/hero');
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || !canManageHero(profile.role)) {
    redirect('/hero');
  }

  const supabase = await getAdminServerSupabaseClient();

  const { data: slide } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('id', id)
    .single();

  if (!slide) {
    notFound();
  }

  const { data: bData } = await getBusinessEntries(supabase);
  const businesses = bData ? bData.map((b) => ({ id: b.id, name: b.name })) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Hero Slide</h1>
        <p className="mt-1 text-sm text-slate-500">Update slide content for "{slide.title}".</p>
      </div>

      <HeroForm initialData={slide} businesses={businesses} isEdit />
    </div>
  );
}
