import type { Metadata } from 'next';
import Link from 'next/link';
import { getBusinessBySlug } from '@vavaw/brand-config';
import { ArrowRight, CheckCircle2, TrendingUp, Building, Map, ArrowUpRight, Plus, HelpCircle, Briefcase, FileSignature, Target, ShieldCheck } from 'lucide-react';
import { loadPublicSeo } from '@/lib/load-public-seo';
import { loadPublicContentBlocks } from '@/lib/load-public-content-blocks';
import { FranchiseLeadForm } from '@/components/franchise-lead-form';
import { ContentBlockRenderer } from '@/components/content-block-renderer';
import { FranchiseCtaButton } from '@/components/analytics-trackers';

export const revalidate = 60;

const franchiseEntry = getBusinessBySlug('franchise');

export async function generateMetadata(): Promise<Metadata> {
  const seo = await loadPublicSeo('/', 'franchise'); // Note: load-public-seo assumes it might accept siteKey, or defaults based on path. We will pass it if supported.

  return {
    title: seo.title || franchiseEntry?.seo.title || 'VAVAW Franchise',
    description: seo.description || franchiseEntry?.seo.description || franchiseEntry?.description,
    keywords: seo.keywords || franchiseEntry?.seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl || franchiseEntry?.seo.canonicalUrl || 'https://vavaw.vn/franchise',
    },
    openGraph: {
      title: seo.title || franchiseEntry?.seo.title || 'VAVAW Franchise',
      description: seo.description || franchiseEntry?.seo.description || franchiseEntry?.description,
      url: seo.canonicalUrl || franchiseEntry?.seo.canonicalUrl || 'https://vavaw.vn/franchise',
      images: seo.ogImageUrl
        ? [seo.ogImageUrl]
        : franchiseEntry?.media.ogImage
        ? [franchiseEntry.media.ogImage]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title || franchiseEntry?.seo.title || 'VAVAW Franchise',
      description: seo.description || franchiseEntry?.seo.description || franchiseEntry?.description,
    },
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsFollow,
    },
  };
}

