import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";

// GET: List posts with pagination, filter, and sort
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

  try {
    const posts = await Post.find(filter)
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

export async function POST(req) {
  await connectDB();

  try {
    const bodyData = await req.json();
    const { title, body, author, tags } = bodyData;

    if (!title || !body || !author) {
      return new Response(
        JSON.stringify({ message: "Title, body, and author are required" }),
        { status: 400 }
      );
    }

    // Generate slug here
    let slug = title
  .toLowerCase()
  .trim()
  .replace(/\s+/g, "-")
  .replace(/[^\w\-]+/g, "");

const existingPost = await Post.findOne({ slug });
if (existingPost) {
  slug = `${slug}-${Date.now()}`; // only add timestamp if duplicate exists
}

    const post = await Post.create({
      title,
      body,
      author,
      tags: tags || [],
      slug,
    });

    return new Response(
      JSON.stringify({ message: "Post Created", post }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
