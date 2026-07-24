import type { Metadata } from 'next';
import Link from 'next/link';
import { getBusinessBySlug } from '@vavaw/brand-config';
import { ArrowRight, Sparkles, Heart, Droplets, ArrowUpRight } from 'lucide-react';
import { loadPublicSeo } from '@/lib/load-public-seo';
import { loadPublicContentBlocks } from '@/lib/load-public-content-blocks';
import { ContentBlockRenderer } from '@/components/content-block-renderer';
import { BeautyCtaButton } from '@/components/analytics-trackers';
import { LeadForm } from '@/components/lead-form';
import { SiteFooter } from '@vavaw/ui';

export const revalidate = 60;

const beautyEntry = getBusinessBySlug('beauty');

import { draftMode } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const isPreview = (await draftMode()).isEnabled;
  const seo = await loadPublicSeo('/', 'beauty', isPreview); // Pass isPreview to seo

  return {
    title: seo.title || beautyEntry?.seo.title || 'VAVAW Beauty',
    description: seo.description || beautyEntry?.seo.description || beautyEntry?.description,
    keywords: seo.keywords || beautyEntry?.seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl || beautyEntry?.seo.canonicalUrl || 'https://vavaw.vn/beauty',
    },
    openGraph: {
      title: seo.title || beautyEntry?.seo.title || 'VAVAW Beauty',
      description: seo.description || beautyEntry?.seo.description || beautyEntry?.description,
      url: seo.canonicalUrl || beautyEntry?.seo.canonicalUrl || 'https://vavaw.vn/beauty',
      images: seo.ogImageUrl
        ? [seo.ogImageUrl]
        : beautyEntry?.media.ogImage
        ? [beautyEntry.media.ogImage]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title || beautyEntry?.seo.title || 'VAVAW Beauty',
      description: seo.description || beautyEntry?.seo.description || beautyEntry?.description,
    },
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsFollow,
    },
  };
}

