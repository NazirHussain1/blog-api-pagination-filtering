"use client";

import Link from "next/link";
import Image from "next/image";

export default function PostCard({ post }) {
  return (
    <div className="border rounded-lg shadow hover:shadow-xl transition p-4 mb-6 bg-white hover:scale-[1.01] duration-200">
      
      {post.image && (
        <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority={false}
          />
        </div>
      )}

      <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition">
        {post.title}
      </h2>

      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Author: {post.author}</span>
        {post.createdAt && <span>{new Date(post.createdAt).toLocaleDateString()}</span>}
      </div>

      <p className="text-gray-700 mb-3 line-clamp-3">{post.body}</p>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200 transition"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/posts/${post.slug}`}
        aria-label={`Read more about ${post.title}`}
        className="text-blue-600 hover:underline font-medium"
      >
        Read More
      </Link>
    </div>
  );
}
