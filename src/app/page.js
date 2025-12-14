"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "@/redux/features/posts/postSlice";
import PostCard from "@/app/components/PostCard/PostCard";
import Pagination from "@/app/components/Pagination/Pagination";
import FilterBar from "@/app/components/FilterBar/FilterBar";

export default function Home() {
  const dispatch = useDispatch();
  const { list: posts, loading, error } = useSelector((state) => state.posts);

  // Local state for filters / pagination
  const [page, setPage] = useState(1);
  const [author, setAuthor] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("newest");
  const limit = 5;

  useEffect(() => {
    dispatch(fetchPosts({ page, limit, author, tag, sort }));
  }, [dispatch, page, author, tag, sort]);

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

      {/* Loading / Error / Empty */}
      {loading && (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-gray-500">Loading posts...</p>
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      {!loading && !error && posts.length === 0 && (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-gray-500">No posts found</p>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {posts.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination page={page} setPage={setPage} hasNext={posts.length === limit} />
        </div>
      )}
    </main>
  );
}
