import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";

await connectDB();

export async function GET(req, context) {
  try {
      const { params } = context;
    const { name: rawName } = params;

    if (!rawName) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Decode URI in case of spaces or special characters
    const name = decodeURIComponent(rawName);

    // Find user by name (case-insensitive)
    const user = await User.findOne({ name: new RegExp(`^${name}$`, "i") }).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/users/profile/[name] error:", error);
    return NextResponse.json(
      { error: "Server Error", details: error.message },
      { status: 500 }
    );
  }
}
