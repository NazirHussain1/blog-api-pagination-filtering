"use client";

import Link from "next/link";
import Image from "next/image";

export default function PostCard({ post }) {
  // ✅ Safely extract post body (string only)
  const postBody =
    typeof post.body === "string"
      ? post.body
      : post.body?.text || post.body?.content || "";

  return (
    <div className="border rounded-lg shadow hover:shadow-xl transition p-4 mb-6 bg-white">
      
      {/* ================= POST IMAGE ================= */}
      {post.image && (
        <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
          <Image
            src={post.image}
            alt={post.title ? `${post.title} image` : "Blog post image"}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* ================= AUTHOR INFO ================= */}
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={post.author?.avatar || "/avatar.png"}
          alt={post.author?.name || "Author profile picture"}
          width={40}
          height={40}
          className="rounded-full object-cover border"
        />

        <div className="text-sm">
          <Link
            href={`/profile/${post.author?._id}`}
            className="font-semibold text-gray-800 hover:underline"
          >
            {post.author?.name || "Unknown Author"}
          </Link>

          <div className="text-gray-500 text-xs">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : ""}
          </div>
        </div>
      </div>

      {/* ================= TITLE ================= */}
      <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition">
        {post.title}
      </h2>

      {/* ================= BODY PREVIEW ================= */}
      <p className="text-gray-700 mb-3 line-clamp-3">
        {postBody || "No content available..."}
      </p>

      {/* ================= TAGS ================= */}
      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ================= READ MORE ================= */}
      <Link
        href={`/posts/${post.slug}`}
        className="text-blue-600 hover:underline font-medium"
      >
        Read More →
      </Link>
    </div>
  );
}
