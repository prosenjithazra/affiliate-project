import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export const dynamic = "force-dynamic";

import { mockBlogPosts } from "./mockData";

// GET /api/blogs
export async function GET(req: NextRequest) {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.warn("Database error in GET /api/blogs. Returning mock blogs fallback.");
    return NextResponse.json(mockBlogPosts);
  }
}

// POST /api/blogs
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    if (!title || !slug || !content || !excerpt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      const post = await prisma.blogPost.create({
        data: {
          title,
          slug,
          content,
          excerpt,
          coverImage: coverImage || "",
          metaTitle: metaTitle || null,
          metaDescription: metaDescription || null,
          published: published !== undefined ? !!published : true
        }
      });
      return NextResponse.json(post, { status: 201 });
    } catch (dbError) {
      console.warn("Database failed to insert blog post. Creating memory mock instead.", dbError);
      const newMock = {
        id: "blog-" + Math.random().toString(36).substring(2, 9),
        title,
        slug,
        content,
        excerpt,
        coverImage: coverImage || "",
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        published: published !== undefined ? !!published : true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockBlogPosts.push(newMock);
      return NextResponse.json(newMock, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
