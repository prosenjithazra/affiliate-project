import React from "react";
import { prisma, mockProducts, mockCategories, mockBrands } from "@repo/database";
import { Product } from "@repo/types";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchLayoutClient from "./SearchLayoutClient";

type SearchParams = Promise<{
  query?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  topDeal?: string;
  sort?: string;
}>;

async function getSearchData(params: {
  query?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  topDeal?: string;
  sort?: string;
}) {
  try {
    // Build Prisma query filters
    const whereClause: any = {};

    if (params.query) {
      whereClause.OR = [
        { name: { contains: params.query, mode: "insensitive" } },
        { shortDescription: { contains: params.query, mode: "insensitive" } },
        { brand: { name: { contains: params.query, mode: "insensitive" } } },
        { category: { name: { contains: params.query, mode: "insensitive" } } },
      ];
    }

    if (params.categoryId) {
      whereClause.categoryId = params.categoryId;
    }

    if (params.brandId) {
      whereClause.brandId = params.brandId;
    }

    if (params.topDeal === "true") {
      whereClause.OR = [
        { topDeal: true },
        { oldPrice: { gt: prisma.product.fields.price } }
      ];
    }

    const minP = params.minPrice ? parseFloat(params.minPrice) : 0;
    const maxP = params.maxPrice ? parseFloat(params.maxPrice) : Infinity;

    if (minP > 0 || maxP < Infinity) {
      whereClause.price = {
        gte: minP,
        lte: maxP === Infinity ? undefined : maxP,
      };
    }

    if (params.minRating) {
      whereClause.rating = {
        gte: parseFloat(params.minRating),
      };
    }

    // Sort order mapping
    let orderBy: any = { createdAt: "desc" };
    if (params.sort === "price_asc") orderBy = { price: "asc" };
    else if (params.sort === "price_desc") orderBy = { price: "desc" };
    else if (params.sort === "rating_desc") orderBy = { rating: "desc" };
    else if (params.sort === "discount_desc") orderBy = { discount: "desc" };

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
        brand: true,
      },
      orderBy,
    });

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });

    return { products: products as any as Product[], categories, brands };
  } catch (error) {
    console.warn("Database search failed. Using mock data filter simulation.");
    // Filter local mock array in memory to simulate search
    let filtered = [...mockProducts];

    if (params.query) {
      const q = params.query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.brand?.name.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    if (params.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === params.categoryId);
    }

    if (params.brandId) {
      filtered = filtered.filter((p) => p.brandId === params.brandId);
    }

    if (params.topDeal === "true") {
      filtered = filtered.filter((p) => p.topDeal || (p.oldPrice && p.oldPrice > p.price));
    }

    if (params.minPrice) {
      filtered = filtered.filter((p) => p.price >= parseFloat(params.minPrice!));
    }
    if (params.maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseFloat(params.maxPrice!));
    }
    if (params.minRating) {
      filtered = filtered.filter((p) => p.rating >= parseFloat(params.minRating!));
    }

    if (params.sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
    else if (params.sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
    else if (params.sort === "rating_desc") filtered.sort((a, b) => b.rating - a.rating);
    else if (params.sort === "discount_desc") {
      filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else {
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return {
      products: filtered,
      categories: mockCategories,
      brands: mockBrands,
    };
  }
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { products, categories, brands } = await getSearchData(params);

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f3f6] dark:bg-slate-950">
      <Navbar />
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <SearchLayoutClient
          initialProducts={products}
          categories={categories}
          brands={brands}
          initialFilters={{
            query: params.query || "",
            categoryId: params.categoryId || "",
            brandId: params.brandId || "",
            minPrice: params.minPrice || "",
            maxPrice: params.maxPrice || "",
            minRating: params.minRating || "",
            topDeal: params.topDeal === "true",
            sort: params.sort || "newest",
          }}
        />
      </main>
      <Footer />
    </div>
  );
}
