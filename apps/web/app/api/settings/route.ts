import { NextRequest, NextResponse } from "next/server";
import { prisma, mockSettings } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export const dynamic = "force-dynamic";

const SETTINGS_ID = "site-settings";


// GET /api/settings
export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: SETTINGS_ID },
    });

    const defaultPromos = {
      promo1: {
        title: "Dinamic Tracking",
        desc: "Artisanal rugs, wallpaper, classic vases, and lighting accessories—well-made and carefully considered—whether made by Heath or by like-minded makers we admire. Welcome in.",
        img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
        link: "/search"
      },
      promo2: {
        title: "Audio Speaker A1",
        desc: "Lasted answer oppose to ye months no esteem. Branched is on an ecstatic directly it.",
        img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
        link: "/search"
      },
      promo3: {
        title: "Headphone",
        desc: "Headphones give you a great experience. Verified ratings and specs.",
        img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        link: "/search"
      },
      promo4: {
        title: "Smart Watch",
        desc: "It is a long established fact that a reader will. Aggregated specs and direct links.",
        img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800",
        link: "/search"
      }
    };

    if (!settings) {
      // Create default settings if not exists
      settings = await prisma.settings.create({
        data: {
          id: SETTINGS_ID,
          websiteName: "ShopZone",
          socialLinks: {},
          homepagePromos: defaultPromos,
        } as any,
      });
    } else if (!(settings as any).homepagePromos) {
      settings = {
        ...settings,
        homepagePromos: defaultPromos,
      } as any;
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
      homepagePromos,
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
          homepagePromos: homepagePromos || null,
          footerText,
          contactEmail,
          googleAnalyticsId,
        } as any,
      });
      return NextResponse.json(settings);
    } catch (dbError) {
      console.warn("Database failed to update settings. Mutating mock instead.");
      mockSettings.websiteName = websiteName ?? mockSettings.websiteName;
      mockSettings.logo = logo ?? mockSettings.logo;
      mockSettings.seoTitle = seoTitle ?? mockSettings.seoTitle;
      mockSettings.seoDescription = seoDescription ?? mockSettings.seoDescription;
      mockSettings.socialLinks = socialLinks ?? mockSettings.socialLinks;
      mockSettings.homepagePromos = homepagePromos ?? mockSettings.homepagePromos;
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
