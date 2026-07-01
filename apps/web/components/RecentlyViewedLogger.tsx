"use client";

import { useEffect } from "react";

export default function RecentlyViewedLogger({ productId }: { productId: string }) {
  useEffect(() => {
    try {
      const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const updated = [productId, ...viewed.filter((id: string) => id !== productId)].slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
      window.dispatchEvent(new Event("recently-viewed-change"));
    } catch (e) {
      console.warn("localStorage log failed", e);
    }
  }, [productId]);

  return null;
}
