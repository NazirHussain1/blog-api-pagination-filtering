import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  // Only protect /posts/manage
  if (url.pathname.startsWith("/posts/manage")) {
    if (!token) {
      url.pathname = "/auth/login"; // redirect non-authenticated
      return NextResponse.redirect(url);
    }

    try {
      const user = verify(token, process.env.JWT_SECRET);
      if (user.role !== "admin") {
        url.pathname = "/"; // redirect non-admin
        return NextResponse.redirect(url);
      }
    } catch (err) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/manage"],
};
