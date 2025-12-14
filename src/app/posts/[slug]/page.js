"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SinglePost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
      } catch (error) {
        setPost(null);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Loading post...</p>
      </div>
    );

  if (!post)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500">Post not found</p>
      </div>
    );

  return (
    <main className="container mx-auto p-4 max-w-3xl bg-white rounded shadow mt-6">
      {/* Post Title */}
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

      {/* Published Date */}
      {post.createdAt && (
        <p className="text-sm text-gray-400 mb-2">
          Published: {new Date(post.createdAt).toLocaleDateString()}
        </p>
      )}

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-auto rounded mb-4"
        />
      )}

      {/* Post Body */}
      <p className="text-gray-700 mb-4">{post.body}</p>

      {/* Author & Tags */}
      <p className="text-sm text-gray-500 mb-1">Author: {post.author}</p>
      <p className="text-sm text-gray-500 mb-4">
        Tags: {post.tags?.join(", ") || "No tags"}
      </p>

      {/* Back Button */}
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => router.back()}
      >
        Go Back
      </button>
    </main>
  );
}
