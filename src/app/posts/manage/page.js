"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function ManagePosts() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts?limit=100&page=1&sort=newest"); // fetch all posts like home
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data.posts);
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      toast.success("Post deleted successfully!");
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manage Posts (Admin)</h1>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <Card key={post._id} className="shadow-md">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{post.title}</CardTitle>
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/posts/edit/${post._id}`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>{post.body.substring(0, 150)}...</CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
