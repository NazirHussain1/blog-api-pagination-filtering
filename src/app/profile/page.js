"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PostCard from "@/app/components/PostCard/PostCard";
import { useRouter } from "next/navigation";

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Agar user login nahi hai → login page par redirect
      router.push("/login");
      return;
    }

    const fetchMyPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts?author=${user.name}`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [user, router]);

  if (loading) return <p className="text-center mt-10">Loading your posts...</p>;
  if (!posts || posts.length === 0)
    return <p className="text-center mt-10">You have not created any posts yet.</p>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Posts</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
