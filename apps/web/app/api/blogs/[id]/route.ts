import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { mockBlogPosts } from "../mockData";

export const dynamic = "force-dynamic";

// PUT /api/blogs/[id]
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
      title,
      slug,
      content,
      excerpt,
      coverImage,
      metaTitle,
      metaDescription,
      published
    } = body;

    try {
      const post = await prisma.blogPost.update({
        where: { id },
        data: {
          title,
          slug,
          content,
          excerpt,
          coverImage,
          metaTitle,
          metaDescription,
          published: published !== undefined ? !!published : undefined
        }
      });
      return NextResponse.json(post);
    } catch (dbError) {
      console.warn("Database failed to update blog post. Updating mock instead.", dbError);
      const index = mockBlogPosts.findIndex((b: any) => b.id === id);
      if (index !== -1) {
        mockBlogPosts[index] = {
          ...mockBlogPosts[index]!,
          title: title ?? mockBlogPosts[index]!.title,
          slug: slug ?? mockBlogPosts[index]!.slug,
          content: content ?? mockBlogPosts[index]!.content,
          excerpt: excerpt ?? mockBlogPosts[index]!.excerpt,
          coverImage: coverImage ?? mockBlogPosts[index]!.coverImage,
          metaTitle: metaTitle ?? mockBlogPosts[index]!.metaTitle,
          metaDescription: metaDescription ?? mockBlogPosts[index]!.metaDescription,
          published: published !== undefined ? !!published : mockBlogPosts[index]!.published,
          updatedAt: new Date()
        };
        return NextResponse.json(mockBlogPosts[index]);
      }
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/blogs/[id]
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
      await prisma.blogPost.delete({
        where: { id }
      });
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.warn("Database failed to delete blog post. Deleting mock instead.", dbError);
      const index = mockBlogPosts.findIndex((b: any) => b.id === id);
      if (index !== -1) {
        mockBlogPosts.splice(index, 1);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
