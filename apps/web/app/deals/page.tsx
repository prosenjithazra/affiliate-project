import React from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Flame, ArrowRight, Star, ShoppingBag, CheckCircle } from "lucide-react";
import { prisma } from "@repo/database";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ShopZone - Live Discount Vouchers & Coupons",
  description: "Browse verified coupons, referral discount links, and spec sheets to get the best prices from retailers."
};

export default async function DealsPage() {
  // Query discounted products from the DB
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { topDeal: true },
        { oldPrice: { not: null } }
      ]
    },
    take: 12,
    include: {
      brand: { select: { name: true } },
      category: { select: { name: true } }
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-sm uppercase tracking-wider">
            <Flame className="h-3 w-3 fill-current" /> Hot Deals
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">Active Discount Codes & Deals</h1>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Unbiased specifications grids mapped alongside live, verified referral coupons to help you buy tech gear for less.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const discount = product.oldPrice
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0;

              return (
                <div key={product.id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.brand?.name}</span>
                      {discount > 0 && (
                        <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                    <Link href={`/products/${product.slug}`} className="block group">
                      <h3 className="text-sm font-extrabold text-slate-800 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                        {product.oldPrice && (
                          <span className="text-xs text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold mt-1">
                        <CheckCircle className="h-3 w-3 text-emerald-500" /> Verified at {product.affiliateStore}
                      </div>
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold transition-colors gap-1.5"
                    >
                      View Specs <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-16 text-center space-y-3">
            <ShoppingBag className="h-10 w-10 mx-auto text-slate-300" />
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">No active coupon drops right now</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">Check back shortly! We audit referral coupons every 12 hours.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
