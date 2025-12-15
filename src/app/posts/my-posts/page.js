"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";

export default function MyPostsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editData, setEditData] = useState({ title: "", body: "" });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts/myposts");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPosts(data);
      } catch {
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  if (authLoading || loading) return <p className="text-center mt-10">Loading...</p>;

  const deletePost = async (slug) => {
    if (!confirm("Delete this post?")) return;

    const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });

    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
      toast.success("Post deleted");
    } else {
      toast.error("Delete failed");
    }
  };

  const updatePost = async () => {
    if (!editData.title || !editData.body) {
      toast.error("All fields required");
      return;
    }

    const res = await fetch(`/api/posts/${editingPost.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });

    if (res.ok) {
      const updated = await res.json();
      setPosts((prev) => prev.map((p) => (p.slug === updated.slug ? updated : p)));
      toast.success("Post updated");
      setEditingPost(null);
    } else {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <Toaster richColors />
      <h1 className="text-3xl font-bold text-center mb-6">My Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {posts.length === 0 && <p className="col-span-2 text-center">No posts found</p>}

        {posts.map((post) => (
          <Card key={post._id} className="p-4 shadow">
            {post.image && (
              <div className="relative h-40 mb-3">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}

            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600 line-clamp-3">{post.body}</p>

            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingPost(post);
                  setEditData({ title: post.title, body: post.body });
                }}
              >
                Edit
              </Button>
              <Button variant="destructive" onClick={() => deletePost(post.slug)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Edit Post</h2>

            <Input
              className="mb-3"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            />

            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={5}
              value={editData.body}
              onChange={(e) => setEditData({ ...editData, body: e.target.value })}
            />

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditingPost(null)}>
                Cancel
              </Button>
              <Button onClick={updatePost}>Save</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
