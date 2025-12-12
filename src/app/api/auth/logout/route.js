import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Remove the token cookie by setting it expired
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Logout failed", error: error.message },
      { status: 500 }
    );
  }
}
