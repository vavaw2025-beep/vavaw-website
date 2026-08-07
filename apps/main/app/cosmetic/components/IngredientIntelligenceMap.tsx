'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Atom,
  FlaskConical,
  Microscope,
  Droplet,
  ShieldCheck,
  Sparkles,
  Leaf,
  ScanHeart,
  BadgeCheck,
  Sun,
  Waves,
  Gem,
  Check,
  Clock
} from 'lucide-react';

// Icon Map definition matching string ids
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  'atom': Atom,
  'flask-conical': FlaskConical,
  'microscope': Microscope,
  'droplet': Droplet,
  'shield-check': ShieldCheck,
  'sparkles': Sparkles,
  'leaf': Leaf,
  'scan-heart': ScanHeart,
  'badge-check': BadgeCheck,
  'sun': Sun,
  'waves': Waves,
  'gem': Gem
};

export const ROUTINE_STAGES = ['PREPARE', 'TREAT', 'RECOVER', 'SEAL', 'PROTECT'] as const;

export interface IngredientItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  routineStage: string;
  usage: string;
  shortRole: string;
  description: string;
  supports: string[];
  bestFor: string[];
  foundIn: string[];
}

interface IngredientIntelligenceMapProps {
  ingredientsBlock: {
    eyebrow?: string;
    title?: string;
    description?: string;
    logicTitle?: string;
    logicDescription?: string;
    items?: any[];
  };
}

