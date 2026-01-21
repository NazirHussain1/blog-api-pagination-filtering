import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";
import Comment from "@/app/models/Comment";
import Like from "@/app/models/Like";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

export async function GET(req) {
  await connectDB();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch only posts created by the logged-in user
    const posts = await Post.find({ author: decoded.id }).sort({ createdAt: -1 });

    // Add comments and likes counts to each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        const likesCount = await Like.countDocuments({ post: post._id });
        const reactions = await getReactionCounts(post._id);
        
        // Get user's reaction for this post
        const userLike = await Like.findOne({ post: post._id, user: decoded.id });
        const userReaction = userLike ? userLike.reaction : null;
        
        return {
          ...post.toObject(),
          comments: commentsCount,
          likes: likesCount,
          reactions,
          userReaction,
        };
      })
    );

    return NextResponse.json(postsWithCounts);
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
