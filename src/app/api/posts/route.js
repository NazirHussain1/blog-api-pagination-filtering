// src/app/api/posts/route.js
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";
import jwt from "jsonwebtoken";

await connectDB();

// ----------------- GET POSTS -----------------
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const tag = searchParams.get("tag");
    const sort = searchParams.get("sort") === "oldest" ? 1 : -1;

    let filter = {};
    if (tag) filter.tags = { $regex: tag, $options: "i" };

    // Populate author info (name, avatar)
    const posts = await Post.find(filter)
      .populate("author", "name email avatar") // 🔥 author details
      .sort({ createdAt: sort })
      .skip((page - 1) * limit)
      .limit(limit);

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      { status: 500 }
    );
  }
}

// ----------------- CREATE POST -----------------
export async function POST(req) {
  try {
    const bodyData = await req.json();
    const { title, body, tags, image } = bodyData;

    const token = req.cookies.get("token")?.value;
    if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const authorId = decoded.id; // 🔥 logged-in user id

    if (!title || !body) {
      return new Response(
        JSON.stringify({ message: "Title and body are required" }),
        { status: 400 }
      );
    }

    // Generate slug
    let slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
    const existingPost = await Post.findOne({ slug });
    if (existingPost) slug = `${slug}-${Date.now()}`;

    const post = await Post.create({
      title,
      body,
      slug,
      tags: tags || [],
      image: image || "",
      author: authorId, // 🔥 save reference to User
    });

    return new Response(JSON.stringify({ message: "Post Created", post }), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
