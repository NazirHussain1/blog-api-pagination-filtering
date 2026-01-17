import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";
import Comment from "@/app/models/Comment";
import Like from "@/app/models/Like"; // ✅ new
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

await connectDB();

export async function GET(req, { params }) {
  try {
    const { slug } = params;

    const post = await Post.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "name email avatar");

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

       const commentsCount = await Comment.countDocuments({ post: post._id });

  
    const likesCount = await Like.countDocuments({ post: post._id });

    return NextResponse.json({
      ...post.toObject(),
      commentsCount,
      likesCount,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}

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

export async function POST(req, { params }) {
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

    const existingLike = await Like.findOne({
      post: post._id,
      user: decoded.id,
    });

    // Toggle like
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return NextResponse.json({ liked: false, message: "Post unliked" });
    }

    await Like.create({
      post: post._id,
      user: decoded.id,
    });

    return NextResponse.json({ liked: true, message: "Post liked" });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
