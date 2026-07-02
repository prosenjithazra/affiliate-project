"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Award, Clock, ShieldCheck, Truck, RotateCcw,
  Headphones, Star, ArrowRight, Zap, TrendingUp, ChevronRight,
  ShoppingBag, Heart, LayoutGrid, Phone, CheckCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import RecentlyViewed from "../components/RecentlyViewed";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

import { Product, Category } from "@repo/types";

// ── Mock Data Fallbacks (if API fails) ───────────────────────────────────────
const fallbackCategories = [
  { id: "cat-electronics", name: "Electronics", slug: "electronics", icon: "Laptop" },
  { id: "cat-gaming", name: "Gaming Gear", slug: "gaming", icon: "Gamepad2" },
  { id: "cat-fashion", name: "Fashion Apparel", slug: "fashion", icon: "Shirt" },
  { id: "cat-fitness", name: "Fitness Gear", slug: "fitness", icon: "Dumbbell" },
  { id: "cat-travel", name: "Travel Kits", slug: "travel", icon: "Compass" },
] as any as Category[];

const fallbackProducts = [
  {
    id: "prod-macbook",
    name: "Apple MacBook Pro 14 (M3 Max)",
    slug: "macbook-pro-14-m3-max",
    shortDescription: "Mind-blowing speed and display quality with Apple Silicon.",
    price: 3199.99,
    oldPrice: 3499.99,
    rating: 4.8,
    featured: true,
    trending: true,
    topDeal: true,
    affiliateStore: "Amazon",
    affiliateUrl: "https://amazon.com",
    images: [{ url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800" }],
    brand: { name: "Apple" },
    category: { name: "Electronics" },
  },
  {
    id: "prod-headphones",
    name: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5-headphones",
    shortDescription: "Industry leading noise-canceling with extreme comfort.",
    price: 348.0,
    oldPrice: 399.99,
    rating: 4.7,
    featured: true,
    trending: true,
    topDeal: true,
    affiliateStore: "Sony Store",
    affiliateUrl: "https://sony.com",
    images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800" }],
    brand: { name: "Sony" },
    category: { name: "Electronics" },
  },
] as any as Product[];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"featured" | "trending" | "deals">("featured");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch Homepage Data
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/products")
        .then((res) => (res.ok ? res.json() : []))
        .catch(() => fallbackProducts),
      fetch("/api/categories")
        .then((res) => (res.ok ? res.json() : []))
        .catch(() => fallbackCategories),
      fetch("/api/settings")
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
    ])
      .then(([productsData, categoriesData, settingsData]) => {
        setProducts(productsData.length ? productsData : fallbackProducts);
        setCategories(categoriesData.length ? categoriesData : fallbackCategories);
        setSettings(settingsData);
      })
      .catch(() => {
        setProducts(fallbackProducts);
        setCategories(fallbackCategories);
      })
      .finally(() => setLoading(false));
  }, []);



  // Slide rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const featured = products.filter((p) => p.featured);
  const trending = products.filter((p) => p.trending);
  const deals = products.filter((p) => p.topDeal || (p.oldPrice && p.oldPrice > p.price));

  const promo1 = settings?.homepagePromos?.promo1 || {
    title: "Dinamic Tracking",
    desc: "Artisanal rugs, wallpaper, classic vases, and lighting accessories—well-made and carefully considered—whether made by Heath or by like-minded makers we admire. Welcome in.",
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
    link: "/search"
  };

  const promo2 = settings?.homepagePromos?.promo2 || {
    title: "Audio Speaker A1",
    desc: "Lasted answer oppose to ye months no esteem. Branched is on an ecstatic directly it.",
    img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
    link: "/search"
  };

  const promo3 = settings?.homepagePromos?.promo3 || {
    title: "Headphone",
    desc: "Headphones give you a great experience. Verified ratings and specs.",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    link: "/search"
  };

  const promo4 = settings?.homepagePromos?.promo4 || {
    title: "Smart Watch",
    desc: "It is a long established fact that a reader will. Aggregated specs and direct links.",
    img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800",
    link: "/search"
  };

  const tabItems = {
    featured: featured.slice(0, 8),
    trending: trending.slice(0, 8),
    deals: deals.slice(0, 8),
  };

  // Hero slideshow slides configuration
  const slides = [
    {
      title: "Next-Gen Gaming Consoles",
      subtitle: "EXCLUSIVES DROP",
      desc: "Get verified spec charts, comparison tables, and coupons on the latest consoles.",
      img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1000",
      link: "/search?categoryId=cat-gaming",
      badge: "UP TO 15% OFF",
    },
    {
      title: "Ultraportable Tech Workstations",
      subtitle: "TOP EDITOR PICKS",
      desc: "Unbiased pros, cons, and direct affiliate deals on flagship developer laptops.",
      img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000",
      link: "/search?categoryId=cat-electronics",
      badge: "VERIFIED PRICING",
    },
  ];

  const activeSlide = slides[currentSlide] || slides[0]!;

  return (
    <div className="flex flex-col min-h-screen bg-[#F1F5F9] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <Navbar />
      {/* ── Hero Carousel & Categories Sidebar (Prowe Layout) ─────────────── */}
      <section className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Full-width Slideshow Banner */}
        <div className="relative h-[260px] sm:h-[360px] lg:h-[400px] rounded-xl overflow-hidden shadow-sm bg-slate-900 border border-slate-200/40 dark:border-slate-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              {/* Background image & gradient blur */}
              <div className="absolute inset-0 bg-black/45 z-10" />
              <img
                src={activeSlide.img}
                alt={activeSlide.title}
                className="w-full h-full object-cover"
              />

              {/* Banner Copy & Callouts */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center p-5 sm:p-10 lg:p-12 space-y-3 sm:space-y-4 max-w-lg">
                <span className="inline-block bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-sm w-fit tracking-wider">
                  {activeSlide.badge}
                </span>
                <span className="text-yellow-400 text-xs font-extrabold tracking-widest uppercase block">
                  {activeSlide.subtitle}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {activeSlide.title}
                </h2>
                <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed hidden sm:block">
                  {activeSlide.desc}
                </p>
                <Link
                  href={activeSlide.link}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs px-6 py-3 rounded-lg shadow w-fit transition-all hover:scale-[1.02] active:scale-95"
                >
                  Compare Specifications <ArrowRight className="h-3.5 w-3.5 text-primary" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Dots */}
          <div className="absolute bottom-4 right-4 sm:right-6 z-30 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? "w-6 bg-primary" : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Indicators Strip (Prowe style inline layout) ─────────── */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: <Truck className="h-8 w-8 text-primary shrink-0" />, title: "Free Shipping", desc: "For all orders over ₹999" },
              { icon: <Clock className="h-8 w-8 text-primary shrink-0" />, title: "Delivery On Time", desc: "Break the lines wherever" },
              { icon: <ShieldCheck className="h-8 w-8 text-primary shrink-0" />, title: "Secure Payment", desc: "100% secure payment" },
              { icon: <RotateCcw className="h-8 w-8 text-primary shrink-0" />, title: "Shipping & Return", desc: "Photography online website" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3.5 min-w-0">
                <div className="shrink-0">{item.icon}</div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs sm:text-sm font-black uppercase text-slate-800 dark:text-slate-100 leading-none">{item.title}</span>
                  <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1.5 truncate">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Dinamic Tracking 3-Column Highlights Section ───────────────── */}
      <section className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <div className="overflow-hidden rounded-xl aspect-[4/3] bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <img
              src={promo1.img || "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800"}
              alt={promo1.title}
              className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
          <div className="text-center space-y-4 px-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">{promo1.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              {promo1.desc}
            </p>
            <Link
              href={promo1.link || "/search"}
              className="inline-block text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white border-b-2 border-slate-800 dark:border-white pb-0.5 hover:text-primary hover:border-primary transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl aspect-[4/3] bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <img
              src={promo1.img || "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800"}
              alt={promo1.title}
              className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* ── Audio Speaker A1 & Stacked Cards Block Grid ────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Side: Tall card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-sm group">
            <div className="overflow-hidden rounded-xl w-full max-h-[300px] flex justify-center bg-slate-50 dark:bg-slate-950 p-4">
              <img
                src={promo2.img || "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800"}
                alt={promo2.title}
                className="max-h-[260px] w-auto object-contain group-hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
            <div className="mt-6 space-y-3">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">{promo2.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                {promo2.desc}
              </p>
              <Link
                href={promo2.link || "/search"}
                className="inline-block text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white border-b-2 border-slate-800 dark:border-white pb-0.5 hover:text-primary hover:border-primary transition-colors"
              >
                SHOP NOW
              </Link>
            </div>
          </div>

          {/* Right Side: Stacked cards */}
          <div className="flex flex-col gap-6">
            
            {/* Top stacked item */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm group flex-1">
              <div className="w-full sm:w-1/2 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950 p-3 flex justify-center h-full items-center">
                <img
                  src={promo3.img || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"}
                  alt={promo3.title}
                  className="max-h-[140px] w-auto object-contain group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="w-full sm:w-1/2 space-y-2">
                <h3 className="text-lg font-black text-slate-800 dark:text-white">{promo3.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {promo3.desc}
                </p>
                <Link
                  href={promo3.link || "/search"}
                  className="inline-block text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white border-b-2 border-slate-800 dark:border-white pb-0.5 hover:text-primary hover:border-primary transition-colors"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>

            {/* Bottom stacked item */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm group flex-1">
              <div className="w-full sm:w-1/2 space-y-2 order-2 sm:order-1">
                <h3 className="text-lg font-black text-slate-800 dark:text-white">{promo4.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {promo4.desc}
                </p>
                <Link
                  href={promo4.link || "/search"}
                  className="inline-block text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white border-b-2 border-slate-800 dark:border-white pb-0.5 hover:text-primary hover:border-primary transition-colors"
                >
                  SHOP NOW
                </Link>
              </div>
              <div className="w-full sm:w-1/2 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950 p-3 flex justify-center h-full items-center order-1 sm:order-2">
                <img
                  src={promo4.img || "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800"}
                  alt={promo4.title}
                  className="max-h-[140px] w-auto object-contain group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Main Content Grid (Hot Deals Shelf) ────────────────────── */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">



        {/* Animated Product Tabs (Featured, Trending, Deals) */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-6">
          
          {/* Tab Selection Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-primary" />
                Featured Collections
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Explore editor spec sheets and ratings lists</p>
            </div>

            {/* Selector Buttons */}
            <div className="flex max-w-full gap-1.5 self-start sm:self-auto bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-200/50 dark:border-slate-800 overflow-x-auto no-scrollbar">
              {[
                { key: "featured", label: "Editor Picks" },
                { key: "trending", label: "Trending" },
                { key: "deals", label: "Discounted" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`text-[11px] font-black px-4 py-2 rounded-md transition-all ${
                    activeTab === tab.key
                      ? "bg-white dark:bg-slate-900 text-primary shadow-sm border border-slate-200/30"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Display Container */}
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                >
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <ProductCardSkeleton key={`skeleton-${idx}`} />
                  ))}
                </motion.div>
              ) : tabItems[activeTab].length > 0 ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                >
                  {tabItems[activeTab].map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <ShoppingBag className="h-10 w-10 text-slate-300 animate-bounce" />
                  <p className="text-xs text-slate-400 font-bold mt-3">No products available in this tab.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Popular Top Brands Grid */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-3 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <CheckCircle className="h-4.5 w-4.5 text-primary" /> Supported Brands
            </h4>
            <span className="text-[10px] text-slate-400 font-semibold">Genuine manufacturer specs</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[
              { name: "Apple", logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200", link: "/search?brandId=apple", desc: "Flagship phones and chips" },
              { name: "Sony", logo: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200", link: "/search?brandId=sony", desc: "Industry-leading audio gear" },
              { name: "Nike", logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200", link: "/search?brandId=nike", desc: "Athletic wear & shoes" },
              { name: "Samsung", logo: "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=200", link: "/search?brandId=samsung", desc: "Next-gen screens & memory" },
            ].map((b) => (
              <Link
                key={b.name}
                href={b.link}
                className="group flex flex-col items-center justify-center p-3 sm:p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-primary/45 hover:shadow-sm transition-all text-center"
              >
                <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <img src={b.logo} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h5 className="text-xs font-black text-slate-700 dark:text-slate-200 mt-2">{b.name}</h5>
                <span className="text-[9px] text-slate-400 font-semibold mt-0.5 leading-none block">{b.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recently Viewed Shelf */}
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm p-4 sm:p-5">
          <RecentlyViewed />
        </div>

      </main>

      <Footer />
    </div>
  );
}
