'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CosmeticPageMedia } from '@/lib/load-public-cosmetic-media';
import { CosmeticCtaTracker } from '../cosmetic-tracker';
import { FlaskConical, Droplet, Sparkles, CheckCircle, RefreshCw, Check } from 'lucide-react';

interface SkinRitualFinderProps {
  dailyRitual: any;
  products: any;
  cosmeticMedia: CosmeticPageMedia;
}

// ─── Legacy Derived Fallback Logic ──────────────────────────────────────────

function deriveLegacyRitual(items: any[]) {
  const morning: string[] = [];
  const evening: string[] = [];

  (items || []).forEach((item, idx) => {
    const name = item.name || '';
    const detail = item.detail || '';
    const text = `${item.step ? `Step ${item.step}: ` : ''}${name} - ${detail}`;

    const lowerName = name.toLowerCase();
    const lowerDetail = detail.toLowerCase();

    // PM only indications
    if (lowerName.includes('pm') || lowerDetail.includes('pm') || lowerDetail.includes('tối') || lowerName.includes('renew') || lowerName.includes('ampoule')) {
      evening.push(name);
    } 
    // AM only indications
    else if (lowerName.includes('am') || lowerDetail.includes('am') || lowerName.includes('sunscreen') || lowerDetail.includes('chống nắng')) {
      morning.push(name);
    } 
    // General
    else {
      morning.push(name);
      evening.push(name);
    }
  });

  return {
    title: "Daily Clinical Skincare Routine",
    description: "A balanced clinical routine derived from your customized skincare steps.",
    whyThisFits: "Phù hợp cho chu trình phục hồi da cơ bản hằng ngày, duy trì độ mịn màng và cân bằng tự nhiên của hàng rào bảo vệ da.",
    morning: morning.length > 0 ? morning : ["P30 Boost Facial Hydrating Toner", "P30 Boost Facial Moisturizer"],
    evening: evening.length > 0 ? evening : ["P30 Boost Facial Hydrating Toner", "Regenaglow Nourish Sheer Cream"],
    actives: ["Cica 7 Complex", "Peptides", "Hyaluronic Acid"]
  };
}

// ─── Image Resolution Helper ────────────────────────────────────────────────

function getProductThumbnail(
  productName: string,
  clinicalProducts: any[],
  cosmeticMedia: CosmeticPageMedia
): string | undefined {
  // 1. Try to find the product in cosmetic-product-cards items by name
  const items = clinicalProducts || [];
  const matchedItem = items.find((i: any) => 
    (i.name || '').toLowerCase().trim() === productName.toLowerCase().trim()
  );

  const mediaSlot = matchedItem?.mediaSlot;
  if (mediaSlot) {
    const slotKeyMap: Record<string, keyof CosmeticPageMedia> = {
      'cosmetic-product-luminous-set':     'luminousSet',
      'cosmetic-product-regenaglow-cream': 'regenaglow',
      'cosmetic-product-calmiance-gel':    'calmiance',
      'cosmetic-product-renew-ampoule':    'renewAmpoule',
      'cosmetic-product-p30-moisturizer':  'p30Moisturizer',
      'cosmetic-product-p30-toner':        'p30Toner',
      'cosmetic-product-lumiglow-sunscreen': 'lumiglowSunscreen',
    };
    const key = slotKeyMap[mediaSlot] || (mediaSlot as keyof CosmeticPageMedia);
    const url = cosmeticMedia[key];
    if (url && url.trim().startsWith('http')) return url;
  }

  // 2. Name-based search fallback
  const name = productName.toLowerCase();
  let fallbackKey: keyof CosmeticPageMedia | null = null;
  if (name.includes('regenaglow')) fallbackKey = 'regenaglow';
  else if (name.includes('calmiance')) fallbackKey = 'calmiance';
  else if (name.includes('renew') || name.includes('ampoule')) fallbackKey = 'renewAmpoule';
  else if (name.includes('moisturizer') && name.includes('p30')) fallbackKey = 'p30Moisturizer';
  else if (name.includes('toner') && name.includes('p30')) fallbackKey = 'p30Toner';
  else if (name.includes('lumiglow') || name.includes('sunscreen')) fallbackKey = 'lumiglowSunscreen';

  if (fallbackKey) {
    const url = cosmeticMedia[fallbackKey];
    if (url && url.trim().startsWith('http')) return url;
  }

  return undefined;
}

