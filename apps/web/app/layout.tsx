import type { Metadata } from "next";
import "@splidejs/react-splide/css";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "ShopZone - Handpicked Premium Gear & Tech Deals",
  description: "Browse curated collections of top-rated items, specs tables, pros and cons, and exclusive affiliate discounts.",
  icons: {
    icon: "/logoNewUpdate.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="font-sans h-full antialiased overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
