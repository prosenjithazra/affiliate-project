import { NextRequest, NextResponse } from "next/server";
import { prisma, mockCategories } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// PUT /api/categories/[id]
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
    const { name, slug, description, image, icon } = body;

    try {
      const category = await prisma.category.update({
        where: { id },
        data: { name, slug, description, image, icon }
      });
      return NextResponse.json(category);
    } catch (dbError) {
      console.warn("Database failed to update category. Updating mock instead.", dbError);
      const index = mockCategories.findIndex((c) => c.id === id);
      if (index !== -1) {
        mockCategories[index] = {
          ...mockCategories[index]!,
          name: name ?? mockCategories[index]!.name,
          slug: slug ?? mockCategories[index]!.slug,
          description: description ?? mockCategories[index]!.description,
          image: image ?? mockCategories[index]!.image,
          icon: icon ?? mockCategories[index]!.icon,
          updatedAt: new Date()
        };
        return NextResponse.json(mockCategories[index]);
      }
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/categories/[id]
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
      await prisma.category.delete({
        where: { id }
      });
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.warn("Database failed to delete category. Deleting mock instead.", dbError);
      const index = mockCategories.findIndex((c) => c.id === id);
      if (index !== -1) {
        mockCategories.splice(index, 1);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
