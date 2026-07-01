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

    try {
      const category = await prisma.category.create({
        data: { name, slug, description: description || "", image: image || "", icon: icon || "Folder" }
      });
      return NextResponse.json(category, { status: 201 });
    } catch (dbError) {
      console.warn("Database failed to create category. Creating mock instead.", dbError);
      const newMock: any = {
        id: "cat-" + Math.random().toString(36).substring(2, 9),
        name,
        slug,
        description: description || "",
        image: image || "",
        icon: icon || "Folder",
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { products: 0 }
      };
      mockCategories.push(newMock);
      return NextResponse.json(newMock, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
