import React from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Award, ChevronRight } from "lucide-react";
import { prisma } from "@repo/database";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ShopZone - Tech Brands & Manufacturers Specs",
  description: "Browse the complete directory of technology manufacturers and brands with specifications charts."
};

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { products: true } }
    },
    orderBy: { name: "asc" }
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">Supported Manufacturers</h1>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            Browse aggregated specification indexes and reviews segmented by official tech hardware brands.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/search?brandId=${brand.slug}`}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-4 sm:p-5 hover:border-primary/45 transition-colors flex items-center justify-between gap-2 shadow-sm group"
            >
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                  {brand.name}
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold block">
                  {brand._count.products} Products Mapped
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
