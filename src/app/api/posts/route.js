import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 5;
  const author = searchParams.get("author");
  const tag = searchParams.get("tag");
  const sort = searchParams.get("sort") === "oldest" ? 1 : -1;

  let filter = {};
 if (author) filter.author = { $regex: author, $options: "i" };
if (tag) filter.tags = { $regex: tag, $options: "i" };

  const posts = await Post.find(filter)
    .sort({ createdAt: sort })
    .skip((page - 1) * limit)
    .limit(limit);

  return Response.json(posts);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const post = await Post.create(body);
  return Response.json({ message: "Post Created", post });
}
