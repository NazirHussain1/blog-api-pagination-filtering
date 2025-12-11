"use client";

import { useEffect, useState } from "react";
import PostCard from "@/app/components/PostCard/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [author, setAuthor] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("newest");

  const limit = 5;

  const fetchPosts = async () => {
    setLoading(true);
    let url = `/api/posts?limit=${limit}&page=${page}&sort=${sort}`;
    if (author) url += `&author=${author}`;
    if (tag) url += `&tag=${tag}`;

    const res = await fetch(url);
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [page, author, tag, sort]);

  return (
    <div>
            <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">All Posts</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Filter by Author"
            className="border p-2 rounded"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Tag"
            className="border p-2 rounded"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Posts */}
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No posts found</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <span className="px-2 py-1">{page}</span>
          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
