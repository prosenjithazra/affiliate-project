import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma, mockProducts } from "@repo/database";
import { Product } from "@repo/types";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ProductGallery from "../../../components/ProductGallery";
import ProductCard from "../../../components/ProductCard";
import RecentlyViewed from "../../../components/RecentlyViewed";
import RecentlyViewedLogger from "../../../components/RecentlyViewedLogger";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui";
import { Star, ArrowRight, ExternalLink, ChevronRight, Check, X, ShieldAlert, Award } from "lucide-react";
import { Button } from "@repo/ui";
import { formatPrice, calculateDiscount } from "@repo/utils";

type Params = Promise<{ slug: string }>;

async function getProductDetails(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
        brand: true,
      },
    });

    if (!product) return null;

    // Fetch related products
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
        brand: true,
      },
    });

    return {
      product: product as any as Product,
      related: related as any as Product[],
    };
  } catch (error) {
    console.warn("Database failed to fetch product details. Falling back to local search.");
    const product = mockProducts.find((p) => p.slug === slug);
    if (!product) return null;

    const related = mockProducts
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4);

    return {
      product: product as any as Product,
      related: related as any as Product[],
    };
  }
}

export default async function ProductDetailsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await getProductDetails(slug);

  if (!data) {
    notFound();
  }

  const { product, related } = data;
  const discount = calculateDiscount(product.price, product.oldPrice);

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f3f6] dark:bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 space-y-6 sm:space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 overflow-hidden">
          <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-200">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/search?categoryId=${product.categoryId}`} className="hover:text-slate-600 dark:hover:text-slate-200">
            {product.category?.name || "Category"}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600 dark:text-slate-200 truncate max-w-[140px] sm:max-w-[240px]">
            {product.name}
          </span>
        </nav>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images || []} />
          </div>

          {/* Right Column: Information & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand and Category badges */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border text-slate-600 dark:text-slate-400">
                  {product.brand?.name || "Brand"}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary">
                  {product.category?.name || "Category"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <span className="text-sm font-bold">{product.rating.toFixed(1)}</span>
                <span className="text-slate-400 text-xs">/ 5.0 Rating</span>
              </div>

              {/* Tagline */}
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {product.shortDescription}
              </p>

              {/* Price box */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Best Discounted Price
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-2xl font-extrabold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>
                </div>
                {discount > 0 && (
                  <span className="text-xs uppercase font-bold tracking-wider px-3 py-1.5 rounded-full bg-emerald-500 text-white">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* Affiliate CTA */}
              <div className="space-y-2 pt-2">
                {/* Redirects to secure tracking endpoint */}
                <Link href={`/redirect/${product.id}`} passHref legacyBehavior>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white shadow-lg shadow-primary/25 py-6 text-base font-bold flex items-center justify-center gap-2 rounded-xl">
                    Buy Now at {product.affiliateStore} <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
                <span className="text-[10px] text-slate-400 text-center block">
                  Outbound affiliate links securely redirect and count. We may earn a commission.
                </span>
              </div>
            </div>

            {/* Bullets feature list */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-slate-200/50 dark:border-slate-900/50">
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Key Highlights</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feat, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5 leading-normal">
                      <span className="text-primary font-bold shrink-0">•</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tabbed Detailed Specification / Pros & Cons Section */}
        <div className="pt-8 border-t border-slate-200/50 dark:border-slate-900/50">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-xl border mb-6 flex w-full !h-auto">
              <TabsTrigger value="overview" className="flex-1 rounded-lg py-2">Overview</TabsTrigger>
              <TabsTrigger value="specs" className="flex-1 rounded-lg py-2">Specifications</TabsTrigger>
              <TabsTrigger value="proscons" className="flex-1 rounded-lg py-2">Pros & Cons</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="bg-white dark:bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-200/50 dark:border-slate-900/50 shadow-sm space-y-4">
                <h3 className="text-lg font-bold">Product Overview</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                  {product.fullDescription}
                </p>
              </div>
            </TabsContent>

            {/* Specifications */}
            <TabsContent value="specs">
              <div className="bg-white dark:bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-200/50 dark:border-slate-900/50 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Technical Specifications</h3>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="border border-slate-100 dark:border-slate-900 rounded-xl overflow-hidden max-w-2xl">
                    {Object.entries(product.specifications).map(([key, val], idx) => (
                      <div
                        key={key}
                        className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-sm p-4 ${
                          idx % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-900/20" : "bg-white dark:bg-slate-950"
                        }`}
                      >
                        <span className="font-semibold text-slate-500">{key}</span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium break-words">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No specifications listed for this product.</p>
                )}
              </div>
            </TabsContent>

            {/* Pros and Cons */}
            <TabsContent value="proscons">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-white dark:bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-200/50 dark:border-slate-900/50 shadow-sm">
                {/* Pros */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="h-4.5 w-4.5" /> What We Like (Pros)
                  </h3>
                  <ul className="space-y-2.5">
                    {product.pros?.map((p, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2.5 leading-relaxed">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-900 pt-6 md:pt-0 md:pl-8">
                  <h3 className="text-base font-bold text-rose-600 flex items-center gap-1">
                    <X className="h-4.5 w-4.5" /> What to Consider (Cons)
                  </h3>
                  <ul className="space-y-2.5">
                    {product.cons?.map((c, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2.5 leading-relaxed">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">✗</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products list */}
        {related.length > 0 && (
          <section className="space-y-4 pt-8 border-t border-slate-200/50 dark:border-slate-900/50">
            <h2 className="text-xl font-extrabold tracking-tight">Related Recommendations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed items panel */}
        <RecentlyViewed />

        {/* Client side logger to record views */}
        <RecentlyViewedLogger productId={product.id} />
      </main>

      <Footer />
    </div>
  );
}