/** Helper to parse comma-separated or array strings */
function parseList(val: any): string[] {
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === 'string') {
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

/** Normalization helper to handle legacy content structures safely without crashing */
export function normalizeIngredientItem(item: any, fallbackIdx: number): IngredientItem {
  if (!item) {
    return {
      id: `ing-${fallbackIdx}`,
      name: 'Active Ingredient',
      category: 'Clinical Support',
      icon: 'flask-conical',
      routineStage: 'RECOVER',
      usage: 'AM · PM',
      shortRole: 'Hỗ trợ cải thiện vẻ đẹp của làn da.',
      description: 'Hoạt chất phục hồi và nuôi dưỡng sâu hàng rào bảo vệ tự nhiên.',
      supports: [],
      bestFor: [],
      foundIn: []
    };
  }

  // Handle legacy content (e.g. { icon: '◆', text: '...' })
  const isLegacy = !item.name && item.text;
  
  const id = item.id || (item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : `ing-${fallbackIdx}`);
  const name = item.name || (isLegacy ? 'Hoạt chất bổ sung' : `Hoạt chất #${fallbackIdx + 1}`);
  const category = item.category || 'Clinical Support';
  const icon = item.icon && ICON_MAP[item.icon] ? item.icon : (fallbackIdx % 2 === 0 ? 'atom' : 'flask-conical');
  const routineStage = item.routineStage || 'RECOVER';
  const usage = item.usage || 'AM · PM';
  const shortRole = item.shortRole || item.role || (isLegacy ? item.text : 'Hỗ trợ tối ưu hóa quy trình dưỡng da.');
  const description = item.description || (isLegacy ? item.text : 'Được đặc chế hỗ trợ sự khỏe mạnh của lớp màng Hydrolipid.');
  const supports = parseList(item.supports || item.supportList || []);
  const bestFor = parseList(item.bestFor || []);
  const foundIn = parseList(item.foundIn || item.products || []);

  return { id, name, category, icon, routineStage, usage, shortRole, description, supports, bestFor, foundIn };
}

export default function IngredientIntelligenceMap({ ingredientsBlock }: IngredientIntelligenceMapProps) {
  const {
    eyebrow = 'ACTIVE INGREDIENT INTELLIGENCE',
    title = 'Bản đồ hoạt chất phục hồi da',
    description = 'Khám phá cách các hoạt chất trong hệ sản phẩm VAVAW hỗ trợ phục hồi, cấp ẩm, làm dịu, tái tạo và bảo vệ làn da.',
    logicTitle = 'Clinical Formula Logic',
    logicDescription = 'Mỗi hoạt chất được đặt vào đúng vai trò trong routine: chuẩn bị da, hỗ trợ tái tạo, làm dịu, khóa ẩm và bảo vệ ban ngày.',
    items = []
  } = ingredientsBlock || {};

  // Normalize all items
  const normalizedItems: IngredientItem[] = items.map((item, idx) => normalizeIngredientItem(item, idx));

  // Active state for desktop detail panel
  const [selectedId, setSelectedId] = useState<string>('');
  
  // Set default active item to first available
  useEffect(() => {
    if (normalizedItems.length > 0 && !selectedId) {
      setSelectedId(normalizedItems[0].id);
    }
  }, [normalizedItems, selectedId]);

  // Keep track of active item
  const activeItem = normalizedItems.find(item => item.id === selectedId) || normalizedItems[0];

  // Mobile Accordion state (stores open item ID)
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);

  // Set default mobile open item to first
  useEffect(() => {
    if (normalizedItems.length > 0 && mobileOpenId === null) {
      setMobileOpenId(normalizedItems[0].id);
    }
  }, [normalizedItems, mobileOpenId]);

  // Motion reduced motion settings
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const slideFadeVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion.current ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: prefersReducedMotion.current ? 0 : -10, transition: { duration: 0.2, ease: 'easeIn' } }
  } as const;

  const accordionVariants = {
    collapsed: { height: 0, opacity: 0, transition: { duration: 0.2, ease: 'easeInOut' } },
    expanded: { height: 'auto', opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } }
  } as const;

  if (normalizedItems.length === 0) return null;

  return (
    <section className="py-24 md:py-32 px-6 bg-[#F8FAFC] border-t border-[#E2E8F0] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#050A5C] bg-[#050A5C]/5 px-3 py-1 rounded-full uppercase font-mono">
            {eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#050A5C] tracking-tight mt-4 mb-5 leading-tight">
            {title}
          </h2>
          <div className="w-12 h-0.5 bg-[#050A5C]/20 mx-auto mb-5" />
          <p className="text-slate-500 text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* ─── DESKTOP DASHBOARD LAYOUT (hidden on mobile) ────────────────── */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Interactive selector list */}
          <div className="col-span-5 space-y-3.5">
            {normalizedItems.map((item) => {
              const IconComponent = ICON_MAP[item.icon] || FlaskConical;
              const isSelected = item.id === selectedId;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-start gap-4 ${
                    isSelected
                      ? 'bg-white border-[#050A5C] shadow-md ring-1 ring-[#050A5C]/20'
                      : 'bg-white/50 border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1] shadow-sm'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg flex-shrink-0 transition-colors ${
                    isSelected ? 'bg-[#050A5C] text-white' : 'bg-slate-100 text-[#050A5C]'
                  }`}>
                    <IconComponent className="h-5 w-5 stroke-[1.2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-[#050A5C] truncate">{item.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono font-medium">{item.category}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.shortRole}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right panel: Dynamic intelligence dashboard */}
          <div className="col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-8 md:p-10 shadow-sm relative min-h-[500px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {activeItem && (
                <motion.div
                  key={activeItem.id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={slideFadeVariants}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Title & category */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block font-mono">
                          {activeItem.category}
                        </span>
                        <h3 className="text-2xl font-light text-[#050A5C] mt-1">{activeItem.name}</h3>
                      </div>
                      
                      {/* Time Usage Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 text-slate-600 font-mono text-[10px] font-bold rounded-full">
                        <Clock className="h-3 w-3" />
                        <span>Best: {activeItem.usage}</span>
                      </span>
                    </div>

                    {/* Routine Stage Map indicator */}
                    <div className="mt-5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block font-mono mb-2.5">
                        Routine System Integration
                      </span>
                      <div className="grid grid-cols-5 gap-1 text-center bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        {ROUTINE_STAGES.map((stage) => {
                          const isActive = activeItem.routineStage.toUpperCase().includes(stage);
                          return (
                            <div
                              key={stage}
                              className={`py-1.5 rounded text-[9px] font-bold tracking-wider transition-all duration-300 ${
                                isActive
                                  ? 'bg-[#050A5C] text-white shadow-sm scale-[1.03]'
                                  : 'text-slate-400 bg-transparent'
                              }`}
                            >
                              {stage}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Main Description */}
                    <div className="mt-6 space-y-4">
                      <p className="text-xs font-semibold text-[#050A5C] bg-[#F4F7FB] px-4 py-3 rounded-lg border-l-2 border-[#050A5C] leading-relaxed">
                        {activeItem.shortRole}
                      </p>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        {activeItem.description}
                      </p>
                    </div>

                    {/* Supports chips */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeItem.supports.length > 0 && (
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block font-mono mb-2">
                            Key Support Claims
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeItem.supports.map((sup, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded"
                              >
                                <Check className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                                <span className="font-light">{sup}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeItem.bestFor.length > 0 && (
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block font-mono mb-2">
                            Recommended For
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeItem.bestFor.map((target, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center text-[10px] text-[#050A5C] bg-[#050A5C]/5 px-2.5 py-1 rounded font-normal"
                              >
                                {target}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Found in Products */}
                  {activeItem.foundIn.length > 0 && (
                    <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest font-mono">
                        Integrated Products:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeItem.foundIn.map((prod, idx) => (
                          <div
                            key={idx}
                            className="text-[10px] font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded hover:border-[#050A5C]/30 hover:text-[#050A5C] transition cursor-default shadow-sm"
                          >
                            {prod}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Cosmetic Disclaimer */}
            <div className="text-[9px] text-slate-400 font-light italic mt-6 border-t border-slate-100 pt-3">
              * Thông tin mang tính chất tham khảo khoa học về thành phần mỹ phẩm. Hiệu quả thực tế tùy thuộc cơ địa và tình trạng da cụ thể.
            </div>
          </div>
        </div>

        {/* ─── MOBILE ACCORDION LAYOUT (hidden on desktop) ────────────────── */}
        <div className="lg:hidden space-y-4">
          {normalizedItems.map((item, idx) => {
            const IconComponent = ICON_MAP[item.icon] || FlaskConical;
            const isOpen = item.id === mobileOpenId;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setMobileOpenId(isOpen ? null : item.id)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      isOpen ? 'bg-[#050A5C] text-white' : 'bg-slate-100 text-[#050A5C]'
                    }`}>
                      <IconComponent className="h-5 w-5 stroke-[1.2]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-[#050A5C] truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.category}</p>
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-slate-200/60 font-mono">
                    {item.usage}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      variants={accordionVariants}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-5 text-sm">
                        
                        {/* Routine stage steps map (compact) */}
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <div className="grid grid-cols-5 gap-0.5 text-center text-[8px] font-bold">
                            {ROUTINE_STAGES.map((stage) => {
                              const isActive = item.routineStage.toUpperCase().includes(stage);
                              return (
                                <div
                                  key={stage}
                                  className={`py-1 rounded-sm ${
                                    isActive ? 'bg-[#050A5C] text-white font-black' : 'text-slate-300'
                                  }`}
                                >
                                  {stage}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Short role and long description */}
                        <div className="space-y-2.5">
                          <p className="text-xs font-semibold text-[#050A5C] bg-[#F4F7FB] px-3.5 py-2.5 rounded border-l-2 border-[#050A5C]">
                            {item.shortRole}
                          </p>
                          <p className="text-xs text-slate-500 font-light leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Supports & Best For */}
                        <div className="grid grid-cols-1 gap-4 pt-1">
                          {item.supports.length > 0 && (
                            <div>
                              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest block font-mono mb-1.5">
                                Key Support Claims
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {item.supports.map((sup, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="inline-flex items-center gap-1 text-[9px] text-slate-600 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded"
                                  >
                                    <Check className="h-2.5 w-2.5 text-emerald-500 flex-shrink-0" />
                                    <span>{sup}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {item.bestFor.length > 0 && (
                            <div>
                              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest block font-mono mb-1.5">
                                Recommended For
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {item.bestFor.map((target, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="inline-flex text-[9px] text-[#050A5C] bg-[#050A5C]/5 px-2 py-0.5 rounded"
                                  >
                                    {target}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Products */}
                        {item.foundIn.length > 0 && (
                          <div className="pt-3 border-t border-slate-100">
                            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest block font-mono mb-1.5">
                              Found In Products
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {item.foundIn.map((prod, pIdx) => (
                                <span
                                  key={pIdx}
                                  className="text-[9px] font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded"
                                >
                                  {prod}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="text-[8px] text-slate-400 italic pt-2">
                          * Thông tin tham khảo khoa học về mỹ phẩm.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* ─── BOTTOM STRIP: Clinical Formula Logic ──────────────────────── */}
        <div className="mt-20 pt-16 border-t border-[#E2E8F0]">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h3 className="text-xl font-light text-[#050A5C] tracking-wide mb-3">
              {logicTitle}
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed max-w-xl mx-auto">
              {logicDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm text-center">
              <span className="text-xs font-semibold text-slate-400 tracking-wider block font-mono">01 / SIGNAL</span>
              <h4 className="text-sm font-bold text-[#050A5C] mt-2 mb-2">Renewal Signal</h4>
              <p className="text-[10px] text-slate-400 font-light leading-relaxed">Khởi động tín hiệu tái tạo cấu trúc biểu bì, làm mịn nếp nhăn mảnh.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm text-center">
              <span className="text-xs font-semibold text-slate-400 tracking-wider block font-mono">02 / HYDRATE</span>
              <h4 className="text-sm font-bold text-[#050A5C] mt-2 mb-2">Hydration Layer</h4>
              <p className="text-[10px] text-slate-400 font-light leading-relaxed">Cấp nước đa chiều sâu biểu bì, duy trì lớp màng căng bóng mịn màng.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm text-center">
              <span className="text-xs font-semibold text-slate-400 tracking-wider block font-mono">03 / CALM</span>
              <h4 className="text-sm font-bold text-[#050A5C] mt-2 mb-2">Barrier Support</h4>
              <p className="text-[10px] text-slate-400 font-light leading-relaxed">Làm dịu và đẩy nhanh chu kỳ hồi phục lớp sừng biểu bì thương tổn.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm text-center">
              <span className="text-xs font-semibold text-slate-400 tracking-wider block font-mono">04 / SHIELD</span>
              <h4 className="text-sm font-bold text-[#050A5C] mt-2 mb-2">Protection Shield</h4>
              <p className="text-[10px] text-slate-400 font-light leading-relaxed">Lớp bảo vệ lai cơ học và hóa học lọc tia cực tím và tăng đề kháng da.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
