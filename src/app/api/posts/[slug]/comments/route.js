import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";
import Comment from "@/app/models/Comment";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

await connectDB();

export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    const post = await Post.findOne({ slug });
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    const comments = await Comment.find({ post: post._id, parentComment: null })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

  
    for (let comment of comments) {
      comment.replies = await Comment.find({ parentComment: comment._id })
        .populate("user", "name avatar")
        .sort({ createdAt: 1 })
        .lean();
    }

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { slug } = await params;
    const data = await req.json(); 

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const post = await Post.findOne({ slug });
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    const comment = await Comment.create({
      post: post._id,
      user: decoded.id,
      text: data.text,
      parentComment: data.parentComment || null,
    });

    return NextResponse.json({ message: "Comment added", comment });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { slug } = await params;
    const { commentId } = await req.json();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const comment = await Comment.findById(commentId);
    if (!comment) return NextResponse.json({ message: "Comment not found" }, { status: 404 });

    const alreadyLiked = comment.likes.includes(decoded.id);
    if (alreadyLiked) {
      comment.likes = comment.likes.filter(userId => userId.toString() !== decoded.id);
      await comment.save();
      return NextResponse.json({ liked: false });
    }

    comment.likes.push(decoded.id);
    await comment.save();

    return NextResponse.json({ liked: true });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
