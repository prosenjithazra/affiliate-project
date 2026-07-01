import { NextRequest, NextResponse } from "next/server";
import { prisma, mockProducts } from "@repo/database";
import { Product } from "@repo/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export const dynamic = "force-dynamic";

// GET /api/products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    let products: any[] = [];

    try {
      if (idsParam) {
        const ids = idsParam.split(",").filter(Boolean);
        products = await prisma.product.findMany({
          where: { id: { in: ids } },
          include: {
            images: { orderBy: { order: "asc" } },
            category: true,
            brand: true,
          },
          orderBy: { createdAt: "desc" },
        });
      } else {
        products = await prisma.product.findMany({
          include: {
            images: { orderBy: { order: "asc" } },
            category: true,
            brand: true,
          },
          orderBy: { createdAt: "desc" },
        });
      }
      return NextResponse.json(products as any as Product[]);
    } catch (dbError) {
      console.warn("Database failed to load products. Returning mock instead.");
      let mockList = [...mockProducts];
      if (idsParam) {
        const ids = idsParam.split(",").filter(Boolean);
        mockList = mockList.filter((p) => ids.includes(p.id));
      }
      return NextResponse.json(mockList);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/products
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      slug,
      shortDescription,
      fullDescription,
      price,
      oldPrice,
      discount,
      rating,
      affiliateStore,
      affiliateUrl,
      features,
      specifications,
      pros,
      cons,
      tags,
      stockStatus,
      featured,
      trending,
      topDeal,
      metaTitle,
      metaDescription,
      categoryId,
      brandId,
      images, // array of image URLs
    } = body;

    if (!name || !slug || !price || !categoryId || !brandId || !affiliateUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const priceNum = parseFloat(price);
    const oldPriceNum = oldPrice ? parseFloat(oldPrice) : null;
    const discountNum = discount ? parseInt(discount) : null;
    const ratingNum = rating ? parseFloat(rating) : 0;

    try {
      const product = await prisma.product.create({
        data: {
          name,
          slug,
          shortDescription,
          fullDescription,
          price: priceNum,
          oldPrice: oldPriceNum,
          discount: discountNum,
          rating: ratingNum,
          affiliateStore,
          affiliateUrl,
          features: features || [],
          specifications: specifications || {},
          pros: pros || [],
          cons: cons || [],
          tags: tags || [],
          stockStatus: stockStatus || "IN_STOCK",
          featured: !!featured,
          trending: !!trending,
          topDeal: !!topDeal,
          metaTitle,
          metaDescription,
          categoryId,
          brandId,
          images: {
            create: (images || []).map((url: string, i: number) => ({
              url,
              order: i,
            })),
          },
        },
        include: {
          category: true,
          brand: true,
          images: true,
        },
      });

      return NextResponse.json(product, { status: 201 });
    } catch (dbError) {
      console.warn("Database product insertion failed. Creating mock instead.", dbError);

      const newMock: any = {
        id: "prod-" + Math.random().toString(36).substring(2, 9),
        name,
        slug,
        shortDescription,
        fullDescription,
        price: priceNum,
        oldPrice: oldPriceNum,
        discount: discountNum,
        rating: ratingNum,
        affiliateStore,
        affiliateUrl,
        features: features || [],
        specifications: specifications || {},
        pros: pros || [],
        cons: cons || [],
        tags: tags || [],
        stockStatus: stockStatus || "IN_STOCK",
        featured: !!featured,
        trending: !!trending,
        topDeal: !!topDeal,
        metaTitle,
        metaDescription,
        categoryId,
        brandId,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: (images || []).map((url: string, index: number) => ({
          id: `img-${index}-${Math.random()}`,
          url,
          order: index,
          productId: "",
        })),
      };

      mockProducts.push(newMock);
      return NextResponse.json(newMock, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
