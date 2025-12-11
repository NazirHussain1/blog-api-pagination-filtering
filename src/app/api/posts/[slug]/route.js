import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";
import { NextResponse } from "next/server";

// GET: Fetch a single post by slug
export async function GET(req, context) {
  await connectDB();
  try {
    const { slug } = await context.params; // unwrap promise
    const post = await Post.findOne({ slug });

    if (!post)
      return NextResponse.json({ message: "Post not found" }, { status: 404 });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}

// PUT: Update a single post by slug
export async function PUT(req, context) {
  await connectDB();
  try {
    const { slug } = await context.params; // unwrap promise
    const data = await req.json();

    const updated = await Post.findOneAndUpdate({ slug }, data, { new: true });

    if (!updated)
      return NextResponse.json({ message: "Post not found" }, { status: 404 });

    return NextResponse.json({ message: "Post Updated", updated });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a single post by slug
export async function DELETE(req, context) {
  await connectDB();
  try {
    const { slug } = await context.params; // unwrap promise
    const deleted = await Post.findOneAndDelete({ slug });

    if (!deleted)
      return NextResponse.json({ message: "Post not found" }, { status: 404 });

    return NextResponse.json({ message: "Post Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
