import { NextRequest, NextResponse } from "next/server";
import { prisma, mockSettings } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export const dynamic = "force-dynamic";

const SETTINGS_ID = "site-settings";


// GET /api/settings
export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: SETTINGS_ID },
    });

    if (!settings) {
      // Create default settings if not exists
      const defaultSettings = await prisma.settings.create({
        data: {
          id: SETTINGS_ID,
          websiteName: "AffiliateHub",
          socialLinks: {},
        },
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.warn("Database failed to load settings. Returning mock settings instead.");
    return NextResponse.json(mockSettings);
  }
}

// PUT /api/settings
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      websiteName,
      logo,
      seoTitle,
      seoDescription,
      socialLinks,
      footerText,
      contactEmail,
      googleAnalyticsId,
    } = body;

    try {
      const settings = await prisma.settings.update({
        where: { id: SETTINGS_ID },
        data: {
          websiteName,
          logo,
          seoTitle,
          seoDescription,
          socialLinks: socialLinks || {},
          footerText,
          contactEmail,
          googleAnalyticsId,
        },
      });
      return NextResponse.json(settings);
    } catch (dbError) {
      console.warn("Database failed to update settings. Mutating mock instead.");
      mockSettings.websiteName = websiteName ?? mockSettings.websiteName;
      mockSettings.logo = logo ?? mockSettings.logo;
      mockSettings.seoTitle = seoTitle ?? mockSettings.seoTitle;
      mockSettings.seoDescription = seoDescription ?? mockSettings.seoDescription;
      mockSettings.socialLinks = socialLinks ?? mockSettings.socialLinks;
      mockSettings.footerText = footerText ?? mockSettings.footerText;
      mockSettings.contactEmail = contactEmail ?? mockSettings.contactEmail;
      mockSettings.googleAnalyticsId = googleAnalyticsId ?? mockSettings.googleAnalyticsId;
      mockSettings.updatedAt = new Date();
      return NextResponse.json(mockSettings);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
