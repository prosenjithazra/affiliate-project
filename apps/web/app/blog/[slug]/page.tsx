import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { prisma } from "@repo/database";
import { buildBlogPostingSchema } from "../../../lib/seo/article";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

const fallbackArticles = [
  {
    id: "art-1",
    title: "How to Choose the Best Headphones for Remote Work in 2026",
    excerpt: "Unbiased technical specs sheets, latency tests, and pros & cons lists for active noise-canceling headsets.",
    content: "Selecting high-quality headphones for professional settings requires auditing audio parameters like frequency response ranges, driver sizes, passive/active cancellation decibels, and bluetooth codecs. In this breakdown, we map the best headsets...",
    createdAt: new Date("2026-06-25"),
    updatedAt: new Date("2026-06-25"),
    slug: "best-headphones-remote-work-2026",
    coverImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    metaTitle: "Best Headphones for Remote Work 2026 - ShopZone",
    metaDescription: "Read our comprehensive buyer's guide for choosing active noise-canceling headsets with full specs comparisons."
  },
  {
    id: "art-2",
    title: "Apple M3 vs M3 Max: Flagship Processor Performance Mapped",
    excerpt: "Evaluating cache configurations, raw clock speeds, and thermal efficiency charts for developers.",
    content: "When evaluating raw computational throughput for complex development tasks, processor microarchitecture details play a primary role. Here we analyze cache structures, CPU core clusters, and GPU scaling factors...",
    createdAt: new Date("2026-06-20"),
    updatedAt: new Date("2026-06-20"),
    slug: "apple-m3-vs-m3-max-performance",
    coverImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    metaTitle: "Apple M3 vs M3 Max Performance Comparison - ShopZone",
    metaDescription: "Detailed technical comparison of Apple M3 and M3 Max chips for software engineering workloads."
  }
];

async function getBlogPost(slug: string) {
  try {
    const post = await (prisma as any).blogPost.findUnique({
      where: { slug }
    });
    if (post) return post;
  } catch (error) {
    console.warn("Database failed to load blog post. Falling back to local mockup.");
  }
  return fallbackArticles.find((p) => p.slug === slug) || null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Article Not Found - ShopZone",
      description: "The requested shopping guide or tech article could not be resolved."
    };
  }

  const title = post.metaTitle || `${post.title} - ShopZone Guides`;
  const description = post.metaDescription || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://shopzone.com/blog/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage }] : []
    }
  };
}

export default async function BlogDetailsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const schemaJsonLd = buildBlogPostingSchema({
    slug: post.slug,
    title: post.title,
    description: post.excerpt,
    imageUrl: post.coverImage || "",
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    authorName: "ShopZone Technical Editors"
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <Navbar />
      
      {/* Dynamic JSON-LD BlogPosting Schema injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-wider mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Guides
          </Link>
          
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 font-bold mt-4 border-b border-slate-200/60 dark:border-slate-800 pb-4">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> By ShopZone Editors</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 6 min read</span>
          </div>
        </div>

        {post.coverImage && (
          <div className="w-full aspect-[4/3] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-sm border border-slate-200/40 dark:border-slate-800 bg-slate-100">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose dark:prose-invert text-sm leading-relaxed max-w-none text-slate-600 dark:text-slate-300 space-y-4 pt-4">
          {post.content.split("\n\n").map((para: string, i: number) => {
            if (!para.trim()) return null;
            return <p key={i}>{para.trim()}</p>;
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
