"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "@/redux/features/posts/postSlice";
import PostCard from "@/app/components/PostCard/PostCard";
import Link from "next/link";

export default function Home() {
  const dispatch = useDispatch();
  const { list: posts, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    // 🔥 Home par sirf latest 3 posts
    dispatch(fetchPosts({ page: 1, limit: 3, sort: "newest" }));
  }, [dispatch]);

  return (
    <main className="container mx-auto p-4">
      {/* Hero Section */}
      <section className="text-center py-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Read latest articles, tutorials, and insights written by our community.
        </p>
      </section>

      {/* Latest Posts */}
      <section className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest Posts</h2>
          <Link
            href="/posts"
            className="text-blue-600 font-medium hover:underline"
          >
            View all posts →
          </Link>
        </div>

        {loading && <p className="text-center">Loading...</p>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {!loading &&
            posts.map((post) => (
              <PostCard key={post._id || post.slug} post={post} />
            ))}
        </div>
      </section>
    </main>
  );
}
