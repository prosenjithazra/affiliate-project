/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable gzip response compression
  compress: true,

  // Skip ESLint during builds (run it separately with yarn lint)
  eslint: { ignoreDuringBuilds: true },

  // Skip TypeScript errors during builds
  typescript: { ignoreBuildErrors: true },

  // Tell Next.js NOT to bundle @prisma/client — use the installed node_modules version
  serverExternalPackages: ["@prisma/client", "@repo/database"],

  // Force Next.js and Vercel to package/trace Prisma engine binaries
  outputFileTracingIncludes: {
    "/**/*": [
      "./../../node_modules/.prisma/client/schema.prisma",
      "./../../node_modules/.prisma/client/query-engine-*",
      "./../../packages/database/node_modules/.prisma/client/schema.prisma",
      "./../../packages/database/node_modules/.prisma/client/libquery_engine-*",
      "./../../packages/database/node_modules/@prisma/client/schema.prisma",
      "./../../packages/database/node_modules/@prisma/client/libquery_engine-*"
    ]
  },

  // Image optimization remote host configurations
  images: {
    minimumCacheTTL: 31536000, // Cache images for 1 year
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" }
    ]
  },

  // HTTP Headers configuration (Security & Caching)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
          }
        ]
      },
      {
        // Custom long cache duration for static public files
        source: "/(newLogoMain.png|logoMainNew.png|logoMain.png|favicon.ico|manifest.json)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
