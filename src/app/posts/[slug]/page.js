"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SinglePost() {
  const { slug } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError("Post not found");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-red-500 text-lg">{error}</p>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <article className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 mt-8">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

      {/* Meta */}
      <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-2">
        <span>By <b>{post.author}</b></span>
        {post.createdAt && (
          <span>
            • {new Date(post.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full max-h-[400px] object-cover rounded mb-6"
          loading="lazy"
        />
      )}

      {/* Content */}
      <div className="text-gray-800 leading-relaxed whitespace-pre-line mb-6">
        {post.body}
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          ← Go Back
        </Button>
      </div>

    </article>
  );
}
