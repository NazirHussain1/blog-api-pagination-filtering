"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


export default function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
      } catch (error) {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!post) return <p className="p-4">Post not found</p>;

  return (
    <div>
     
      <main className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-700 mb-2">{post.body}</p>
        <p className="text-sm text-gray-500 mb-1">Author: {post.author}</p>
        <p className="text-sm text-gray-500 mb-1">Tags: {post.tags.join(", ")}</p>
        <p className="text-sm text-gray-400">
          Created At: {new Date(post.createdAt).toLocaleString()}
        </p>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </main>
    </div>
  );
}
