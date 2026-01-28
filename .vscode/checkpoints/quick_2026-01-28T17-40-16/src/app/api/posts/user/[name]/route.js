import User from "@/app/models/User";
import Post from "@/app/models/Post";
import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    await connectDB();

    const params = await context.params; // ✅ unwrap Promise
    const rawName = params.name;
    const decodedName = decodeURIComponent(rawName);

    const user = await User.findOne({
      name: new RegExp(`^${decodedName}$`, "i"),
    });

    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    // Populate author info
    const posts = await Post.find({ author: user._id })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Posts by user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
