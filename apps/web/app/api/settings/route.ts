import { NextRequest, NextResponse } from "next/server";
import { prisma, mockSettings } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export const dynamic = "force-dynamic";

const SETTINGS_ID = "site-settings";

const defaultPromos = {
  promo1: {
    title: "Dinamic Tracking",
    desc: "Artisanal rugs, wallpaper, classic vases, and lighting accessories—well-made and carefully considered—whether made by Heath or by like-minded makers we admire. Welcome in.",
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
    link: "/search",
  },
  promo2: {
    title: "Audio Speaker A1",
    desc: "Lasted answer oppose to ye months no esteem. Branched is on an ecstatic directly it.",
    img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
    link: "/search",
  },
  promo3: {
    title: "Headphone",
    desc: "Headphones give you a great experience. Verified ratings and specs.",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    link: "/search",
  },
  promo4: {
    title: "Smart Watch",
    desc: "It is a long established fact that a reader will. Aggregated specs and direct links.",
    img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800",
    link: "/search",
  },
};

const defaultContactPage = {
  title: "Contact Us",
  subtitle: "Have questions about a product specifications table, or want to list your store? Get in touch.",
  supportLabel: "Email Support",
  supportValue: "support@affiliatehub.com",
  partnershipLabel: "Partnership Queries",
  partnershipValue: "partners@affiliatehub.com",
  hotlineLabel: "Hotline",
  hotlineValue: "+1 (555) 321-7890",
  nameLabel: "Full Name",
  namePlaceholder: "John Doe",
  emailLabel: "Email Address",
  emailPlaceholder: "john@example.com",
  subjectLabel: "Subject",
  subjectPlaceholder: "e.g. Partnership Request",
  messageLabel: "Message",
  messagePlaceholder: "Write your message here...",
  submitLabel: "Send Message",
  successTitle: "Message Sent",
  successMessage: "Your message has been sent to our editor team. We'll reply within 24 hours.",
};

function withDefaultPromos(settings: any) {
  return {
    ...settings,
    homepagePromos: {
      ...defaultPromos,
      ...(settings.homepagePromos || {}),
    },
    contactPage: {
      ...defaultContactPage,
      ...(settings.contactPage || {}),
    },
    footerYear: settings.footerYear ?? 2026,
  };
}

function withoutUndefined<T extends Record<string, any>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
}

async function ensureSettingsSchema() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Settings"
    ADD COLUMN IF NOT EXISTS "contactPage" JSONB,
    ADD COLUMN IF NOT EXISTS "footerYear" INTEGER NOT NULL DEFAULT 2026
  `);
}

// GET /api/settings
export async function GET() {
  try {
    await ensureSettingsSchema();

    let settings = await prisma.settings.findUnique({
      where: { id: SETTINGS_ID },
    });

    if (!settings) {
      // Create default settings if not exists
      settings = await prisma.settings.create({
        data: {
          id: SETTINGS_ID,
          websiteName: "ShopZone",
          socialLinks: {},
          homepagePromos: defaultPromos,
          contactPage: defaultContactPage,
          footerYear: 2026,
        } as any,
      });
    }

    return NextResponse.json(withDefaultPromos(settings));
  } catch (error) {
    console.warn("Database failed to load settings. Returning mock settings instead.");
    return NextResponse.json(withDefaultPromos(mockSettings));
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
      contactPage,
      footerText,
      footerYear,
      contactEmail,
      googleAnalyticsId,
    } = body;

    try {
      await ensureSettingsSchema();

      const updateData = withoutUndefined({
        websiteName,
        logo,
        seoTitle,
        seoDescription,
        socialLinks,
        homepagePromos,
        contactPage,
        footerText,
        footerYear,
        contactEmail,
        googleAnalyticsId,
      });

      const settings = await prisma.settings.upsert({
        where: { id: SETTINGS_ID },
        create: {
          id: SETTINGS_ID,
          websiteName: websiteName ?? "ShopZone",
          logo,
          seoTitle,
          seoDescription,
          socialLinks: socialLinks || {},
          homepagePromos: homepagePromos || defaultPromos,
          contactPage: contactPage || defaultContactPage,
          footerText,
          footerYear: footerYear ?? 2026,
          contactEmail,
          googleAnalyticsId,
        } as any,
        update: updateData as any,
      });
      return NextResponse.json(withDefaultPromos(settings));
    } catch (dbError) {
      console.error("Database failed to update settings.", dbError);
      return NextResponse.json(
        { error: "Failed to save settings to the database" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
