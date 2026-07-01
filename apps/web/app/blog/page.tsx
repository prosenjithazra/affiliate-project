import React from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { prisma } from "@repo/database";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ShopZone - Buying Guides, Expert News & Reviews",
  description: "Explore the latest expert hardware specs buying guides, news, and comparison reviews from our editors."
};

const fallbackArticles = [
  {
    id: "art-1",
    title: "How to Choose the Best Headphones for Remote Work in 2026",
    excerpt: "Unbiased technical specs sheets, latency tests, and pros & cons lists for active noise-canceling headsets.",
    createdAt: new Date("2026-06-25"),
    slug: "best-headphones-remote-work-2026",
    coverImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
  },
  {
    id: "art-2",
    title: "Apple M3 vs M3 Max: Flagship Processor Performance Mapped",
    excerpt: "Evaluating cache configurations, raw clock speeds, and thermal efficiency charts for developers.",
    createdAt: new Date("2026-06-20"),
    slug: "apple-m3-vs-m3-max-performance",
    coverImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"
  }
];

export default async function BlogPage() {
  let articles: any[] = [];
  try {
    articles = await (prisma as any).blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.warn("Database failed to load blog posts. Showing local fallback data.");
    articles = fallbackArticles;
  }

  if (articles.length === 0) {
    articles = fallbackArticles;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2 leading-tight">
            <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-primary shrink-0" /> Buying Guides & Articles
          </h1>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            Detailed hardware analysis and specifications breakdowns verified by our engineering editors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art) => (
            <article key={art.id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group">
              <div>
                <div className="h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-900/40 relative">
                  {art.coverImage ? (
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      No Cover Image
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(art.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {"6 min read"}
                    </span>
                  </div>
                  <Link href={`/blog/${art.slug}`}>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white group-hover:text-primary transition-colors leading-snug">
                      {art.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <Link
                  href={`/blog/${art.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:text-primary-hover hover:underline"
                >
                  Read Complete Guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
