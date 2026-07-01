"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@repo/ui";
import { Twitter, Facebook, Instagram, Mail, ArrowRight, Shield, Star } from "lucide-react";

export default function Footer() {
  const { success } = useToast();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      success("Thank you! You'll receive our next deal alert.", "Subscribed ✓");
      setEmail("");
    }
  };

  return (
    <footer className="mt-6 border-t border-slate-200/50 dark:border-slate-800/50">

      {/* ── Upper Links Area ─────────────────────────────── */}
      <div className="bg-[#F8FAFC] dark:bg-slate-900 text-slate-700 dark:text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">

            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1 space-y-4">
              <Link href="/" className="inline-block">
                <img
                  src="/logoNewUpdate.png"
                  alt="ShopZone"
                  className="h-16 w-auto object-contain dark:brightness-0 dark:invert"
                />
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                Handpicked consumer tech recommendations, product comparisons, and top deals reviewed by our expert team.
              </p>
              <div className="flex gap-3">
                {[
                  { Icon: Twitter, href: "#" },
                  { Icon: Facebook, href: "#" },
                  { Icon: Instagram, href: "#" },
                ].map(({ Icon, href }) => (
                  <a
                    key={href + Icon.name}
                    href={href}
                    className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-450 hover:text-primary hover:border-primary/40 transition-all"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h4 className="text-[11px] uppercase font-extrabold tracking-widest text-slate-900 dark:text-white">Categories</h4>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
                {["Electronics", "Gaming Gear", "Fashion Apparel", "Fitness Equipment", "Beauty", "Travel Gear"].map((item) => (
                  <li key={item}>
                    <Link href={`/search?query=${item.toLowerCase()}`} className="hover:text-primary transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h4 className="text-[11px] uppercase font-extrabold tracking-widest text-slate-900 dark:text-white">Company</h4>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Contact Support", href: "/contact" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Affiliate Disclosure", href: "/about" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="text-[11px] uppercase font-extrabold tracking-widest text-slate-900 dark:text-white">Deal Alerts</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Get weekly price drops and exclusive coupon codes in your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden focus-within:border-primary/50 transition-colors">
                  <Mail className="h-3.5 w-3.5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 h-9 px-2 bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                  />
                  <button type="submit" className="h-9 px-3 bg-accent hover:bg-accent-hover text-white transition-colors shrink-0">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <Shield className="h-3 w-3 text-emerald-500" /> Verified Products
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <Star className="h-3 w-3 text-amber-500" /> Expert Reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-450 border-t border-slate-200 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:py-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-[11px]">
          <p>© 2026 ShopZone || All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
