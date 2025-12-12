"use client";

import { useEffect, useState } from "react";
import PostCard from "@/app/components/PostCard/PostCard";
import Pagination from "@/app/components/Pagination/Pagination";
import FilterBar from "@/app/components/FilterBar/FilterBar";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [author, setAuthor] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("newest");
  const limit = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let url = `/api/posts?limit=${limit}&page=${page}&sort=${sort}`;
        if (author.trim()) url += `&author=${author.trim()}`;
        if (tag.trim()) url += `&tag=${tag.trim()}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
     setPosts(data || []);

      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, author, tag, sort]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">All Posts</h1>

      {/* Filter Bar */}
      <FilterBar
        author={author}
        setAuthor={setAuthor}
        tag={tag}
        setTag={setTag}
        sort={sort}
        setSort={setSort}
      />

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-gray-500">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-red-500">No posts found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {posts.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            page={page}
            setPage={setPage}
            hasNext={posts.length === limit}
          />
        </div>
      )}
    </main>
  );
}
