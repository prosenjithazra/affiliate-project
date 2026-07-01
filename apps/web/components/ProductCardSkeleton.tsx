import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="h-full flex flex-col rounded-lg bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/70 overflow-hidden shadow-sm">
      {/* ── Image Skeleton ───────────────────────────────── */}
      <div className="relative aspect-[4/3] w-full animate-skeleton" />

      {/* ── Info Skeleton ────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3 gap-2.5">
        {/* Brand placeholder */}
        <div className="h-2.5 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-skeleton" />

        {/* Title placeholders (2 lines) */}
        <div className="space-y-1.5">
          <div className="h-3 w-11/12 rounded bg-slate-200 dark:bg-slate-800 animate-skeleton" />
          <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-800 animate-skeleton" />
        </div>

        {/* Rating row placeholder */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-10 rounded bg-slate-200 dark:bg-slate-800 animate-skeleton" />
          <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-skeleton" />
        </div>

        {/* Description line placeholder */}
        <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-slate-800 animate-skeleton mt-1" />

        {/* ── Price + CTA Skeleton ─────────────────────────── */}
        <div className="pt-3 mt-auto border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-2.5">
          {/* Price block placeholders */}
          <div className="flex items-baseline gap-2">
            <div className="h-5 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-skeleton" />
            <div className="h-3.5 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-skeleton" />
          </div>

          {/* CTA button placeholder */}
          <div className="w-full h-8 sm:h-9 rounded-md bg-slate-200 dark:bg-slate-800 animate-skeleton" />
        </div>
      </div>
    </div>
  );
}
