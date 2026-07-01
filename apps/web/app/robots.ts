import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/products/",
          "/categories/",
          "/brands/",
          "/blog/",
          "/deals/",
          "/reviews/"
        ],
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/private/",
          "/api/"
        ]
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ClaudeBot",
          "PerplexityBot"
        ],
        allow: [
          "/",
          "/products/",
          "/categories/",
          "/brands/",
          "/blog/",
          "/deals/",
          "/reviews/"
        ],
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/private/",
          "/api/",
          "/private/"
        ]
      }
    ],
    sitemap: "https://shopzone.com/sitemap.xml",
    host: "https://shopzone.com"
  };
}
