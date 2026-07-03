import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

const requireAdmin = async () => {
  const session = await getServerSession(authOptions);
  return session && (session.user as any).role === "ADMIN";
};

// PUT /api/categories/[id]
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await req.json();
    const { name, slug, description, image, icon } = body;

    const current = await prisma.category.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (slug && slug !== current.slug) {
      const duplicate = await prisma.category.findUnique({ where: { slug } });
      if (duplicate) {
        return NextResponse.json(
          { error: "A category with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name ?? current.name,
        slug: slug ?? current.slug,
        description: description ?? current.description,
        image: image ?? current.image,
        icon: icon ?? current.icon,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/categories/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: "Cannot delete a category that still has products" },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
