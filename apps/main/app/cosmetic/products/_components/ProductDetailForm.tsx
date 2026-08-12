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

  const isMfdsRow = (item: { label: string; value: string }) => {
    const l = (item.label || '').toLowerCase();
    return l.includes('mfds') || l.includes('phê duyệt') || l.includes('phe duyeth') || l.includes('tình trạng');
  };

  return (
    <section className="bg-slate-50/50 py-12 md:py-20 px-4 sm:px-6"
      data-product-detail-source={dataSource}
      data-product-detail-legal-count={legalInfoRows.length}
      data-product-detail-product-items-count={productItemsList.length}
      data-luminous-product-detail-version="legal-2d-polished"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-white border border-[#D8DEEA] rounded-[22px] overflow-hidden shadow-[0_30px_90px_rgba(5,10,92,0.08)]">
          
          {/* Header */}
          <div className="p-6 sm:p-8 md:p-12 border-b border-[#D8DEEA] bg-slate-50/40">
            {productDetailForm.eyebrow && (
              <span className="text-xs font-bold text-[#050A5C]/60 tracking-[0.2em] uppercase block mb-3">
                {productDetailForm.eyebrow}
              </span>
            )}
            {productDetailForm.title && (
              <h2 className="text-2xl md:text-3xl text-[#050A5C] cosmetic-heading-soft leading-[1.1]">
                {productDetailForm.title}
              </h2>
            )}
            {showDescription && productDetailForm.description && (
              <p className="mt-3 text-sm md:text-base text-slate-600 font-light leading-7 max-w-[760px]">
                {productDetailForm.description}
              </p>
            )}
          </div>

          {/* Legal Info Grid */}
          {showLegalInfo && legalInfoRows.length > 0 && (
            <div className="border-b border-[#D8DEEA]">
              {legalInfoRows.map((item, idx) => {
                if (isMfdsRow(item)) {
                  return (
                    <div key={idx} className="bg-[#F7F8FC] border-y border-[#D8DEEA] border-l-4 border-l-[#050A5C] px-6 md:px-8 py-6 my-1">
                      <span className="text-xs font-bold text-[#050A5C] uppercase tracking-[0.08em] block mb-2">
                        {item.label}
                      </span>
                      <span className="text-sm md:text-[15px] leading-7 text-slate-800 font-medium whitespace-pre-wrap break-words">
                        {item.value}
                      </span>
                    </div>
                  );
                }

                return (
                  <div 
                    key={idx} 
                    className={`grid grid-cols-1 md:grid-cols-[0.32fr_0.68fr] border-b border-slate-100 px-6 md:px-8 py-4 md:py-5 transition-colors border-l-4 ${
                      item.highlight ? 'bg-[#F8FAFC] border-l-[#D8A13A]' : 'bg-white border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center py-1 md:py-0 gap-2">
                      {item.highlight && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D8A13A] inline-block shrink-0" title="Thông tin trọng tâm" />
                      )}
                      <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.08em] text-[#050A5C]">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center py-1 md:py-0">
                      <span className="text-sm md:text-[15px] leading-7 text-slate-700 font-light whitespace-pre-wrap break-words">
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-6 sm:p-8 md:p-12 space-y-12">
            {/* Product Items */}
            {showProductItems && productItemsList.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {productItemsList.map((item, idx) => (
                    <div key={idx} className="border border-[#D8DEEA] rounded-2xl bg-white shadow-sm p-6 sm:p-8 flex flex-col justify-between space-y-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold tracking-widest text-[#D8A13A] uppercase">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          {item.volume && (
                            <span className="text-xs font-bold bg-[#050A5C]/5 border border-[#050A5C]/15 text-[#050A5C] px-3 py-1 rounded-full">
                              {item.volume}
                            </span>
                          )}
                        </div>
                        <h4 className="text-base md:text-lg font-semibold text-[#050A5C] leading-snug">
                          {item.name}
                        </h4>
                        {item.functionClaim && (
                          <div className="bg-[#F8FAFC] border-l-2 border-[#D8A13A] px-4 py-3 text-sm leading-6 text-slate-700 font-medium rounded-r-md">
                            {item.functionClaim}
                          </div>
                        )}
                      </div>

                      {showIngredients && item.ingredients && (
                        <details className="group [&_summary::-webkit-details-marker]:hidden border-t border-slate-100 pt-4">
                          <summary className="flex items-center justify-between cursor-pointer text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-[#050A5C] transition-colors select-none py-1">
                            <span>Xem thành phần đầy đủ</span>
                            <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200 text-[10px]">
                              ▼
                            </span>
                          </summary>
                          <div className="mt-3 p-4 bg-[#F8FAFC] rounded-xl border border-slate-100 text-[12px] md:text-[13px] text-slate-600 font-light leading-[1.8] break-words whitespace-pre-wrap">
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
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs uppercase tracking-[0.12em] text-red-600 font-bold flex items-center gap-2 border-b border-red-100 pb-3">
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block shrink-0"></span>
                  Lưu ý khi sử dụng (Cautions)
                </h4>
                <ul className="space-y-3 pt-1">
                  {cautionsList.map((caution, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm leading-7 text-slate-700 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0 inline-block"></span>
                      <span className="whitespace-normal break-words">{caution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Storage & Quality Guarantee */}
            {(showStorage || showQualityGuarantee) && (productDetailForm.storage || productDetailForm.qualityGuarantee) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                {showStorage && productDetailForm.storage && (
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 md:p-6 space-y-2">
                    <h4 className="text-[11px] uppercase tracking-[0.1em] text-[#050A5C] font-bold">
                      Bảo quản (Storage)
                    </h4>
                    <p className="text-sm leading-7 text-slate-700 font-light whitespace-pre-wrap break-words">
                      {productDetailForm.storage}
                    </p>
                  </div>
                )}
                {showQualityGuarantee && productDetailForm.qualityGuarantee && (
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 md:p-6 space-y-2">
                    <h4 className="text-[11px] uppercase tracking-[0.1em] text-[#050A5C] font-bold">
                      Bảo đảm chất lượng
                    </h4>
                    <p className="text-sm leading-7 text-slate-700 font-light whitespace-pre-wrap break-words">
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
