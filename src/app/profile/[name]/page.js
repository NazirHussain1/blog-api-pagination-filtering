"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { toggleFollowUser } from "@/redux/features/auth/authSlice";
import PostCard from "@/app/components/PostCard/PostCard";

export default function ProfilePage() {
  const { name } = useParams();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);

  const isFollowing = user?._id && loggedInUser?.following?.includes(user._id);

  useEffect(() => {
    if (!name) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProfile = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`/api/users/profile/${name}`, { signal }),
          fetch(`/api/posts/user/${name}`, { signal }),
        ]);

        if (!userRes.ok) throw new Error("User not found");
        if (!postsRes.ok) throw new Error("Posts not found");

        const userData = await userRes.json();
        const postsData = await postsRes.json();

        setUser(userData);
        setPosts(postsData);
        setFollowersCount(userData.followers?.length || 0);

      } catch (error) {
        if (error.name !== "AbortError") toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    return () => controller.abort();
  }, [name]);

  const handleFollow = async () => {
    if (!user || !loggedInUser) return;

    try {
      await dispatch(toggleFollowUser({ targetUserId: user._id })).unwrap();

      // Optimistically update follower count
      setFollowersCount((prev) =>
        isFollowing ? prev - 1 : prev + 1
      );
    } catch (error) {
      toast.error(error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center text-red-500">User not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex gap-6 bg-white p-6 rounded shadow items-center">
        <Image
          src={user.avatar || "/avatar.png"}
          width={120}
          height={120}
          alt={user.name}
          className="rounded-full border object-cover"
        />

        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p>Followers: {followersCount}</p>
          <p>Following: {user.following?.length || 0}</p>
          {user.email && <p>Email: {user.email}</p>}
          {user.about && <p>{user.about}</p>}
        </div>

        {user._id !== loggedInUser?._id && (
          <button
            onClick={handleFollow}
            className={`ml-auto px-4 py-1 rounded text-white ${
              isFollowing ? "bg-gray-400" : "bg-blue-500"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">Posts ({posts.length})</h2>
        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={{
                ...post,
                author: post.author || { name: "Unknown", avatar: "/avatar.png" },
              }}
            />
          ))
        )}
      </div>

      <Link href="/" className="text-blue-600">
        ← Go Back
      </Link>
    </div>
  );
}
