'use client';

import React from 'react';
import type { ProductLandingContent } from './product-landing-types';

interface ProductDetailFormProps {
  productDetailForm: NonNullable<ProductLandingContent['productDetailForm']>;
  cosmeticMedia: Record<string, string>;
}

export function ProductDetailForm({ productDetailForm, cosmeticMedia }: ProductDetailFormProps) {
  
  

  const legalInfoRows = Array.isArray(productDetailForm.legalInfo) && productDetailForm.legalInfo.length > 0
    ? productDetailForm.legalInfo.filter(item => item && item.label && item.value)
    : Array.isArray(productDetailForm.info)
      ? productDetailForm.info.map(i => ({ label: i.label || '', value: i.value || '', highlight: false }))
      : [];

  const productItemsList = Array.isArray(productDetailForm.productItems) && productDetailForm.productItems.length > 0
    ? productDetailForm.productItems.filter(item => item && item.name)
    : Array.isArray(productDetailForm.ingredientGroups)
      ? productDetailForm.ingredientGroups.map(g => ({
          name: g.title || '',
          volume: undefined,
          functionClaim: g.subtitle || '',
          ingredients: g.ingredients || ''
        }))
      : [];
      
  const cautionsList = Array.isArray(productDetailForm.cautions)
    ? productDetailForm.cautions.filter(Boolean)
    : [];
      
  const dataSource = (Array.isArray(productDetailForm.legalInfo) && productDetailForm.legalInfo.length > 0) ? "legalInfo" : "legacy";

  // Visibility Flags with defaults
  const showDescription = productDetailForm.showDescription ?? true;
  const showLegalInfo = productDetailForm.showLegalInfo ?? true;
  const showProductItems = productDetailForm.showProductItems ?? true;
  const showIngredients = productDetailForm.showIngredients ?? true;
  const showCautions = productDetailForm.showCautions ?? true;
  const showStorage = productDetailForm.showStorage ?? true;
  const showQualityGuarantee = productDetailForm.showQualityGuarantee ?? true;

  return (
    <section className="bg-slate-50 py-16 md:py-24 px-4 sm:px-6"
      data-product-detail-source={dataSource}
      data-product-detail-legal-count={legalInfoRows.length}
      data-product-detail-product-items-count={productItemsList.length}
      data-luminous-product-detail-version="legal-2d-v2"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          
          {/* Header */}
          <div className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/50">
            {productDetailForm.eyebrow && (
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase block mb-3">
                {productDetailForm.eyebrow}
              </span>
            )}
            {productDetailForm.title && (
              <h2 className="text-2xl md:text-3xl text-[#050A5C] cosmetic-heading-soft leading-[1.08]">
                {productDetailForm.title}
              </h2>
            )}
            {showDescription && productDetailForm.description && (
              <p className="mt-3 text-sm text-slate-500 font-light leading-relaxed">
                {productDetailForm.description}
              </p>
            )}
          </div>

          {/* Legal Info Grid */}
          {showLegalInfo && legalInfoRows.length > 0 && (
            <div className="border-b border-slate-100">
              {legalInfoRows.map((item, idx) => (
                <div key={idx} className={`flex flex-col sm:flex-row ${idx !== legalInfoRows.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  <div className={`w-full sm:w-1/3 p-4 sm:px-8 sm:py-5 flex items-center ${item.highlight ? 'bg-[#050A5C]/5' : 'bg-slate-50/50'} sm:border-r sm:border-slate-50`}>
                    <span className="text-[11px] sm:text-xs font-bold text-[#050A5C] uppercase tracking-wider">{item.label}</span>
                  </div>
                  <div className={`w-full sm:w-2/3 p-4 sm:px-8 sm:py-5 flex items-center ${item.highlight ? 'bg-[#050A5C]/[0.02]' : ''}`}>
                    <span className="text-[13px] sm:text-sm text-slate-600 font-light leading-relaxed whitespace-pre-wrap">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-8 md:p-12 space-y-12">
            {/* Product Items */}
            {showProductItems && productItemsList.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {productItemsList.map((item, idx) => (
                    <div key={idx} className="space-y-4 bg-slate-50/30 p-6 rounded-xl border border-slate-100">
                      <div>
                        <h4 className="text-[15px] font-bold text-[#050A5C]">{item.name}</h4>
                        {item.volume && (
                          <span className="inline-block mt-2 text-[11px] font-bold bg-[#050A5C]/10 text-[#050A5C] px-2 py-0.5 rounded-sm">
                            {item.volume}
                          </span>
                        )}
                      </div>
                      
                      {item.functionClaim && (
                        <p className="text-[13px] text-slate-600 font-medium">
                          {item.functionClaim}
                        </p>
                      )}

                      {showIngredients && item.ingredients && (
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                          <summary className="flex items-center gap-2 cursor-pointer text-[12px] font-bold text-slate-400 uppercase tracking-wider hover:text-[#050A5C] transition-colors select-none">
                            <span>Th�nh ph?n (Ingredients)</span>
                            <span className="text-[10px] bg-slate-200 text-slate-500 rounded-full w-4 h-4 flex items-center justify-center group-open:rotate-180 transition-transform">
                              ?
                            </span>
                          </summary>
                          <div className="mt-3 text-[13px] text-slate-500 font-light leading-relaxed break-words whitespace-pre-wrap pl-2 border-l-2 border-slate-200">
                            {item.ingredients}
                          </div>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cautions */}
            {showCautions && cautionsList.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[13px] font-bold text-[#b91c1c] uppercase tracking-wider border-b border-red-100 pb-2">
                  Luu � khi s? d?ng (Cautions)
                </h4>
                <ul className="space-y-3">
                  {cautionsList.map((caution, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[13px] sm:text-sm text-slate-600 font-light leading-relaxed">
                      <span className="text-[#b91c1c] mt-1 shrink-0 text-lg leading-none">�</span>
                      <span>{caution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Storage & Quality Guarantee */}
            {(showStorage || showQualityGuarantee) && (productDetailForm.storage || productDetailForm.qualityGuarantee) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                {showStorage && productDetailForm.storage && (
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">B?o qu?n (Storage)</h4>
                    <p className="text-[13px] sm:text-sm text-slate-600 font-light leading-relaxed whitespace-pre-wrap">
                      {productDetailForm.storage}
                    </p>
                  </div>
                )}
                {showQualityGuarantee && productDetailForm.qualityGuarantee && (
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">B?o d?m ch?t lu?ng</h4>
                    <p className="text-[13px] sm:text-sm text-slate-600 font-light leading-relaxed whitespace-pre-wrap">
                      {productDetailForm.qualityGuarantee}
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
