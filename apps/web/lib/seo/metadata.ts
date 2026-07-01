import { Metadata } from "next";

export const baseUrl = "https://shopzone.com";

export const baseMetadata: Metadata = {
  title: {
    template: "%s | ShopZone",
    default: "ShopZone - Discover Better. Shop Smarter."
  },
  description: "Curated tech spec comparisons, editorial pros and cons, buying reviews, and verified discount coupons.",
  keywords: [
    "product comparison",
    "expert tech reviews",
    "shopping discovery",
    "coupon discount tables",
    "spec sheets database",
    "best laptop deals",
    "affiliate buying guides"
  ],
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "./"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  authors: [{ name: "ShopZone Editorial Team", url: baseUrl }],
  publisher: "ShopZone Inc.",
  creator: "ShopZone Editorial Team",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ShopZone"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "ShopZone",
    title: "ShopZone - Discover Better. Shop Smarter.",
    description: "Curated tech spec comparisons, editorial pros and cons, buying reviews, and verified discount coupons.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ShopZone Shopping Discovery Showcase"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopZone - Discover Better. Shop Smarter.",
    description: "Curated tech spec comparisons, editorial pros and cons, buying reviews, and verified discount coupons.",
    creator: "@shopzone",
    images: ["/twitter-image.jpg"]
  },
  verification: {
    google: "google-site-verification-placeholder",
    yandex: "yandex-verification-placeholder"
  }
};