export default async function FranchiseLandingPage() {
  if (!franchiseEntry) return null;

  const { blocks, source } = await loadPublicContentBlocks({
    siteKey: 'franchise',
    pagePath: '/'
  });

  if (blocks.length > 0) {
    return (
      <>
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black text-white text-xs px-2 py-1 rounded z-50 shadow">
            Content: {source}
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
      <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans selection:bg-[#D97706] selection:text-[#FFFFFF]">
        {/* Navigation */}
        <nav className="absolute top-0 w-full z-50 p-6 md:px-12 flex justify-between items-center bg-transparent text-white">
          <Link href="/" className="text-sm font-semibold tracking-[0.1em] uppercase hover:opacity-80 transition-opacity">
            VAVAW Ecosystem
          </Link>
          <Link 
            href="https://vavaw.vn" 
            className="text-xs uppercase tracking-wider font-semibold border border-white px-6 py-2.5 hover:bg-white hover:text-[#111] transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        {/* 1. Hero Section */}
        <section className="relative h-[90vh] min-h-[700px] flex items-center bg-[#111111] text-white">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 mix-blend-overlay"
            style={{ backgroundImage: `url(${franchiseEntry.media.backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent z-10" />
          
          <div className="relative z-20 px-6 md:px-12 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-end pb-24 md:pb-32 gap-12 justify-between">
            <div className="max-w-2xl">
              <span className="text-sm uppercase tracking-[0.2em] mb-4 block text-[#D97706] font-semibold">
                {franchiseEntry.category} Opportunities
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight mb-6 leading-tight">
                {franchiseEntry.title}
              </h1>
              <p className="text-lg md:text-xl font-light text-gray-300 max-w-xl leading-relaxed mb-10">
                {franchiseEntry.subtitle} {franchiseEntry.description}
              </p>
              <FranchiseCtaButton
                label={franchiseEntry.ctaLabel}
                className="group flex items-center gap-3 bg-[#D97706] text-white px-8 py-4 text-sm uppercase tracking-wider font-semibold hover:bg-[#B45309] transition-all duration-300 shadow-lg shadow-[#D97706]/20"
              >
                {franchiseEntry.ctaLabel}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </FranchiseCtaButton>
            </div>
            <div className="hidden md:flex flex-col gap-6 text-sm font-medium text-gray-400">
              <div className="flex flex-col gap-1">
                <span className="text-white text-3xl font-serif">Global</span>
                <span>Network</span>
              </div>
              <div className="w-12 h-[1px] bg-gray-700" />
              <div className="flex flex-col gap-1">
                <span className="text-white text-3xl font-serif">Proven</span>
                <span>Model</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Why Franchise with VAVAW */}
        <section className="py-24 md:py-32 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">Why Partner with VAVAW?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                We provide a robust foundation for success, combining our brand prestige with a comprehensive operational framework.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Brand Ecosystem',
                  desc: 'Leverage the established VAVAW ecosystem, driving cross-brand synergies and customer loyalty.',
                  icon: <Target className="w-8 h-8 mb-6 text-[#D97706]" strokeWidth={1.5} />
                },
                {
                  title: 'Market Positioning',
                  desc: 'Capture the premium beauty and cosmetic market with highly sought-after, quality-driven products.',
                  icon: <TrendingUp className="w-8 h-8 mb-6 text-[#D97706]" strokeWidth={1.5} />
                },
                {
                  title: 'Operational Playbook',
                  desc: 'Access our proven step-by-step operating procedures, ensuring efficiency and consistent quality.',
                  icon: <FileSignature className="w-8 h-8 mb-6 text-[#D97706]" strokeWidth={1.5} />
                },
                {
                  title: 'Scalable Model',
                  desc: 'Built for growth. Our modular approach allows you to scale from a single unit to a regional network.',
                  icon: <ShieldCheck className="w-8 h-8 mb-6 text-[#D97706]" strokeWidth={1.5} />
                }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-[#FAFAFA] border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                  {item.icon}
                  <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Partnership Model */}
        <section className="py-24 md:py-32 px-6 md:px-12 bg-[#F3F4F6]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <span className="text-sm uppercase tracking-widest text-[#D97706] font-semibold mb-3 block">Investment Formats</span>
              <h2 className="text-3xl md:text-5xl font-serif font-medium">Partnership Models</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  type: 'Flagship Partner',
                  focus: 'Premium Experience Center',
                  details: [
                    'High street or premium mall location',
                    'Full range of VAVAW Beauty & Cosmetic',
                    'Exclusive spatial design guidelines',
                    'Highest margin structure'
                  ],
                  icon: <Building className="w-6 h-6 text-gray-800" />
                },
                {
                  type: 'Studio Partner',
                  focus: 'Boutique Retail Concept',
                  details: [
                    'Compact footprint for urban areas',
                    'Curated best-selling product selection',
                    'Streamlined operational requirements',
                    'Fastest time to market'
                  ],
                  icon: <Briefcase className="w-6 h-6 text-gray-800" />
                },
                {
                  type: 'Distribution Partner',
                  focus: 'B2B & Regional Supply',
                  details: [
                    'Territory exclusivity rights',
                    'Supply to local salons and boutiques',
                    'Volume-based incentive structure',
                    'Dedicated account management'
                  ],
                  icon: <Map className="w-6 h-6 text-gray-800" />
                }
              ].map((model, i) => (
                <div key={i} className="bg-white p-10 shadow-sm border border-gray-200 flex flex-col">
                  <div className="mb-8 p-4 bg-gray-50 inline-block self-start rounded-lg">
                    {model.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-medium mb-2">{model.type}</h3>
                  <p className="text-sm text-[#D97706] font-semibold uppercase tracking-wider mb-8">{model.focus}</p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    {model.details.map((detail, j) => (
                      <li key={j} className="flex gap-3 items-start text-sm text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#D97706] shrink-0" />
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors uppercase tracking-wider">
                    View Requirements
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Application Process */}
        <section className="py-24 md:py-32 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">The Journey to Launch</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                Our structured onboarding ensures you are fully prepared to operate a successful VAVAW franchise.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
              <div className="hidden md:block absolute top-8 left-12 right-12 h-[2px] bg-gray-100 z-0" />
              {[
                { title: 'Submit Interest', desc: 'Complete our initial inquiry form to express your interest and territory preference.' },
                { title: 'Consultation', desc: 'Meet with our franchise development team to discuss your background and goals.' },
                { title: 'Business Review', desc: 'Review financial requirements, sign the FDD, and secure your location.' },
                { title: 'Launch Roadmap', desc: 'Commence training, store build-out, and execute the grand opening plan.' }
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white border-4 border-[#D97706] text-[#D97706] rounded-full flex items-center justify-center text-xl font-bold font-serif mb-6 shadow-xl shadow-[#D97706]/10">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. FAQ Section */}
        <section className="py-24 px-6 md:px-12 bg-[#F9FAFB] border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <HelpCircle className="w-10 h-10 mx-auto text-gray-400 mb-6" strokeWidth={1.5} />
              <h2 className="text-3xl md:text-4xl font-serif font-medium">Common Questions</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { q: 'Who can apply for a franchise?', a: 'We seek passionate entrepreneurs with a background in retail, beauty, or business management. Alignment with VAVAW core values is essential.' },
                { q: 'What investment level is required?', a: 'Investment varies significantly by model (Flagship vs Studio). Detailed financial breakdowns are provided during the consultation phase.' },
                { q: 'Is training included?', a: 'Yes, comprehensive training covering product knowledge, operational procedures, marketing, and staff management is mandatory prior to launch.' },
                { q: 'Can partners operate under a local market?', a: 'Yes, we provide market-specific adaptations while maintaining global brand consistency. Territory rights are negotiated individually.' },
                { q: 'How do I start?', a: 'Simply click "Apply Now" or "Contact Us" to fill out the initial interest form. Our team will reach out within 48 hours.' }
              ].map((faq, i) => (
                <div key={i} className="bg-white p-6 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium text-gray-900 pr-8">{faq.q}</h4>
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#D97706] transition-colors shrink-0" />
                  </div>
                  {/* Simulated open state for the first item for mock purposes */}
                  {i === 0 && (
                    <p className="mt-4 text-sm text-gray-600 leading-relaxed font-light">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. CTA / Form Section */}
        <section className="py-24 md:py-32 px-6 bg-[#111111] text-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">
                Build the future of beauty.
              </h2>
              <p className="text-lg text-gray-400 font-light mb-12 max-w-xl mx-auto">
                Take the first step towards a lucrative partnership. Submit your inquiry today and our franchise development team will be in touch.
              </p>
            </div>
            <div className="bg-white text-black p-1 rounded-xl">
              <FranchiseLeadForm />
            </div>
            <div className="mt-12 text-center">
              <Link 
                href="https://vavaw.vn"
                className="inline-flex justify-center items-center gap-2 border-b border-gray-600 pb-1 text-sm uppercase tracking-wider hover:text-gray-300 hover:border-gray-300 transition-colors"
              >
                Back to VAVAW
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 md:px-12 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs tracking-widest uppercase text-gray-500 font-semibold">
            <div>&copy; {new Date().getFullYear()} VAVAW Franchise.</div>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-gray-900 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
