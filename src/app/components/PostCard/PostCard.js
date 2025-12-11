"use client";

import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <div className="border p-4 rounded shadow mb-4">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-2">{post.body.slice(0, 100)}...</p>
      <p className="text-sm text-gray-500 mb-1">Author: {post.author}</p>
      <p className="text-sm text-gray-500 mb-1">
        Tags: {post.tags.join(", ")}
      </p>

     <Link href={`/posts/${post._id.toString()}`} className="text-blue-600 hover:underline">
  Read More
</Link>

    </div>
  );
}
