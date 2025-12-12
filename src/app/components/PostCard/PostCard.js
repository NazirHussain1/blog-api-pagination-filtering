"use client";

import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition p-4 mb-6 bg-white">
      
      <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition">
        {post.title}
      </h2>

      <p className="text-gray-700 mb-3 line-clamp-3">
        {post.body}
      </p>

      <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-500">
        <span>Author: {post.author}</span>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full"
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
        Read More
      </Link>
    </div>
  );
}
