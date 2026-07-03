"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@repo/ui";
import * as LucideIcons from "lucide-react";
import {
  Search,
  Sun,
  Moon,
  Heart,
  ShoppingBag,
  Home,
  Grid3X3,
  Flame,
  ChevronDown,
  Phone,
  List,
  BookOpen,
} from "lucide-react";
import { Category } from "@repo/types";

type LucideComponent = React.ElementType<{ className?: string }>;

const isLucideComponent = (value: unknown): value is LucideComponent => {
  return (
    typeof value === "function" ||
    (typeof value === "object" &&
      value !== null &&
      "render" in value &&
      typeof (value as { render?: unknown }).render === "function")
  );
};

const getLucideIcon = (name?: string): LucideComponent => {
  const icon = name ? (LucideIcons as Record<string, unknown>)[name] : null;
  return isLucideComponent(icon) ? icon : ShoppingBag;
};

const CategoryIcon = ({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) => {
  const Icon = getLucideIcon(name);
  return <Icon className={className} />;
};

export default function Navbar() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* ── Main Header ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 shadow-sm border-b border-slate-100 dark:border-slate-900 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-950/80">
        {/* Top bar (Logo & Actions & Search) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-6 py-2.5 sm:min-h-16">
            {/* Row 1: Logo & Actions on Mobile */}
            <div className="flex items-center justify-between w-full sm:w-auto shrink-0">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center shrink-0 min-w-[116px]"
              >
                <img
                  src="/logoNewUpdate.png"
                  alt="ShopZone"
                  className="h-14 sm:h-14 lg:h-16 w-auto max-w-[180px] lg:max-w-[200px] object-contain dark:brightness-0 dark:invert"
                />
              </Link>

              {/* Actions visible only on Mobile (right-aligned in logo row) */}
              <div className="flex sm:hidden items-center gap-1">
                <button
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                  className="h-9 w-9 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  aria-label="Toggle theme"
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="h-4.5 w-4.5" />
                  ) : (
                    <Moon className="h-4.5 w-4.5" />
                  )}
                </button>
                <Link
                  href="/search"
                  className="h-9 w-9 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors relative"
                  aria-label="Wishlist"
                >
                  <Heart className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>

            {/* Search bar — Center expand, styled premium */}
            <form
              onSubmit={handleSearch}
              className="hidden sm:block w-full sm:flex-1 sm:max-w-2xl sm:mx-auto min-w-0"
            >
              <div
                className={`flex items-center bg-slate-50 dark:bg-slate-900/60 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 ${
                  searchFocused
                    ? "border-orange-500 dark:border-orange-500 bg-white dark:bg-slate-900"
                    : "hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search for products, brands and more..."
                  className="flex-1 h-9 sm:h-10 min-w-0 px-4 sm:px-5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="h-9 sm:h-10 w-11 sm:w-12 flex items-center justify-center bg-orange-600 text-white hover:bg-orange-700 transition-colors shrink-0 rounded-r-full font-bold"
                  aria-label="Search"
                >
                  <Search className="h-4 sm:h-4.5 w-4 sm:w-4.5" />
                </button>
              </div>
            </form>

            {/* Desktop Actions Row */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0 ml-auto">
              <button
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="h-9 w-9 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4.5 w-4.5" />
                ) : (
                  <Moon className="h-4.5 w-4.5" />
                )}
              </button>

              <Link
                href="/search"
                className="h-9 w-9 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Desktop Category Nav Bar (Blue Ocean Premium style) ──────────────── */}
        <div className="hidden sm:block border-t border-slate-100 dark:border-slate-900 bg-blue-700 dark:bg-slate-900/90 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-x-2 min-h-11 overflow-visible">
            {/* Left side: Categories drop button */}
            <div className="relative group self-stretch shrink-0">
              <button className="bg-orange-600 text-white px-3 lg:px-5 h-full min-h-11 flex items-center gap-2 text-[11px] lg:text-xs font-black uppercase tracking-wider transition-colors hover:bg-orange-700">
                <List className="h-4 w-4" />
                Browse Categories
                <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 w-60 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 shadow-xl py-1.5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 rounded-b-xl overflow-hidden">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/search?categoryId=${cat.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                  >
                    <span className="text-slate-400 dark:text-slate-500">
                      <CategoryIcon name={cat.icon} className="h-4 w-4" />
                    </span>
                    <span className="capitalize">{cat.name}</span>
                  </Link>
                ))}
                <div className="border-t border-slate-100 dark:border-slate-900 my-1" />
                <Link
                  href="/search"
                  className="flex items-center justify-between px-4 py-2.5 text-xs font-black text-orange-600 dark:text-orange-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  <span>View All Categories</span>
                  <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
                </Link>
              </div>
            </div>

            {/* Middle: Premium nav links with sliding highlights */}
            <nav className="flex flex-wrap items-center self-stretch text-[11px] lg:text-xs font-black text-white/90 gap-0.5 lg:gap-1">
              {[
                { href: "/", label: "Home" },
                { href: "/search", label: "Catalog" },
                { href: "/deals", label: "Top Deals" },
                { href: "/blog", label: "Buying Guides" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-2.5 lg:px-4 min-h-11 flex items-center hover:text-white relative transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 inset-x-4 h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </Link>
              ))}
            </nav>

            {/* Right side: hotline helpdesk */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-white/90 shrink-0 ml-auto">
              <Phone className="h-3.5 w-3.5 text-orange-400" />
              <span>
                Hotline: <strong className="text-white">+1-800-SHOPZONE</strong>
              </span>
            </div>
          </div>
        </div>

        {/* ── Mobile Categories bar ── */}
        <div className="sm:hidden border-b border-blue-850 bg-blue-700 shadow-sm">
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 py-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?categoryId=${cat.id}`}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold text-white transition-colors hover:bg-white/20"
              >
                <span className="text-orange-300">
                  <CategoryIcon name={cat.icon} className="h-3.5 w-3.5" />
                </span>
                <span className="capitalize">{cat.name}</span>
              </Link>
            ))}
            <Link
              href="/search"
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/30 px-3 py-1.5 text-[11px] font-extrabold text-white transition-colors hover:bg-orange-500/40"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-orange-300" />
              All Deals
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Navigation Bar (Floating Premium) ── */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 border-t border-slate-200/60 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/85 dark:supports-[backdrop-filter]:bg-slate-950/85 shadow-lg">
        <div className="grid grid-cols-4 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)]">
          {[
            {
              href: "/",
              label: "Home",
              icon: <Home className="h-4.5 w-4.5" />,
            },
            {
              href: "/search",
              label: "Catalog",
              icon: <Grid3X3 className="h-4.5 w-4.5" />,
            },
            {
              href: "/deals",
              label: "Deals",
              icon: <Flame className="h-4.5 w-4.5" />,
            },
            {
              href: "/blog",
              label: "Blog",
              icon: <BookOpen className="h-4.5 w-4.5" />,
            },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-black text-slate-500 dark:text-slate-400 transition-colors hover:text-orange-600 py-2"
            >
              <span className="text-orange-600 dark:text-orange-500">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
