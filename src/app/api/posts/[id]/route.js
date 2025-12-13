import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  const post = await Post.findById(params.id);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();

  const post = await Post.findByIdAndUpdate(params.id, body, { new: true });

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function DELETE(req, { params }) {
  await connectDB();
  const post = await Post.findByIdAndDelete(params.id);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
