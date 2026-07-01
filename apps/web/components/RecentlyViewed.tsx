"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@repo/types";
import { History, Trash2 } from "lucide-react";
import ProductSlider from "./ProductSlider";

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecentlyViewed = async () => {
    try {
      const viewedIds = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      if (viewedIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Take last 4 items viewed
      const idsQuery = viewedIds.slice(-4).reverse().join(",");
      const res = await fetch(`/api/products?ids=${idsQuery}`);
      if (res.ok) {
        setProducts(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch recently viewed details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentlyViewed();

    // Listen to custom updates if items change
    window.addEventListener("recently-viewed-change", loadRecentlyViewed);
    return () => {
      window.removeEventListener("recently-viewed-change", loadRecentlyViewed);
    };
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("recentlyViewed");
    setProducts([]);
  };

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <History className="h-4.5 w-4.5 text-primary" />
          Recently Viewed Products
        </h3>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      <ProductSlider products={products} ariaLabel="Recently viewed products" />
    </section>
  );
}
