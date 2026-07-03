import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

const requireAdmin = async () => {
  const session = await getServerSession(authOptions);
  return session && (session.user as any).role === "ADMIN";
};

// PUT /api/brands/[id]
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
    const { name, slug, logo, description } = body;

    const current = await prisma.brand.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    if (slug && slug !== current.slug) {
      const duplicate = await prisma.brand.findUnique({ where: { slug } });
      if (duplicate) {
        return NextResponse.json(
          { error: "A brand with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: name ?? current.name,
        slug: slug ?? current.slug,
        logo: logo ?? current.logo,
        description: description ?? current.description,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(brand);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/brands/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    if (brand._count.products > 0) {
      return NextResponse.json(
        { error: "Cannot delete a brand that still has products" },
        { status: 409 }
      );
    }

    await prisma.brand.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
