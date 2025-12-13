"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Edit modal
  const [editPost, setEditPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", body: "" });
  const modalRef = useRef(null);

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts?limit=100&page=1&sort=newest");
      const data = await res.json();
      setPosts(data.posts || data || []);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Close modal on outside click
  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setEditPost(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // DELETE (slug based)
  const handleDelete = async (slug) => {
    toast(
      <div className="space-y-2">
        <p>Delete this post?</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              try {
                const res = await fetch(`/api/posts/${slug}`, {
                  method: "DELETE",
                });
                if (!res.ok) throw new Error();
                setPosts((prev) => prev.filter((p) => p.slug !== slug));
                toast.success("Post deleted");
              } catch {
                toast.error("Delete failed");
              }
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    );
  };

  // OPEN EDIT MODAL
  const openEdit = (post) => {
    setEditPost(post);
    setEditForm({ title: post.title, body: post.body });
  };

  // SAVE EDIT (slug based)
  const saveEdit = async () => {
    try {
      const res = await fetch(`/api/posts/${editPost.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error();

      setPosts((prev) =>
        prev.map((p) =>
          p.slug === editPost.slug ? { ...p, ...editForm } : p
        )
      );

      toast.success("Post updated");
      setEditPost(null);
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Manage Posts (Admin)</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found</p>
      ) : (
        posts.map((post) => (
          <Card key={post.slug} className="shadow-sm">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{post.title}</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(post)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(post.slug)}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>{post.body.slice(0, 120)}...</CardContent>
          </Card>
        ))
      )}

      {/* EDIT MODAL */}
      {editPost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4 relative"
          >
            <button
              onClick={() => setEditPost(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold">Edit Post</h2>

            <Input
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              placeholder="Title"
            />

            <textarea
              className="w-full border rounded p-2 min-h-[120px]"
              value={editForm.body}
              onChange={(e) =>
                setEditForm({ ...editForm, body: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditPost(null)}>
                Cancel
              </Button>
              <Button onClick={saveEdit}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
