import { NextRequest, NextResponse } from "next/server";
import { prisma, mockCategories } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export const dynamic = "force-dynamic";

// GET /api/categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: "asc" }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.warn("Database error in GET /api/categories. Falling back to mock data.");
    // Map mock categories with product counts (all default to 1 for visuals)
    const fallback = mockCategories.map((c) => ({
      ...c,
      _count: { products: 1 }
    }));
    return NextResponse.json(fallback);
  }
}

// POST /api/categories
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description, image, icon } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || "",
        image: image || "",
        icon: icon || "Folder"
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
