import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  // Protect /posts/manage → admin only
  if (url.pathname.startsWith("/posts/manage")) {
    if (!token) {
      url.pathname = "/login"; // aapke login route ke saath match kare
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Admin check
      if (payload.role !== "admin") {
        url.pathname = "/"; // redirect normal users to home
        return NextResponse.redirect(url);
      }

    } catch {
      url.pathname = "/login"; // invalid token → login
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/manage"],
};
