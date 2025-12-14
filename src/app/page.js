"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "@/redux/features/posts/postSlice";
import PostCard from "@/app/components/PostCard/PostCard";
import Pagination from "@/app/components/Pagination/Pagination";
import FilterBar from "@/app/components/FilterBar/FilterBar";

const StateMessage = ({ message, color = "gray" }) => (
  <div className="flex justify-center items-center min-h-[40vh]">
    <p className={`text-${color}-500`}>{message}</p>
  </div>
);

export default function Home() {
  const dispatch = useDispatch();
  const { list: posts, loading, error } = useSelector((state) => state.posts);

  const [page, setPage] = useState(1);
  const [author, setAuthor] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("newest");
  const limit = 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchPosts({ page, limit, author, tag, sort }));
    }, 300); // debounce 300ms
    return () => clearTimeout(timer);
  }, [dispatch, page, author, tag, sort]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">All Posts</h1>

      <FilterBar
        author={author}
        setAuthor={setAuthor}
        tag={tag}
        setTag={setTag}
        sort={sort}
        setSort={setSort}
      />

      {loading && <StateMessage message="Loading posts..." />}
      {error && <StateMessage message={error} color="red" />}
      {!loading && !error && posts.length === 0 && <StateMessage message="No posts found" />}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading && !error && posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination page={page} setPage={setPage} hasNext={posts.length === limit} />
        </div>
      )}
    </main>
  );
}
