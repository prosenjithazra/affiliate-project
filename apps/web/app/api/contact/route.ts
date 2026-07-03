import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export const dynamic = "force-dynamic";

async function ensureContactMessageTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ContactMessage" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "subject" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
    )
  `);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureContactMessageTable();

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to load contact messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureContactMessageTable();

    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required" },
        { status: 400 }
      );
    }

    const saved = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to save contact message" },
      { status: 500 }
    );
  }
}
