"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Heart, ExternalLink } from "lucide-react";
import { useToast } from "@repo/ui";
import { Product } from "@repo/types";
import { formatPrice, calculateDiscount } from "@repo/utils";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { success } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setIsWishlisted(wishlist.includes(product.id));
    } catch {}
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      let updated: string[];
      if (wishlist.includes(product.id)) {
        updated = wishlist.filter((id: string) => id !== product.id);
        setIsWishlisted(false);
        success(`${product.name} removed from wishlist.`, "Removed");
      } else {
        updated = [...wishlist, product.id];
        setIsWishlisted(true);
        success(`${product.name} added to wishlist!`, "Saved ♥");
      }
      localStorage.setItem("wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("wishlist-change"));
    } catch {}
  };

  const discount = calculateDiscount(product.price, product.oldPrice);
  const primaryImage =
    !imgError && product.images?.[0]?.url
      ? product.images[0].url
      : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="h-full"
    >
      <Link href={`/products/${product.slug}`} className="block h-full group">
        <div className="h-full flex flex-col rounded-lg bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/70 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-200">

          {/* ── Image ───────────────────────────────────── */}
          <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 aspect-[4/3]">
            <img
              src={primaryImage}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              loading="lazy"
            />

            {/* Discount badge */}
            {discount > 0 && (
              <span className="absolute top-2.5 right-2.5 rounded-sm bg-accent text-white text-[10px] font-black px-2 py-0.5 tracking-wide">
                {discount}% OFF
              </span>
            )}

            {/* Wishlist button */}
            <button
              onClick={toggleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute top-2.5 left-2.5 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 shadow border border-slate-100 dark:border-slate-800 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isWishlisted
                    ? "fill-rose-500 text-rose-500"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              />
            </button>

            <span className="absolute bottom-2.5 left-2.5 max-w-[calc(100%-1.25rem)] truncate rounded-sm bg-white/90 text-primary text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow-sm">
              {product.category?.name}
            </span>
          </div>

          {/* ── Info ────────────────────────────────────── */}
          <div className="flex flex-col flex-1 p-2.5 sm:p-3 gap-2">
            {/* Brand */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 line-clamp-1">
              {product.brand?.name || product.category?.name}
            </p>

            {/* Name */}
            <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating row */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5">
                {product.rating.toFixed(1)}
                <Star className="h-2.5 w-2.5 fill-white" />
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                ({Math.floor(product.rating * 22)} reviews)
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed flex-1">
              {product.shortDescription}
            </p>

            {/* ── Price + CTA ─────────────────────────────── */}
            <div className="pt-3 mt-auto border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-2">
              {/* Price block */}
              <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-none">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                    {discount}% off
                  </span>
                )}
              </div>

              {/* Full-width CTA button */}
              <button className="w-full h-8 sm:h-9 flex items-center justify-center gap-1.5 rounded-md bg-accent hover:bg-accent-hover text-white text-[11px] sm:text-xs font-extrabold transition-all duration-200 active:scale-[0.98]">
                <ExternalLink className="h-3.5 w-3.5" />
                View Details
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