export default async function BeautyLandingPage() {
  if (!beautyEntry) return null;

  const isPreview = (await draftMode()).isEnabled;
  const { blocks, source } = await loadPublicContentBlocks({
    siteKey: 'beauty',
    pagePath: '/',
    isPreview
  });

  if (blocks.length > 0) {
    return (
      <>
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black text-white text-xs px-2 py-1 rounded z-50 shadow">
            Content: {source} {isPreview ? '(Preview)' : ''}
          </div>
        )}
        <ContentBlockRenderer blocks={blocks} />
      </>
    );
  }

  // Fallback to static
  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white text-xs px-2 py-1 rounded z-50 shadow">
          Content: static (fallback)
        </div>
      )}
      <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans selection:bg-[#EAE4D9] selection:text-[#2C2A29]">
        {/* Navigation */}
        <nav className="absolute top-0 w-full z-50 p-6 md:px-12 flex justify-between items-center bg-transparent">
          <Link href="/" className="text-sm font-medium tracking-[0.2em] uppercase hover:opacity-70 transition-opacity">
            VAVAW Ecosystem
          </Link>
          <Link 
            href="https://vavaw.vn" 
            className="text-xs uppercase tracking-widest border border-current px-5 py-2 hover:bg-[#2C2A29] hover:text-[#FDFBF7] transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        {/* 1. Hero Section */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[#EAE4D9]">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply"
            style={{ backgroundImage: `url(${beautyEntry.media.backgroundImage})` }}
          />
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] mb-6 block text-[#5C5855]">
              {beautyEntry.category}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight mb-6 text-[#2C2A29] leading-tight">
              {beautyEntry.title}
            </h1>
            <p className="text-lg md:text-2xl font-light text-[#5C5855] max-w-2xl mx-auto leading-relaxed mb-12">
              {beautyEntry.subtitle}
            </p>
            <BeautyCtaButton
              label={beautyEntry.ctaLabel}
              className="group flex items-center gap-4 bg-[#2C2A29] text-[#FDFBF7] px-8 py-4 text-sm uppercase tracking-widest hover:bg-[#4A4744] transition-all duration-300"
            >
              {beautyEntry.ctaLabel}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </BeautyCtaButton>
          </div>
        </section>

        {/* 2. Brand Philosophy */}
        <section className="py-24 md:py-40 px-6 md:px-12 bg-[#FDFBF7]">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-8 text-[#A89F91]" strokeWidth={1} />
            <h2 className="text-3xl md:text-5xl font-serif font-light mb-8 leading-snug">
              Elevating your daily ritual into an art form.
            </h2>
            <p className="text-base md:text-lg text-[#5C5855] font-light leading-relaxed">
              {beautyEntry.description} We believe that true beauty stems from deliberate care and quiet moments of luxury. 
              Our spaces and products are designed to bring tranquility to your routine, fostering both inner balance and outward radiance.
            </p>
          </div>
        </section>

        {/* 3. Service/Category Highlights */}
        <section className="py-24 px-6 md:px-12 bg-[#F7F4EE]">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-2xl md:text-4xl font-serif font-light">Curated Experiences</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Beauty Care',
                  desc: 'Bespoke treatments tailored to your unique essence, delivered with precision and grace.',
                  icon: <Sparkles className="w-5 h-5 mb-6 opacity-60" strokeWidth={1.5} />
                },
                {
                  title: 'Skincare Ritual',
                  desc: 'Premium formulations and gentle techniques to nourish, restore, and protect your skin barrier.',
                  icon: <Droplets className="w-5 h-5 mb-6 opacity-60" strokeWidth={1.5} />
                },
                {
                  title: 'Lifestyle Experience',
                  desc: 'A holistic approach to well-being, transforming ordinary moments into luxurious pauses.',
                  icon: <Heart className="w-5 h-5 mb-6 opacity-60" strokeWidth={1.5} />
                }
              ].map((item, i) => (
                <div key={i} className="group p-8 md:p-12 bg-[#FDFBF7] border border-[#EAE4D9] hover:border-[#D1C9B8] transition-colors cursor-pointer">
                  {item.icon}
                  <h3 className="text-xl font-serif mb-4">{item.title}</h3>
                  <p className="text-sm text-[#5C5855] font-light leading-relaxed mb-8">
                    {item.desc}
                  </p>
                  <div className="w-8 h-[1px] bg-[#2C2A29] group-hover:w-16 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Experience Section */}
        <section className="py-24 md:py-40 px-6 md:px-12 bg-[#2C2A29] text-[#FDFBF7]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#A89F91] mb-6 block">
                The Standard
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-12 leading-tight">
                A sanctuary for refined self-care.
              </h2>
              <ul className="space-y-8">
                {[
                  { title: 'Tranquil Environment', desc: 'Designed to soothe the senses the moment you arrive.' },
                  { title: 'Expert Artistry', desc: 'Curated professionals dedicated to perfection.' },
                  { title: 'Premium Selection', desc: 'Only the finest products selected for your skin.' },
                  { title: 'Personalized Approach', desc: 'Every treatment adapted to your specific needs.' }
                ].map((point, i) => (
                  <li key={i} className="flex gap-4 items-start border-t border-[#4A4744] pt-8">
                    <span className="text-xs font-mono text-[#A89F91] mt-1">0{i+1}</span>
                    <div>
                      <h4 className="text-lg font-medium mb-2">{point.title}</h4>
                      <p className="text-sm text-[#A89F91] font-light">{point.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-[3/4] bg-[#4A4744] relative overflow-hidden flex items-center justify-center group">
              <span className="text-xs tracking-widest uppercase text-[#A89F91] group-hover:opacity-0 transition-opacity">
                Visual Placeholder
              </span>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
            </div>
          </div>
        </section>

        {/* 5. Gallery Placeholder */}
        <section className="py-24 md:py-32 px-6 md:px-12 bg-[#FDFBF7]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`aspect-[4/5] bg-[#EAE4D9] flex items-center justify-center p-6 text-center ${i % 2 === 0 ? 'md:translate-y-8' : ''}`}
                >
                  <span className="text-[10px] tracking-widest uppercase text-[#A89F91]">
                    Atmosphere 0{i}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. CTA / Booking Section */}
        <section className="py-24 md:py-32 px-6 bg-[#F7F4EE]">
          <div className="max-w-4xl mx-auto">
            <LeadForm />
          </div>
        </section>

        {/* Footer */}
        <SiteFooter variant="beauty" />
      </div>
    </>
  );
}
