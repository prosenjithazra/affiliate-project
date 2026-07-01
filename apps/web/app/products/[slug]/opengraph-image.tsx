import { ImageResponse } from "next/og";
import { prisma } from "@repo/database";

export const dynamic = "force-dynamic";

export const alt = "ShopZone Product Specification Card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  // Retrieve basic info to display dynamically on the OG image banner
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      price: true,
      oldPrice: true,
      rating: true,
      affiliateStore: true,
      brand: { select: { name: true } }
    }
  });

  if (!product) {
    return new ImageResponse(
      (
        <div style={{
          display: "flex", width: "100%", height: "100%", padding: "60px",
          background: "linear-gradient(to bottom right, #0F172A, #1E1B4B)",
          flexDirection: "column", justifyContent: "center", alignItems: "center"
        }}>
          <h1 style={{ color: "#ffffff", fontSize: "70px", fontWeight: 900 }}>ShopZone</h1>
          <p style={{ color: "#94A3B8", fontSize: "30px" }}>Discover Better. Shop Smarter.</p>
        </div>
      ),
      size
    );
  }

  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return new ImageResponse(
    (
      <div style={{
        display: "flex", width: "100%", height: "100%", padding: "80px",
        background: "linear-gradient(to bottom right, #0F172A, #1F2937)",
        flexDirection: "column", justifyContent: "space-between", color: "#ffffff",
        position: "relative"
      }}>
        {/* Decorative elements */}
        <div style={{
          position: "absolute", top: "-200px", right: "-200px", width: "500px", height: "500px",
          borderRadius: "100%", background: "rgba(255, 107, 0, 0.12)", filter: "blur(80px)"
        }} />

        {/* Brand Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#FF6B00", fontSize: "28px", fontWeight: 800, letterSpacing: "1px" }}>SHOPZONE</span>
          <span style={{ background: "rgba(255, 255, 255, 0.1)", padding: "8px 16px", borderRadius: "8px", fontSize: "20px", color: "#94A3B8" }}>
            {product.affiliateStore} Verified Deal
          </span>
        </div>

        {/* Core Product Information */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <span style={{ color: "#E2E8F0", fontSize: "22px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
            {product.brand?.name || "Premium Gear"}
          </span>
          <h1 style={{ color: "#ffffff", fontSize: "56px", fontWeight: 900, lineHeight: 1.2, margin: 0 }}>
            {product.name}
          </h1>
        </div>

        {/* Price & Rating Block */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "20px" }}>
            <span style={{ fontSize: "64px", fontWeight: 900, color: "#FF6B00" }}>
              ${product.price.toFixed(2)}
            </span>
            {discount > 0 && (
              <span style={{ fontSize: "32px", color: "#10B981", fontWeight: 700 }}>
                {discount}% OFF
              </span>
            )}
          </div>

          <div style={{ display: "flex", background: "#10B981", padding: "10px 20px", borderRadius: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff" }}>
              ★ {product.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
