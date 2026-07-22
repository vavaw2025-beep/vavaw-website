import { tables } from '../schema';
import { HeroSlideRecord } from '../types';

export type CreateHeroSlideInput = Omit<HeroSlideRecord, 'id' | 'created_at' | 'updated_at'>;
export type UpdateHeroSlideInput = Partial<CreateHeroSlideInput>;

export async function createHeroSlide(
  supabase: any,
  input: CreateHeroSlideInput
): Promise<{ data: HeroSlideRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.hero_slides)
    .insert([input])
    .select()
    .single();

  return { data, error };
}

export async function updateHeroSlide(
  supabase: any,
  id: string,
  input: UpdateHeroSlideInput
): Promise<{ data: HeroSlideRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.hero_slides)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteHeroSlide(
  supabase: any,
  id: string
): Promise<{ success: boolean; error: any }> {
  const { error } = await supabase
    .from(tables.hero_slides)
    .delete()
    .eq('id', id);

  return { success: !error, error };
}
