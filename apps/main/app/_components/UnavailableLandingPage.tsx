import React from 'react';
import Link from 'next/link';
import { SiteFooter } from '@vavaw/ui';

export type UnavailableReason =
  | "coming-soon"
  | "maintenance"
  | "not-found"
  | "private"
  | "default";

export type UnavailableLandingPageProps = {
  reason?: UnavailableReason;
  fromPath?: string;
};

const REASON_COPY: Record<UnavailableReason, { title: string; description: string }> = {
  "coming-soon": {
    title: "Trang này đang được hoàn thiện",
    description: "Nội dung đang được chuẩn bị để ra mắt với trải nghiệm chỉn chu hơn."
  },
  "maintenance": {
    title: "VAVAW đang cập nhật hệ thống",
    description: "Một số nội dung có thể tạm thời chưa khả dụng trong khi hệ thống được đồng bộ."
  },
  "not-found": {
    title: "Không tìm thấy trang bạn yêu cầu",
    description: "Đường dẫn có thể đã thay đổi hoặc nội dung chưa được mở công khai."
  },
  "private": {
    title: "Nội dung này chưa được mở công khai",
    description: "Trang đang trong quá trình kiểm duyệt trước khi ra mắt chính thức."
  },
  "default": {
    title: "Trải nghiệm này đang được hoàn thiện",
    description: "Liên kết bạn vừa mở đang được VAVAW cập nhật nội dung để mang lại trải nghiệm chính xác và chỉn chu hơn."
  }
};

export function UnavailableLandingPage({ reason = "default", fromPath }: UnavailableLandingPageProps) {
  const safeReason: UnavailableReason = REASON_COPY[reason] ? reason : "default";
  const { title, description } = REASON_COPY[safeReason];

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 selection:bg-amber-500/30 flex flex-col justify-between relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(5,10,92,0.7),transparent)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Content Stage */}
      <div className="pt-28 md:pt-36 pb-16 px-4 sm:px-6 w-full max-w-[1120px] mx-auto my-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center p-8 sm:p-12 md:p-14 rounded-[28px] bg-slate-950/70 border border-white/10 backdrop-blur-xl shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          
          {/* Left Column: Copy & Actions */}
          <div className="space-y-6">
            
            {/* Eyebrow & Status Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                VAVAW SYSTEM UPDATE
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 uppercase">
                {safeReason}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-4.5xl text-white cosmetic-heading-soft leading-[1.15]">
              {title}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-[620px]">
              {description}
            </p>

            {/* Support Line */}
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              Bạn có thể quay lại hệ sinh thái VAVAW hoặc để lại yêu cầu tư vấn nếu cần hỗ trợ ngay.
            </p>

            {/* Optional Safe fromPath */}
            {fromPath && (
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] font-mono text-slate-400 break-all">
                <span className="text-slate-500 font-semibold uppercase block mb-1">Đường dẫn yêu cầu</span>
                <span>{fromPath}</span>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 pt-4">
              <a
                href="/"
                className="h-[48px] px-7 flex items-center justify-center bg-[#050A5C] hover:bg-[#101A8C] text-white text-xs font-bold tracking-[0.15em] uppercase transition-colors rounded-md shadow-lg shadow-indigo-950/50"
              >
                Quay về VAVAW
              </a>
              <a
                href="/contact?type=general_inquiry&source=system_update"
                className="h-[48px] px-7 flex items-center justify-center border border-white/20 hover:bg-white/10 text-slate-200 text-xs font-medium tracking-[0.15em] uppercase transition-colors rounded-md"
              >
                Liên hệ tư vấn
              </a>
              <a
                href="/cosmetic"
                className="h-[48px] px-7 flex items-center justify-center border border-transparent hover:border-white/10 text-slate-400 hover:text-white text-xs font-medium tracking-[0.15em] uppercase transition-colors rounded-md"
              >
                Khám phá VAVAW Cosmetic
              </a>
            </div>

          </div>

          {/* Right Column: Abstract System Update Visual */}
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between p-6 sm:p-8">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">
                VAVAW CORE ENGINE
              </span>
            </div>

            {/* Central Orbital Graphic */}
            <div className="my-auto py-6 flex flex-col items-center justify-center relative">
              {/* Outer Glowing Ring */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-amber-500/20 bg-gradient-to-tr from-amber-500/10 to-indigo-500/10 flex items-center justify-center relative shadow-[0_0_50px_rgba(216,161,58,0.15)]">
                {/* Inner Ring */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#D8A13A] animate-ping" />
                </div>
              </div>

              {/* Status Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Đồng bộ nội dung
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Cập nhật CMS
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  VAVAW Ecosystem
                </div>
              </div>
            </div>

            {/* Bottom Footer Line */}
            <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              <span>BẢO MẬT & CHÍNH XÁC</span>
              <span>EST. 2025</span>
            </div>

          </div>

        </div>
      </div>

      {/* Shared Footer */}
      <SiteFooter variant="cosmetic" />
    </div>
  );
}
