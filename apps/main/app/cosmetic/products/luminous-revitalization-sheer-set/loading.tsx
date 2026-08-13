export default function LuminousProductLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Skeleton Hero - Navy Blue to match final layout */}
      <div className="relative w-full overflow-hidden bg-[#050A5C] flex flex-col justify-end px-5 pb-14 pt-32 min-h-[760px] md:min-h-[840px] md:flex-row md:items-center md:justify-start md:px-12 md:py-28 lg:px-20">
        
        {/* Abstract media glow placeholder */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#050A5C] via-[#0A1172] to-[#101A8C]" />
        
        {/* Soft skeleton content area */}
        <div className="relative z-10 max-w-[620px] w-full space-y-6">
          {/* H1 Placeholder */}
          <div className="h-16 md:h-20 w-[85%] bg-white/10 rounded-sm animate-pulse" />
          <div className="h-16 md:h-20 w-[60%] bg-white/10 rounded-sm animate-pulse mt-2" />
          
          {/* Subheadline Placeholder */}
          <div className="h-6 w-[70%] bg-white/10 rounded-sm animate-pulse mt-6" />
          
          {/* Description Placeholder */}
          <div className="space-y-3 mt-6 w-full max-w-[560px]">
            <div className="h-4 w-full bg-white/5 rounded-sm animate-pulse" />
            <div className="h-4 w-[90%] bg-white/5 rounded-sm animate-pulse" />
            <div className="h-4 w-[80%] bg-white/5 rounded-sm animate-pulse" />
          </div>

          {/* CTAs Placeholder */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6">
            <div className="h-[52px] md:h-[56px] w-[220px] bg-white/20 rounded-[2px] animate-pulse" />
            <div className="h-[52px] md:h-[56px] w-[220px] border border-white/20 rounded-[2px] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
