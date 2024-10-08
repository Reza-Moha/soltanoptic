import authMiddleware from "@/utils/authMiddleware";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.url;
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    const user = await authMiddleware(req);
    if (user) {
      const homeUrl = new URL(`/`, req.url);
      return NextResponse.redirect(homeUrl);
    }
  }
  if (pathname.startsWith("/admin")) {
    const user = await authMiddleware(req);

    if (!user && user?.role !== process.env.ADMIN_ROLES) {
      const loginUrl = new URL(`/login?redirect=${pathname}`, req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
