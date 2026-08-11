'use client';

import React from 'react';
import type { ProductLandingContent } from './product-landing-types';

interface ProductDetailFormProps {
  productDetailForm: NonNullable<ProductLandingContent['productDetailForm']>;
  cosmeticMedia: Record<string, string>;
}

export function ProductDetailForm({ productDetailForm, cosmeticMedia }: ProductDetailFormProps) {
  return (
    <section className="bg-slate-50 py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Optional Offline Experience Bridge */}
        {(productDetailForm.offlineTitle || productDetailForm.offlineMediaSlot) && (
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row gap-8 items-center bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {productDetailForm.offlineMediaSlot && (
              <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-[400px] relative bg-slate-100 flex items-center justify-center shrink-0">
                {cosmeticMedia[productDetailForm.offlineMediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.offlineExperience ? (
                  <img
                    src={cosmeticMedia[productDetailForm.offlineMediaSlot as keyof typeof cosmeticMedia] || cosmeticMedia.offlineExperience}
                    alt={productDetailForm.offlineTitle || 'Offline Experience'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-center text-slate-400 p-6 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 mb-3 bg-slate-200 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs uppercase tracking-wider font-semibold">Media Unassigned</span>
                    <span className="text-[10px] mt-1 break-all px-4">{productDetailForm.offlineMediaSlot}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="p-8 md:p-12 space-y-4 w-full md:w-1/2">
              <h3 className="text-xl md:text-2xl font-light text-[#050A5C] font-serif leading-tight">
                {productDetailForm.offlineTitle}
              </h3>
              {productDetailForm.offlineDescription && (
                <p className="text-sm text-slate-500 font-light leading-relaxed">
                  {productDetailForm.offlineDescription}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Product Detail Main Block */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          
          {/* Header */}
          <div className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/50">
            {productDetailForm.eyebrow && (
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase block mb-3">
                {productDetailForm.eyebrow}
              </span>
            )}
            {productDetailForm.title && (
              <h2 className="text-2xl md:text-3xl font-light text-[#050A5C] tracking-tight font-serif">
                {productDetailForm.title}
              </h2>
            )}
            {productDetailForm.description && (
              <p className="mt-3 text-sm text-slate-500 font-light leading-relaxed">
                {productDetailForm.description}
              </p>
            )}
          </div>

          {/* Info Grid */}
          {productDetailForm.info && productDetailForm.info.length > 0 && (
            <div className="border-b border-slate-100">
              {productDetailForm.info.map((item, idx) => (
                <div key={idx} className={`flex flex-col sm:flex-row ${idx !== productDetailForm.info!.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  <div className="w-full sm:w-1/3 p-4 sm:p-6 bg-slate-50/50 sm:border-r sm:border-slate-50 flex items-center">
                    <span className="text-xs font-bold text-[#050A5C] uppercase tracking-wider">{item.label}</span>
                  </div>
                  <div className="w-full sm:w-2/3 p-4 sm:p-6 flex items-center">
                    <span className="text-sm text-slate-600 font-light leading-relaxed">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-8 md:p-12 space-y-12">
            {/* Ingredients */}
            {productDetailForm.ingredientGroups && productDetailForm.ingredientGroups.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-[#050A5C] uppercase tracking-wider border-b border-slate-200 pb-2">
                  Thành phần (Ingredients)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {productDetailForm.ingredientGroups.map((group, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[13px] font-bold text-[#050A5C]">{group.title}</span>
                        {group.subtitle && (
                          <span className="text-[11px] text-slate-400 font-mono">{group.subtitle}</span>
                        )}
                      </div>
                      <p className="text-[13px] text-slate-500 font-light leading-relaxed break-words whitespace-pre-wrap">
                        {group.ingredients}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cautions */}
            {productDetailForm.cautions && productDetailForm.cautions.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-red-700/80 uppercase tracking-wider border-b border-red-100 pb-2">
                  Lưu ý khi sử dụng (Cautions)
                </h4>
                <ul className="space-y-2">
                  {productDetailForm.cautions.map((caution, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[13px] text-slate-600 font-light leading-relaxed">
                      <span className="text-red-400 mt-1 shrink-0">•</span>
                      <span>{caution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Storage & Quality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
              {productDetailForm.storage && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bảo quản (Storage)</h4>
                  <p className="text-[13px] text-slate-600 font-light leading-relaxed">
                    {productDetailForm.storage}
                  </p>
                </div>
              )}
              {productDetailForm.qualityGuarantee && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bảo đảm chất lượng</h4>
                  <p className="text-[13px] text-slate-600 font-light leading-relaxed">
                    {productDetailForm.qualityGuarantee}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
