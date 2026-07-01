import { NextRequest, NextResponse } from "next/server";
import { prisma, mockProducts } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// GET /api/products/[id]
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { order: "asc" } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.warn("Database error in GET /api/products/[id]. Returning mock instead.");
    const mock = mockProducts.find((p) => p.id === id);
    if (!mock) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(mock);
  }
}

// PUT /api/products/[id]
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
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

    const priceNum = price ? parseFloat(price) : undefined;
    const oldPriceNum = oldPrice !== undefined ? (oldPrice ? parseFloat(oldPrice) : null) : undefined;
    const discountNum = discount !== undefined ? (discount ? parseInt(discount) : null) : undefined;
    const ratingNum = rating ? parseFloat(rating) : undefined;

    try {
      const product = await prisma.$transaction(async (tx) => {
        const prod = await tx.product.update({
          where: { id },
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
            features,
            specifications,
            pros,
            cons,
            tags,
            stockStatus,
            featured: featured !== undefined ? !!featured : undefined,
            trending: trending !== undefined ? !!trending : undefined,
            topDeal: topDeal !== undefined ? !!topDeal : undefined,
            metaTitle,
            metaDescription,
            categoryId,
            brandId,
          },
        });

        if (images && Array.isArray(images)) {
          // Delete old images and write new ones
          await tx.productImage.deleteMany({
            where: { productId: id },
          });

          for (let i = 0; i < images.length; i++) {
            await tx.productImage.create({
              data: {
                url: images[i],
                order: i,
                productId: id,
              },
            });
          }
        }

        return tx.product.findUnique({
          where: { id },
          include: { category: true, brand: true, images: { orderBy: { order: "asc" } } },
        });
      }, {
        timeout: 15000
      });

      return NextResponse.json(product);
    } catch (dbError) {
      console.warn("Database product update failed. Updating mock instead.", dbError);
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index !== -1) {
        mockProducts[index] = {
          ...mockProducts[index]!,
          name: name ?? mockProducts[index]!.name,
          slug: slug ?? mockProducts[index]!.slug,
          shortDescription: shortDescription ?? mockProducts[index]!.shortDescription,
          fullDescription: fullDescription ?? mockProducts[index]!.fullDescription,
          price: priceNum ?? mockProducts[index]!.price,
          oldPrice: oldPriceNum !== undefined ? oldPriceNum : mockProducts[index]!.oldPrice,
          discount: discountNum !== undefined ? discountNum : mockProducts[index]!.discount,
          rating: ratingNum ?? mockProducts[index]!.rating,
          affiliateStore: affiliateStore ?? mockProducts[index]!.affiliateStore,
          affiliateUrl: affiliateUrl ?? mockProducts[index]!.affiliateUrl,
          features: features ?? mockProducts[index]!.features,
          specifications: specifications ?? mockProducts[index]!.specifications,
          pros: pros ?? mockProducts[index]!.pros,
          cons: cons ?? mockProducts[index]!.cons,
          tags: tags ?? mockProducts[index]!.tags,
          stockStatus: stockStatus ?? mockProducts[index]!.stockStatus,
          featured: featured !== undefined ? !!featured : mockProducts[index]!.featured,
          trending: trending !== undefined ? !!trending : mockProducts[index]!.trending,
          topDeal: topDeal !== undefined ? !!topDeal : mockProducts[index]!.topDeal,
          metaTitle: metaTitle ?? mockProducts[index]!.metaTitle,
          metaDescription: metaDescription ?? mockProducts[index]!.metaDescription,
          categoryId: categoryId ?? mockProducts[index]!.categoryId,
          brandId: brandId ?? mockProducts[index]!.brandId,
          updatedAt: new Date(),
          images: images
            ? images.map((url: string, idx: number) => ({
                id: `img-${idx}-${Math.random()}`,
                url,
                order: idx,
                productId: id,
              }))
            : mockProducts[index]!.images,
        };
        return NextResponse.json(mockProducts[index]);
      }
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    try {
      await prisma.product.delete({
        where: { id },
      });
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.warn("Database product delete failed. Deleting mock instead.", dbError);
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
