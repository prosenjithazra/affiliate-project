import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  const pathname = url.pathname;

  // 1. Force HTTPS in production environment
  const proto = request.headers.get("x-forwarded-proto") || "http";
  if (process.env.NODE_ENV === "production" && proto === "http") {
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  // 2. Redirect WWW to Non-WWW for canonical domain consistency
  if (host.startsWith("www.")) {
    const cleanHost = host.replace("www.", "");
    const response = NextResponse.redirect(
      `https://${cleanHost}${pathname}${url.search}`,
      301
    );
    return response;
  }

  // 3. Trailing Slash Normalization: Remove trailing slashes for clean canonical URLs
  if (pathname !== "/" && pathname.endsWith("/")) {
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }

  // 4. Admin Auth Protection:
  const adminAuthPaths = [
    "/admin/dashboard",
    "/admin/products",
    "/admin/categories",
    "/admin/brands",
    "/admin/homepage",
    "/admin/blog",
    "/admin/settings"
  ];
  
  const requiresAdminAuth = adminAuthPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  
  if (requiresAdminAuth) {
    // Bypass next-auth redirections during production builds to permit static page data extraction
    if (
      process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.IS_BUILD === "true" ||
      process.env.NODE_ENV === "test"
    ) {
      return NextResponse.next();
    }

    const token =
      (await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: true,
      })) ??
      (await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: false,
      }));

    const isAdmin =
      token?.role === "ADMIN" || token?.email === "admin@affiliate.com";

    if (!isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.href);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Construct CSP rules. Next's statically generated app shell includes inline
  // hydration scripts, so production must allow inline scripts unless every page
  // is rendered dynamically with a matching nonce.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com https://*.supabase.co;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  // Forward CSP via request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("content-security-policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  // Inject standard HTTP security headers and CSP policy rules
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

// Next.js matcher to exclude static bundles, images, and API endpoints
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.txt|.*\\.xml|manifest.json|site.webmanifest|browserconfig.xml).*)"
  ]
};
