import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/Post";

export async function GET(req, { params }) {
  await connectDB();
  const post = await Post.findById(params.id);
  return Response.json(post);
}

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const updated = await Post.findByIdAndUpdate(params.id, body, { new: true });
  return Response.json({ message: "Post Updated", updated });
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Post.findByIdAndDelete(params.id);
  return Response.json({ message: "Post Deleted" });
}
