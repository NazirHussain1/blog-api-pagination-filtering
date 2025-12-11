"use client";

import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <div className="border p-4 rounded-md shadow-sm hover:shadow-lg transition mb-4">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-2">{post.body.substring(0, 100)}...</p>
      <p className="text-sm text-gray-500 mb-2">Author: {post.author}</p>
      <p className="text-sm text-gray-500 mb-2">Tags: {post.tags.join(", ")}</p>
      <Link href={`/posts/${post._id}`} className="text-blue-600 hover:underline">
        Read More
      </Link>
    </div>
  );
}
