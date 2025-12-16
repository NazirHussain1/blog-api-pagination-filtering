"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PostCard from "@/app/components/PostCard/PostCard";
import { toast } from "sonner";

export default function ProfilePage() {
  const params = useParams();
  const { name } = params; // Use name instead of username

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;

    const fetchProfile = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`/api/users/profile/${name}`), // fetch by name
          fetch(`/api/posts/user/${name}`), // fetch posts by author name
        ]);

        if (!userRes.ok) throw new Error("User not found");
        if (!postsRes.ok) throw new Error("Posts not found");

        const userData = await userRes.json();
        const postsData = await postsRes.json();

        setUser(userData);
        setPosts(postsData);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [name]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user)
    return <p className="text-center mt-10 text-red-500">User not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* ================= USER INFO ================= */}
      <div className="flex items-center gap-6 bg-white p-6 rounded-lg shadow">
        <Image
          src={user.avatar || "/avatar.png"}
          width={120}
          height={120}
          alt={user.name}
          className="rounded-full object-cover border"
        />
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-gray-500 text-sm">
            {user.email && <span>Email: {user.email}</span>}
            {user.phone && <span>Phone: {user.phone}</span>}
            {user.location && <span>Location: {user.location}</span>}
          </div>
          {user.about && <p className="mt-2 text-gray-700">{user.about}</p>}
        </div>
      </div>

      {/* ================= USER POSTS ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {user.name} Posts ({posts.length})
        </h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>

      <Link href="/" className="text-blue-600 hover:underline">
        ← Go Back
      </Link>
    </div>
  );
}
