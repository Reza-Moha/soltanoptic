import authMiddleware from "@/utils/authMiddleware";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  const ADMIN_ROLE = Number(process.env.ADMIN_ROLE);
  const EMPLOYEE_ROLE = Number(process.env.EMPLOYEE_ROLE);
  const USER_ROLE = Number(process.env.USER_ROLE);

  const user = await authMiddleware(req);
  if (!user) {
    if (
      pathname.startsWith("/admin/") ||
      pathname.startsWith("/employee/") ||
      pathname.startsWith("/user/")
    ) {
      const loginUrl = new URL(
        `/login?redirect=${encodeURIComponent(pathname)}`,
        req.url,
      );
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const userRole = Number(user.role);

  if (pathname.startsWith("/admin/dashboard") && userRole !== ADMIN_ROLE) {
    const unauthorizedUrl = new URL(`/login`, req.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  if (pathname.startsWith("/employee") && userRole !== EMPLOYEE_ROLE) {
    const unauthorizedUrl = new URL(`/login`, req.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  if (pathname.startsWith("/user") && userRole !== USER_ROLE) {
    const unauthorizedUrl = new URL(`/login`, req.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  if (pathname.startsWith("/login")) {
    if (userRole === ADMIN_ROLE) {
      const adminDashboardUrl = new URL(`/admin/dashboard`, req.url);
      return NextResponse.redirect(adminDashboardUrl);
    } else if (userRole === EMPLOYEE_ROLE) {
      const employeeDashboardUrl = new URL(`/employee`, req.url);
      return NextResponse.redirect(employeeDashboardUrl);
    } else if (userRole === USER_ROLE) {
      const userDashboardUrl = new URL(`/user/`, req.url);
      return NextResponse.redirect(userDashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/employee/:path*",
    "/user/:path*",
    "/login",
  ],
};
