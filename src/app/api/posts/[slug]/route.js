import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";
import Comment from "@/app/models/Comment";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

await connectDB();

// ----------------- GET POST -----------------
export async function GET(req, { params }) {
  try {
    const { slug } = params;

    // ✅ VIEW +1 (SAFE)
    const post = await Post.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "name email avatar");

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // ✅ REAL COMMENTS COUNT
    const commentsCount = await Comment.countDocuments({
      post: post._id,
    });

    return NextResponse.json({
      ...post.toObject(),
      commentsCount,
    });
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
    const { slug } = params;
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
    const { slug } = params;

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
