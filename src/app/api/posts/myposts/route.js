import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

await connectDB();

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const posts = await Post.find({ author: decoded.id })
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
