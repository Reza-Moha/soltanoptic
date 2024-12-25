import authMiddleware from "@/utils/authMiddleware";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  const ADMIN_ROLE = Number(process.env.ADMIN_ROLES);
  const EMPLOYEE_ROLE = Number(process.env.EMPLOYEE_ROLE);
  const USER_ROLE = Number(process.env.USER_ROLE);

  const user = await authMiddleware(req);

  if (!user) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
      const loginUrl = new URL(`/login?redirect=${pathname}`, req.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const userRole = Number(user.role);

  if (pathname.startsWith("/admin/dashboard") && userRole !== ADMIN_ROLE) {
    const unauthorizedUrl = new URL(`/unauthorized`, req.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  if (
    pathname.startsWith("/employee/dashboard") &&
    userRole !== EMPLOYEE_ROLE
  ) {
    const unauthorizedUrl = new URL(`/unauthorized`, req.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  if (pathname.startsWith("/user/dashboard") && userRole !== USER_ROLE) {
    const unauthorizedUrl = new URL(`/unauthorized`, req.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (userRole === ADMIN_ROLE) {
      const adminDashboardUrl = new URL(`/admin/dashboard`, req.url);
      return NextResponse.redirect(adminDashboardUrl);
    } else if (userRole === EMPLOYEE_ROLE) {
      const employeeDashboardUrl = new URL(`/employee/dashboard`, req.url);
      return NextResponse.redirect(employeeDashboardUrl);
    } else if (userRole === USER_ROLE) {
      const userDashboardUrl = new URL(`/user/dashboard`, req.url);
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
    "/signup",
  ],
};
