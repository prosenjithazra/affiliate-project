import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shopzone.com";

  // Static site paths with standard metadata priority/changefreq
  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/deals`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/support`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 }
  ];

  if (!process.env.DATABASE_URL) {
    return staticPaths;
  }

  try {
    const { prisma } = await import("@repo/database");

    // Fetch dynamic products, categories, brands, and blogs from DB
    const [products, categories, brands, blogs] = await Promise.all([
      prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.brand.findMany({ select: { slug: true, updatedAt: true } }),
      (prisma as any).blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })
    ]);

    const productPaths: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "daily",
      priority: 0.9
    }));

    const categoryPaths: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/search?categoryId=${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8
    }));

    const brandPaths: MetadataRoute.Sitemap = brands.map((b) => ({
      url: `${baseUrl}/search?brandId=${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8
    }));

    const blogPaths: MetadataRoute.Sitemap = blogs.map((bl: any) => ({
      url: `${baseUrl}/blog/${bl.slug}`,
      lastModified: bl.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7
    }));

    return [...staticPaths, ...productPaths, ...categoryPaths, ...brandPaths, ...blogPaths];
  } catch {
    console.warn("Dynamic sitemap data unavailable; using static fallback routes.");
    return staticPaths;
  }
}
