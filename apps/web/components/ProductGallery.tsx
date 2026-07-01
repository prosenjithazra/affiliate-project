"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductImage } from "@repo/types";

interface ProductGalleryProps {
  images: ProductImage[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transform: "scale(1)",
    transformOrigin: "center center",
  });

  const activeImage = images[activeIdx]?.url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800";

  // Hover zoom math
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transform: "scale(1.5)",
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center center",
    });
  };

  return (
    <div className="space-y-4">
      {/* Big Display Image */}
      <div
        className="relative h-72 sm:h-[420px] lg:h-[450px] w-full rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/30 overflow-hidden cursor-crosshair group shadow-sm"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            src={activeImage}
            alt="Product Preview"
            style={zoomStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-cover transition-transform duration-75"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-1">
          {images.map((img, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={img.id || idx}
                onClick={() => setActiveIdx(idx)}
                className={`h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 transition-all ${
                  isActive
                    ? "border-primary scale-[1.03] shadow-md shadow-primary/10"
                    : "border-slate-200/60 dark:border-slate-800/60 hover:border-slate-400 opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
