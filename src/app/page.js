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
        if (author) url += `&author=${author}`;
        if (tag) url += `&tag=${tag}`;

        const res = await fetch(url);
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, author, tag, sort]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>

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
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        setPage={setPage}
        hasNext={posts.length === limit}
      />
    </main>
  );
}
