import { NextRequest, NextResponse } from "next/server";
import { prisma, mockBrands } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// PUT /api/brands/[id]
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
    const { name, slug, logo, description } = body;

    try {
      const brand = await prisma.brand.update({
        where: { id },
        data: { name, slug, logo, description }
      });
      return NextResponse.json(brand);
    } catch (dbError) {
      console.warn("Database failed to update brand. Updating mock instead.", dbError);
      const index = mockBrands.findIndex((b) => b.id === id);
      if (index !== -1) {
        mockBrands[index] = {
          ...mockBrands[index]!,
          name: name ?? mockBrands[index]!.name,
          slug: slug ?? mockBrands[index]!.slug,
          logo: logo ?? mockBrands[index]!.logo,
          description: description ?? mockBrands[index]!.description,
          updatedAt: new Date()
        };
        return NextResponse.json(mockBrands[index]);
      }
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/brands/[id]
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
      await prisma.brand.delete({
        where: { id }
      });
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.warn("Database failed to delete brand. Deleting mock instead.", dbError);
      const index = mockBrands.findIndex((b) => b.id === id);
      if (index !== -1) {
        mockBrands.splice(index, 1);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
