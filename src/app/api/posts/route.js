import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";
import Comment from "@/app/models/Comment"; // ✅ NEW
import jwt from "jsonwebtoken";

// ----------------- GET POSTS -----------------
export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const tag = searchParams.get("tag");
    const sort = searchParams.get("sort") === "oldest" ? 1 : -1;

    let filter = {};
    if (tag) filter.tags = { $regex: tag, $options: "i" };

    const posts = await Post.find(filter)
      .populate("author", "name email avatar")
      .sort({ createdAt: sort })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(); 

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({
          post: post._id,
        });

        return {
          ...post,
          commentsCount,
        };
      })
    );

    return new Response(JSON.stringify(postsWithComments), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      { status: 500 }
    );
  }
}

// ----------------- CREATE POST -----------------
export async function POST(req) {
  await connectDB();

  try {
    const bodyData = await req.json();
    const { title, body, tags, image } = bodyData;

    const token = req.cookies.get("token")?.value;
    if (!token)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const authorId = decoded.id;

    if (!title || !body) {
      return new Response(
        JSON.stringify({ message: "Title and body are required" }),
        { status: 400 }
      );
    }

    let slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

    const existingPost = await Post.findOne({ slug });
    if (existingPost) slug = `${slug}-${Date.now()}`;

    const post = await Post.create({
      title,
      body,
      slug,
      tags: tags || [],
      image: image || "",
      author: authorId,
    });

    return new Response(JSON.stringify({ message: "Post Created", post }), {
      status: 201,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
