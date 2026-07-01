import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="relative flex flex-col items-center gap-6">
        {/* Glow Ring behind the logo */}
        <div className="absolute h-28 w-28 rounded-full bg-orange-500/20 dark:bg-orange-500/10 blur-xl animate-pulse-ring" />
        
        {/* Pulsing Logo Container */}
        <div className="relative animate-pulse">
          <img
            src="/logoNewUpdate.png"
            alt="ShopZone Loading..."
            className="h-16 sm:h-20 w-auto object-contain dark:brightness-0 dark:invert transition-all duration-300"
          />
        </div>

        {/* Custom Premium Shimmer Loading Line */}
        <div className="w-40 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-shimmer-line" />
        </div>
      </div>
    </div>
  );
}
