import { NextResponse } from "next/server";
import { prisma, mockProducts, mockCategories, mockClicks } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();
    const totalClicks = await prisma.affiliateClick.count();

    // Group clicks by day (past 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const clicksByDayDb = await prisma.affiliateClick.groupBy({
      by: ["clickedAt"],
      where: {
        clickedAt: { gte: sevenDaysAgo },
      },
      _count: { id: true },
    });

    // Map database results to simple daily array
    const dailyMap: Record<string, number> = {};
    clicksByDayDb.forEach((item) => {
      const dateStr = new Date(item.clickedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + item._count.id;
    });

    const dailyClicks = Object.entries(dailyMap).map(([name, clicks]) => ({
      name,
      clicks,
    }));

    // Group by product (most clicked)
    const productClicksDb = await prisma.affiliateClick.groupBy({
      by: ["productId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const topProducts = await Promise.all(
      productClicksDb.map(async (item) => {
        const prod = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true },
        });
        return {
          name: prod?.name || "Unknown Product",
          clicks: item._count.id,
        };
      })
    );

    // Group by affiliate store
    const storeClicksDb = await prisma.product.findMany({
      select: {
        affiliateStore: true,
        clicks: { select: { id: true } },
      },
    });

    const storeMap: Record<string, number> = {};
    storeClicksDb.forEach((prod) => {
      storeMap[prod.affiliateStore] = (storeMap[prod.affiliateStore] || 0) + prod.clicks.length;
    });

    const topStores = Object.entries(storeMap)
      .map(([name, clicks]) => ({ name, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    return NextResponse.json({
      summary: {
        totalProducts,
        totalCategories,
        totalClicks,
      },
      dailyClicks,
      topProducts,
      topStores,
    });
  } catch (error) {
    console.warn("Database analytics compilation failed. Aggregating memory mocks instead.");

    // Fallback: Aggregate memory mock arrays
    const totalProducts = mockProducts.length;
    const totalCategories = mockCategories.length;
    const totalClicks = mockClicks.length;

    // Daily clicks map from memory
    const dailyMap: Record<string, number> = {};
    mockClicks.forEach((click) => {
      const dateStr = new Date(click.clickedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + 1;
    });

    const dailyClicks = Object.entries(dailyMap)
      .map(([name, clicks]) => ({ name, clicks }))
      .slice(-7); // take last 7

    // Top products clicks from memory
    const prodMap: Record<string, number> = {};
    mockClicks.forEach((click) => {
      prodMap[click.productId] = (prodMap[click.productId] || 0) + 1;
    });

    const topProducts = Object.entries(prodMap)
      .map(([id, clicks]) => {
        const prod = mockProducts.find((p) => p.id === id);
        return {
          name: prod?.name || "MacBook Pro 14",
          clicks,
        };
      })
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    // Top stores clicks from memory
    const storeMap: Record<string, number> = {};
    mockClicks.forEach((click) => {
      const prod = mockProducts.find((p) => p.id === click.productId);
      if (prod) {
        storeMap[prod.affiliateStore] = (storeMap[prod.affiliateStore] || 0) + 1;
      }
    });

    const topStores = Object.entries(storeMap)
      .map(([name, clicks]) => ({ name, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    return NextResponse.json({
      summary: {
        totalProducts,
        totalCategories,
        totalClicks,
      },
      dailyClicks,
      topProducts,
      topStores,
    });
  }
}
