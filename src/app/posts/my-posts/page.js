"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch logged-in user
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!data.user) {
          toast.error("Please login first");
          router.push("/login");
          return;
        }
        setUser(data.user);

        // Fetch user's posts
        const postsRes = await fetch(`/api/posts?author=${data.user.name}`);
        const postsData = await postsRes.json();
        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load profile");
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster richColors />

      {/* User Info */}
      <Card className="max-w-3xl mx-auto mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <Input value={user.name} disabled />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <label className="block font-medium">Role</label>
            <Input value={user.role} disabled />
          </div>
        </CardContent>
      </Card>

      {/* User Posts */}
      <h2 className="text-2xl font-bold mb-4 text-center">My Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {posts.length === 0 && <p className="col-span-2 text-center">You have not created any posts yet.</p>}
        {posts.map((post) => (
          <Card key={post._id} className="shadow hover:shadow-xl transition p-4">
            {post.image && (
              <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title || "Post Image"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="text-gray-700 mb-2 line-clamp-3">{post.body}</p>
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <Link
              href={`/posts/${post.slug}`}
              className="text-blue-600 hover:underline font-medium"
            >
              Read More
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
