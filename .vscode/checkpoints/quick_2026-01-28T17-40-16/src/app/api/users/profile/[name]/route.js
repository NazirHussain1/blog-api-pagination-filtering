import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    await connectDB();

    const params = await context.params; // ✅ MUST
    const rawName = params.name;

    if (!rawName) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const name = decodeURIComponent(rawName);

    const user = await User.findOne({
      name: new RegExp(`^${name}$`, "i"),
    }).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
