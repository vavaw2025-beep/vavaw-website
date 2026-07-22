import { BrandHero } from '@/components/brand-hero';
import { loadPublicHomeCms } from '@/lib/load-public-cms';

export default async function HomePage() {
  const cms = await loadPublicHomeCms();

  return (
    <main>
      <BrandHero slides={cms.heroSlides} dataSource={cms.source} />
    </main>
  );
}
