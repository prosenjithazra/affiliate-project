import { NextRequest, NextResponse } from "next/server";
import { prisma, mockBrands } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export const dynamic = "force-dynamic";


// GET /api/brands
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: "asc" }
    });
    return NextResponse.json(brands);
  } catch (error) {
    console.warn("Database error in GET /api/brands. Falling back to mock data.");
    const fallback = mockBrands.map((b) => ({
      ...b,
      _count: { products: 1 }
    }));
    return NextResponse.json(fallback);
  }
}

// POST /api/brands
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, logo, description } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const existing = await prisma.brand.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "A brand with this slug already exists" }, { status: 409 });
    }

    const brand = await prisma.brand.create({
      data: { name, slug, logo: logo || "", description: description || "" },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    return NextResponse.json(brand, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
