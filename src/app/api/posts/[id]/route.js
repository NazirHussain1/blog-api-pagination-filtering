import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  await connectDB();

  try {
    const params = await context.params; // 👈 params ko unwrap karna hai
    const post = await Post.findById(params.id);

    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error }, { status: 500 });
  }
}

export async function PUT(req, context) {
  await connectDB();

  try {
    const params = await context.params;
    const body = await req.json();
    const updated = await Post.findByIdAndUpdate(params.id, body, { new: true });

    if (!updated) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    return NextResponse.json({ message: "Post Updated", updated });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await connectDB();

  try {
    const params = await context.params;
    const deleted = await Post.findByIdAndDelete(params.id);

    if (!deleted) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    return NextResponse.json({ message: "Post Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error }, { status: 500 });
  }
}
