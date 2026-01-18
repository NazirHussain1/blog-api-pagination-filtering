import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";
import Comment from "@/app/models/Comment";
import Like from "@/app/models/Like"; // ✅ new
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

await connectDB();

// Helper function to get reaction counts
const getReactionCounts = async (postId) => {
  const reactions = await Like.aggregate([
    { $match: { post: postId } },
    { $group: { _id: "$reaction", count: { $sum: 1 } } }
  ]);

  const reactionCounts = {
    like: 0,
    love: 0,
    laugh: 0,
    wow: 0,
    sad: 0,
    angry: 0
  };

  reactions.forEach(r => {
    reactionCounts[r._id] = r.count;
  });

  return reactionCounts;
};

export async function GET(req, { params }) {
  try {
    const { slug } = await params;

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
    const reactions = await getReactionCounts(post._id);

    // Check if user is authenticated and get their reaction
    let userReaction = null;
    const token = req.cookies.get("token")?.value;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userLike = await Like.findOne({ post: post._id, user: decoded.id });
        userReaction = userLike ? userLike.reaction : null;
      } catch (err) {
        // Token invalid, userReaction remains null
      }
    }

    return NextResponse.json({
      ...post.toObject(),
      commentsCount,
      likesCount,
      reactions,
      userReaction,
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
    const { slug } = await params;
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
    const { slug } = await params;

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
    const { slug } = await params;
    const { reaction = "like" } = await req.json();

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

    // If user already reacted with the same reaction, remove it
    if (existingLike && existingLike.reaction === reaction) {
      await Like.deleteOne({ _id: existingLike._id });
      const likesCount = await Like.countDocuments({ post: post._id });
      const reactions = await getReactionCounts(post._id);
      return NextResponse.json({
        liked: false,
        message: "Reaction removed",
        likesCount,
        reactions,
        userReaction: null
      });
    }

    // If user reacted with different reaction, update it
    if (existingLike) {
      existingLike.reaction = reaction;
      await existingLike.save();
    } else {
      // Create new reaction
      await Like.create({
        post: post._id,
        user: decoded.id,
        reaction,
      });
    }

    const likesCount = await Like.countDocuments({ post: post._id });
    const reactions = await getReactionCounts(post._id);
    return NextResponse.json({
      liked: true,
      message: `Post reacted with ${reaction}`,
      likesCount,
      reactions,
      userReaction: reaction
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
