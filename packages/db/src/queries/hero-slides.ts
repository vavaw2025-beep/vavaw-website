import { tables } from '../schema';
import { HeroSlideRecord } from '../types';

export async function getHeroSlides(supabase: any): Promise<{ data: HeroSlideRecord[] | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.hero_slides)
    .select('*')
    .order('sort_order', { ascending: true });
  return { data, error };
}
