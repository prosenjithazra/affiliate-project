"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category, Brand, Product } from "@repo/types";
import ProductCard from "../../components/ProductCard";
import * as LucideIcons from "lucide-react";
import {
  Button,
  Input,
  Card,
  CardContent,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { SlidersHorizontal, ArrowUpDown, RefreshCw, ShoppingBag, X } from "lucide-react";

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

interface Filters {
  query: string;
  categoryId: string;
  brandId: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  topDeal: boolean;
  sort: string;
}

interface SearchLayoutClientProps {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
  initialFilters: Filters;
}

export default function SearchLayoutClient({
  initialProducts,
  categories,
  brands,
  initialFilters,
}: SearchLayoutClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local Filter state
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if URL changes directly
  useEffect(() => {
    setFilters({
      query: searchParams.get("query") || "",
      categoryId: searchParams.get("categoryId") || "",
      brandId: searchParams.get("brandId") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      minRating: searchParams.get("minRating") || "",
      topDeal: searchParams.get("topDeal") === "true",
      sort: searchParams.get("sort") || "newest",
    });
  }, [searchParams]);

  // Apply filters by pushing to Next.js router query params
  const applyFilters = (updatedFilters: Partial<Filters>) => {
    const next = { ...filters, ...updatedFilters };
    setFilters(next);

    const queryParams = new URLSearchParams();
    if (next.query) queryParams.set("query", next.query);
    if (next.categoryId) queryParams.set("categoryId", next.categoryId);
    if (next.brandId) queryParams.set("brandId", next.brandId);
    if (next.minPrice) queryParams.set("minPrice", next.minPrice);
    if (next.maxPrice) queryParams.set("maxPrice", next.maxPrice);
    if (next.minRating) queryParams.set("minRating", next.minRating);
    if (next.topDeal) queryParams.set("topDeal", "true");
    if (next.sort !== "newest") queryParams.set("sort", next.sort);

    router.push(`/search?${queryParams.toString()}`);
  };

  const clearFilters = () => {
    const cleared = {
      query: "",
      categoryId: "",
      brandId: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      topDeal: false,
      sort: "newest",
    };
    setFilters(cleared);
    router.push("/search");
  };

  const SidebarFilters = () => (
    <div className="space-y-6">
      {/* Active Search */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Refine Search</Label>
        <Input
          placeholder="Keyword..."
          value={filters.query}
          onChange={(e) => applyFilters({ query: e.target.value })}
          className="bg-white dark:bg-slate-900"
        />
      </div>

      {/* Category selection */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Category</Label>
        <Select
          value={filters.categoryId || "all"}
          onValueChange={(value) => applyFilters({ categoryId: value === "all" ? "" : value })}
        >
          <SelectTrigger className="bg-white dark:bg-slate-900">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              <span className="flex items-center gap-2">
                <CategoryIcon name={c.icon} className="h-4 w-4 text-slate-400" />
                <span>{c.name}</span>
              </span>
            </SelectItem>
          ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand selection */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Manufacturer</Label>
        <Select
          value={filters.brandId || "all"}
          onValueChange={(value) => applyFilters({ brandId: value === "all" ? "" : value })}
        >
          <SelectTrigger className="bg-white dark:bg-slate-900">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
          {brands.map((b) => (
            <SelectItem key={b.id} value={b.id}>
              {b.name}
            </SelectItem>
          ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price bounds */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Price Bounds (₹)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => applyFilters({ minPrice: e.target.value })}
            className="bg-white dark:bg-slate-900"
          />
          <Input
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => applyFilters({ maxPrice: e.target.value })}
            className="bg-white dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Rating scale */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Minimum Rating</Label>
        <Select
          value={filters.minRating || "all"}
          onValueChange={(value) => applyFilters({ minRating: value === "all" ? "" : value })}
        >
          <SelectTrigger className="bg-white dark:bg-slate-900">
            <SelectValue placeholder="Any Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Rating</SelectItem>
            <SelectItem value="4.5">★ 4.5+ Stars</SelectItem>
            <SelectItem value="4.0">★ 4.0+ Stars</SelectItem>
            <SelectItem value="3.5">★ 3.5+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deals Switch toggle */}
      <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-900">
        <div className="space-y-0.5">
          <Label className="text-xs">Top Deals Only</Label>
          <p className="text-[10px] text-slate-400">Discounted items only</p>
        </div>
        <Switch
          checked={filters.topDeal}
          onCheckedChange={(checked) => applyFilters({ topDeal: checked })}
        />
      </div>

      {/* Reset button */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full flex items-center justify-center gap-2 text-xs py-5"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:col-span-1 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-900/50 shadow-sm h-fit sticky top-24">
        <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-200 font-bold border-b pb-3">
          <SlidersHorizontal className="h-4.5 w-4.5" />
          <span>Filters</span>
        </div>
        <SidebarFilters />
      </aside>

      {/* Main search results area */}
      <div className="w-full lg:col-span-3 space-y-6">
        {/* Top bar controls */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-900/50 shadow-sm gap-3 sm:gap-4">
          <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
            Found <span className="text-primary">{initialProducts.length}</span> matching products
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 transition-all shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <div className="flex items-center gap-1.5 min-w-0 flex-1 sm:flex-none">
              <ArrowUpDown className="h-4 w-4 text-slate-400 hidden sm:inline" />
              <Select
                value={filters.sort}
                onValueChange={(value) => applyFilters({ sort: value })}
              >
                <SelectTrigger className="h-9 w-full sm:w-[180px] text-xs">
                  <SelectValue placeholder="Sort: Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Sort: Newest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating_desc">Top Rated</SelectItem>
                  <SelectItem value="discount_desc">Highest Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {initialProducts.length === 0 ? (
          <Card className="w-full border-dashed py-24 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-slate-200 dark:text-slate-800 mb-4 animate-pulse" />
            <h3 className="text-lg font-bold">No Products Found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mt-1">
              There are no matches for the selected filters. Try broadening your keywords.
            </p>
            <Button onClick={clearFilters} className="mt-4 bg-primary hover:bg-primary-hover text-white">
              Reset Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {initialProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Drawer Overlay */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)} />
          <div className="relative w-full max-w-xs h-full bg-white dark:bg-slate-950 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-3 border-b">
              <span className="font-bold flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5" /> Filters
              </span>
              <button onClick={() => setShowMobileFilters(false)} className="p-1 rounded-full border">
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarFilters />
          </div>
        </div>
      )}
    </div>
  );
}
