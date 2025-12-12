import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Blog from "@/app/models/Blog";
import { connectDB } from "@/app/lib/db";

export async function POST(req) {
  await connectDB();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const user = jwt.verify(token, process.env.JWT_SECRET);

  const { title, body, tags } = await req.json();

  const post = await Blog.create({
    title,
    body,
    tags,
    author: user.id,
  });

  return NextResponse.json({ msg: "Post created", post });
}
