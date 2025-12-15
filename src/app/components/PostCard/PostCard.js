"use client";

import Link from "next/link";
import Image from "next/image";

export default function PostCard({ post }) {
  return (
    <div className="border rounded-lg shadow hover:shadow-xl transition p-4 mb-6 bg-white">
      
      {/* Post Image */}
      {post.image && (
        <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
          <Image
  src={post.image}
  alt={post.title || "Blog Post Image"}
  fill
  className="object-cover"
  priority={false}
/>

        </div>
      )}

      {/* AUTHOR INFO */}
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={post.author?.avatar || "/avatar.png"}
          alt={post.author?.name}
          width={40}
          height={40}
          className="rounded-full object-cover border"
        />

        <div className="text-sm">
          <Link
            href={`/profile/${post.author?._id}`}
            className="font-semibold text-gray-800 hover:underline"
          >
            {post.author?.name || "Unknown"}
          </Link>

          <div className="text-gray-500 text-xs">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition">
        {post.title}
      </h2>

      <p className="text-gray-700 mb-3 line-clamp-3">
        {post.body}
      </p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/posts/${post.slug}`}
        className="text-blue-600 hover:underline font-medium"
      >
        Read More →
      </Link>
    </div>
  );
}