export function SkinRitualFinder({ dailyRitual, products, cosmeticMedia }: SkinRitualFinderProps) {
  const content = dailyRitual?.content || {};
  const clinicalItems = products?.items || [];
  const legacyItems = content.items || [];

  // Default quiz lists
  const ageGroups = content.ageGroups || [
    { id: "18-24", label: "18–24", description: "Da trẻ, cần cân bằng và bảo vệ sớm." },
    { id: "25-34", label: "25–34", description: "Da bắt đầu cần phục hồi, cấp ẩm và bảo vệ hằng ngày." },
    { id: "35-44", label: "35–44", description: "Da cần tái tạo, phục hồi độ đàn hồi và chống lão hóa sớm." },
    { id: "45-plus", label: "45+", description: "Da cần nuôi dưỡng sâu, cải thiện hàng rào bảo vệ và độ săn chắc." }
  ];

  const concerns = content.concerns || [
    { id: "barrier", label: "Da yếu / hàng rào da suy yếu" },
    { id: "sensitive", label: "Da nhạy cảm / dễ đỏ" },
    { id: "dry", label: "Da thiếu ẩm" },
    { id: "dull", label: "Da xỉn màu" },
    { id: "aging", label: "Dấu hiệu lão hóa" },
    { id: "sun-protection", label: "Cần chống nắng và bảo vệ ban ngày" }
  ];

  const goals = content.goals || [
    { id: "recover", label: "Phục hồi" },
    { id: "hydrate", label: "Cấp ẩm" },
    { id: "calm", label: "Làm dịu" },
    { id: "renew", "label": "Tái tạo" },
    { id: "protect", "label": "Bảo vệ" }
  ];

  const recommendations = content.recommendations || [];

  // Quiz selections
  const [selectedAge, setSelectedAge] = useState<string>(ageGroups[0]?.id || '');
  const [selectedConcern, setSelectedConcern] = useState<string>(concerns[0]?.id || '');
  const [selectedGoal, setSelectedGoal] = useState<string>(goals[0]?.id || '');

  // Matching logic
  let matchedRec = recommendations.find((r: any) => 
    r.match?.ageGroup === selectedAge && r.match?.concern === selectedConcern && r.match?.goal === selectedGoal
  );

  if (!matchedRec) {
    matchedRec = recommendations.find((r: any) => 
      r.match?.concern === selectedConcern && r.match?.goal === selectedGoal
    );
  }

  if (!matchedRec) {
    matchedRec = recommendations.find((r: any) => 
      r.match?.concern === selectedConcern
    );
  }

  if (!matchedRec && recommendations.length > 0) {
    matchedRec = recommendations[0];
  }

  // Fallback to legacy derived
  const ritual = matchedRec || deriveLegacyRitual(legacyItems);

  // CTA Link Building
  const ctaLabel = content.ctaLabel || 'Nhận tư vấn cá nhân hóa';
  const ctaHrefBase = content.ctaHref || '/contact?type=cosmetic_interest';
  const params = new URLSearchParams();
  params.append('type', 'cosmetic_interest');
  if (selectedConcern) params.append('concern', selectedConcern);
  if (selectedGoal) params.append('goal', selectedGoal);
  if (selectedAge) params.append('ageGroup', selectedAge);
  const finalCtaHref = `${ctaHrefBase.split('?')[0]}?${params.toString()}`;

  // Tab views within card
  const [routineTab, setRoutineTab] = useState<'morning' | 'evening'>('morning');

  return (
    <section className="bg-white py-28 md:py-36 px-6 border-t border-[#D9DEE8] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="mb-20 text-center">
          <span className="inline-block text-[10px] tracking-[0.3em] uppercase font-semibold text-[#050A5C] mb-4">
            {content.eyebrow || 'DAILY CLINICAL RITUAL'}
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#050A5C] tracking-tight mb-4">
            {content.title || 'Find Your Clinical Ritual'}
          </h2>
          <p className="text-sm md:text-base text-[#6B7280] font-light max-w-2xl mx-auto leading-relaxed">
            {content.description || 'Answer a few quick questions to discover a Korean clinical skincare ritual designed for your skin stage and concern.'}
          </p>
        </div>

        {/* SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT: Quiz Questions Card */}
          <div className="lg:col-span-5 bg-[#F7F9FC] border border-[#D9DEE8] p-8 md:p-10 flex flex-col justify-between" style={{ borderRadius: '1px' }}>
            <div className="space-y-8">
              
              {/* STEP 1: Age Group */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-[#050A5C]/40">01</span>
                  <label className="text-xs font-semibold tracking-wider text-[#050A5C] uppercase">Độ tuổi của bạn</label>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {ageGroups.map((group: any) => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setSelectedAge(group.id)}
                      className={`relative p-3.5 pr-8 text-left border transition-all duration-300 ${
                        selectedAge === group.id
                          ? 'bg-white border-[#050A5C] text-[#050A5C] shadow-sm font-semibold'
                          : 'bg-white/55 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                      }`}
                      style={{ borderRadius: '1px', minHeight: '48px' }}
                    >
                      <span className="block text-xs">{group.label}</span>
                      <span className="block text-[8px] text-slate-400 font-light mt-0.5 line-clamp-1">{group.description}</span>
                      {selectedAge === group.id && (
                        <Check className="absolute top-2.5 right-2.5 h-3 w-3 text-[#050A5C]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 2: Skin Concern */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-[#050A5C]/40">02</span>
                  <label className="text-xs font-semibold tracking-wider text-[#050A5C] uppercase">Vấn đề da quan tâm</label>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {concerns.map((c: any) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedConcern(c.id)}
                      className={`relative p-3.5 pr-8 text-left border text-xs transition-all duration-300 flex items-center ${
                        selectedConcern === c.id
                          ? 'bg-white border-[#050A5C] text-[#050A5C] shadow-sm font-semibold'
                          : 'bg-white/55 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                      }`}
                      style={{ borderRadius: '1px', minHeight: '48px' }}
                    >
                      <span>{c.label}</span>
                      {selectedConcern === c.id && (
                        <Check className="absolute top-3.5 right-2.5 h-3 w-3 text-[#050A5C]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 3: Skincare Goal */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-[#050A5C]/40">03</span>
                  <label className="text-xs font-semibold tracking-wider text-[#050A5C] uppercase">Mục tiêu chăm sóc da</label>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {goals.map((g: any) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGoal(g.id)}
                      className={`relative p-3.5 pr-8 text-left border text-xs transition-all duration-300 flex items-center ${
                        selectedGoal === g.id
                          ? 'bg-white border-[#050A5C] text-[#050A5C] shadow-sm font-semibold'
                          : 'bg-white/55 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                      }`}
                      style={{ borderRadius: '1px', minHeight: '48px' }}
                    >
                      <span>{g.label}</span>
                      {selectedGoal === g.id && (
                        <Check className="absolute top-3.5 right-2.5 h-3 w-3 text-[#050A5C]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 pt-6 border-t border-slate-200/60">
              <p className="text-[10px] text-slate-400 font-light leading-relaxed italic">
                “This ritual is a cosmetic guidance suggestion, not a medical diagnosis.”
              </p>
            </div>
          </div>

          {/* RIGHT: dynamic recommendation result */}
          <div className="lg:col-span-7 bg-[#F7F9FC] border border-[#D9DEE8] p-8 md:p-12 flex flex-col justify-between" style={{ borderRadius: '1px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedAge}-${selectedConcern}-${selectedGoal}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Result header */}
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-[#050A5C] uppercase bg-[#050A5C]/5 border border-[#050A5C]/15 px-3 py-1">
                    <CheckCircle className="h-3 w-3 shrink-0" />
                    Recommended Prescription
                  </span>
                  <h3 className="text-2xl font-light text-[#050A5C] tracking-wide font-serif pt-1">
                    {ritual.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] font-light leading-relaxed">
                    {ritual.description}
                  </p>
                </div>

                {/* Why fits description */}
                {ritual.whyThisFits && (
                  <div className="bg-white border border-[#D9DEE8] p-4 text-xs font-light text-slate-600 leading-relaxed rounded-[1px]">
                    <strong className="font-semibold text-[#050A5C] block mb-1">Tại sao liệu trình này phù hợp với bạn:</strong>
                    {ritual.whyThisFits}
                  </div>
                )}

                {/* Active Ingredients list */}
                {ritual.actives && ritual.actives.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="block text-[8px] tracking-[0.2em] uppercase text-[#050A5C]/35 font-bold">Key Actives</span>
                    <div className="flex flex-wrap gap-1.5">
                      {ritual.actives.map((act: string, i: number) => (
                        <span key={i} className="text-[9px] font-mono text-[#050A5C] border border-[#050A5C]/10 px-2 py-0.5 bg-[#050A5C]/5">{act}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Routine morning / evening tabs */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex border-b border-[#D9DEE8]">
                    <button
                      type="button"
                      onClick={() => setRoutineTab('morning')}
                      className={`pb-2.5 px-4 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all ${
                        routineTab === 'morning'
                          ? 'border-[#050A5C] text-[#050A5C]'
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Morning Routine
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoutineTab('evening')}
                      className={`pb-2.5 px-4 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all ${
                        routineTab === 'evening'
                          ? 'border-[#050A5C] text-[#050A5C]'
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Evening Routine
                    </button>
                  </div>

                  {/* Routine steps render with resolved image thumbnails */}
                  <div className="space-y-3">
                    {((routineTab === 'morning' ? ritual.morning : ritual.evening) || []).map((productName: string, idx: number) => {
                      const thumbUrl = getProductThumbnail(productName, clinicalItems, cosmeticMedia);
                      return (
                        <div key={idx} className="bg-white border border-[#D9DEE8]/60 p-3 flex items-center gap-4 hover:border-slate-300 transition-colors" style={{ borderRadius: '1px' }}>
                          <div className="w-10 h-10 bg-[#F7F9FC] border border-[#D9DEE8] flex-shrink-0 flex items-center justify-center p-1 overflow-hidden relative">
                            {thumbUrl ? (
                              <img src={thumbUrl} alt={productName} className="w-full h-full object-contain mix-blend-multiply bg-[#F7F9FC]" />
                            ) : (
                              <FlaskConical className="h-4 w-4 text-[#050A5C]/15 stroke-[1.2]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[8px] font-bold text-slate-400 font-mono tracking-wider">STEP 0{idx + 1}</span>
                            <span className="block text-xs font-semibold text-slate-700 truncate">{productName}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* CTA action */}
            <div className="border-t border-slate-200/60 pt-6 mt-8">
              <CosmeticCtaTracker
                label={ctaLabel}
                href={finalCtaHref}
                className="w-full h-[46px] flex items-center justify-center bg-[#050A5C] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#101A8C] transition-colors rounded-[1px]"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
