"use client";

import Link from "next/link";
import Image from "next/image";
import { UserCircle } from "lucide-react";

export default function PostCard({ post }) {
  const postBody =
    typeof post.body === "string"
      ? post.body
      : post.body?.text || post.body?.content || "";

  return (
    <div className="border rounded-lg bg-white shadow-sm hover:shadow-md transition p-5">
      {post.image && (
        <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
          <Image
            src={post.image}
            alt={post.title || "Post image"}
            fill
            className="object-cover"
          />
        </div>
      )}

    {/* AUTHOR */}
<div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
  <Link
    href={`/profile/${post.author?.name}`} // use name instead of username
    className="flex items-center gap-1 hover:text-blue-600"
  >
    <UserCircle size={20} />
    <span className="font-medium">
      {post.author?.name || "Unknown Author"}
    </span>
  </Link>

  <span className="text-gray-400">•</span>

  <span>
    {post.createdAt
      ? new Date(post.createdAt).toLocaleDateString()
      : ""}
  </span>
</div>


      {/* TITLE */}
      <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition">
        {post.title}
      </h2>

      {/* BODY */}
      <p className="text-gray-700 mb-4 line-clamp-3">
        {postBody || "No content available"}
      </p>

      {/* TAGS */}
      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* READ MORE */}
      <Link
        href={`/posts/${post.slug}`}
        className="text-blue-600 font-medium hover:underline"
      >
        Read more →
      </Link>
    </div>
  );
}
