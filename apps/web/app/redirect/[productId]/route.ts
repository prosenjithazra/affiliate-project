import { NextRequest, NextResponse } from "next/server";
import { prisma, mockProducts, mockClicks } from "@repo/database";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params;
  let targetUrl = "https://google.com"; // default fallback

  try {
    const referrer = req.headers.get("referer") || "";
    const userAgent = req.headers.get("user-agent") || "";
    // Capture client IP address securely
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    let product = null;

    try {
      product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (product) {
        targetUrl = product.affiliateUrl;

        // Log the click asynchronously to avoid blocking the redirect response
        prisma.affiliateClick
          .create({
            data: {
              productId,
              referrer,
              userAgent,
              ip,
            },
          })
          .catch((err) => console.error("Failed to write click log to DB", err));
      }
    } catch (dbError) {
      console.warn("Database redirect log failed. Logging to memory instead.");
      // Fallback: search in memory
      product = mockProducts.find((p) => p.id === productId);
      if (product) {
        targetUrl = product.affiliateUrl;
        mockClicks.push({
          id: "click-" + Math.random().toString(36).substring(2, 9),
          productId,
          referrer,
          userAgent,
          ip,
          clickedAt: new Date(),
        });
      }
    }

    if (!product) {
      console.warn(`Product ID ${productId} not found during redirect. Bailing to homepage.`);
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.redirect(targetUrl, 307);
  } catch (error) {
    console.error("General error in redirection logic", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
