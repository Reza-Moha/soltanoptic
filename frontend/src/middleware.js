import authMiddleware from "@/utils/authMiddleware";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  const ADMIN_ROLE = Number(process.env.ADMIN_ROLE);
  const EMPLOYEE_ROLE = Number(process.env.EMPLOYEE_ROLE);
  const WORKSHOP_MANAGER_ROLE = Number(process.env.WORKSHOP_MANAGER_ROLE);
  const SALES_AGENT_ROLE = Number(process.env.SALES_AGENT_ROLE);
  const USER_ROLE = Number(process.env.USER_ROLE);

  const ROLE_PATH_MAP = {
    [ADMIN_ROLE]: ["/admin"],
    [EMPLOYEE_ROLE]: ["/employee"],
    [WORKSHOP_MANAGER_ROLE]: ["/employee"],
    [SALES_AGENT_ROLE]: ["/employee"],
    [USER_ROLE]: ["/user"],
  };

  const user = await authMiddleware(req);

  if (!user) {
    const needsAuth = ["/admin/", "/employee/", "/user/"].some((path) =>
      pathname.startsWith(path),
    );
    if (needsAuth) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, req.url),
      );
    }
    return NextResponse.next();
  }

  const userRole = Number(user.role);

  if (pathname.startsWith("/login")) {
    const defaultRedirectPath = ROLE_PATH_MAP[userRole]?.[0] || "/user";
    return NextResponse.redirect(new URL(defaultRedirectPath, req.url));
  }

  const allowedPaths = ROLE_PATH_MAP[userRole] || [];
  const isAllowedPath = allowedPaths.some((path) => pathname.startsWith(path));

  if (!isAllowedPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/user/:path*", "/login"],
};
