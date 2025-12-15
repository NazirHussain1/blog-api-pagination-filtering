import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

await connectDB();

// ----------------- GET POST -----------------
export async function GET(req, { params }) {
  try {
    const { slug } = await params; // ✅ FIX

    const post = await Post.findOne({ slug })
      .populate("author", "name email avatar");

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// ----------------- UPDATE POST -----------------
export async function PUT(req, { params }) {
  try {
    const { slug } = await params; // ✅ FIX
    const data = await req.json();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Only author or admin
    if (post.author.toString() !== decoded.id && decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await Post.findOneAndUpdate(
      { slug },
      { title: data.title, body: data.body, tags: data.tags },
      { new: true }
    );

    return NextResponse.json({ message: "Post Updated", updated });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// ----------------- DELETE POST -----------------
export async function DELETE(req, { params }) {
  try {
    const { slug } = await params; // ✅ FIX

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.author.toString() !== decoded.id && decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Post.findOneAndDelete({ slug });

    return NextResponse.json({ message: "Post Deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
