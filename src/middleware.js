import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // 🔒 AUTH REQUIRED ROUTES ONLY
  const protectedRoutes = [
    "/posts/create",
    "/posts/myposts",
    "/posts/manage",
    "/profile",
  ];

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // 🔴 Admin only
      if (pathname.startsWith("/posts/manage") && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/posts/:path*",
    "/profile",
  ],
};
