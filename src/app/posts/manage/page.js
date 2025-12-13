"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import FilterBar from "@/app/components/FilterBar/FilterBar";

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [author, setAuthor] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("newest");

  // edit modal
  const [editPost, setEditPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", body: "" });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `/api/posts?limit=100&page=1&sort=${sort}`;
      if (author) url += `&author=${author}`;
      if (tag) url += `&tag=${tag}`;

      const res = await fetch(url);
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
  }, [author, tag, sort]);

  // DELETE with toast confirm
  const handleDelete = (id) => {
    toast(
      <div className="space-y-2">
        <p>Delete this post?</p>
        <Button
          size="sm"
          variant="destructive"
          onClick={async () => {
            try {
              await fetch(`/api/posts/${id}`, { method: "DELETE" });
              setPosts((prev) => prev.filter((p) => p._id !== id));
              toast.success("Post deleted");
            } catch {
              toast.error("Delete failed");
            }
          }}
        >
          Confirm Delete
        </Button>
      </div>
    );
  };

  const openEdit = (post) => {
    setEditPost(post);
    setEditForm({ title: post.title, body: post.body });
  };

  const saveEdit = async () => {
    try {
      await fetch(`/api/posts/${editPost._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      setPosts((prev) =>
        prev.map((p) =>
          p._id === editPost._id ? { ...p, ...editForm } : p
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

      {/* FILTER BAR */}
      <FilterBar
        author={author}
        setAuthor={setAuthor}
        tag={tag}
        setTag={setTag}
        sort={sort}
        setSort={setSort}
      />

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-center">No posts found</p>
      ) : (
        posts.map((post) => (
          <Card key={post._id}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{post.title}</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(post)}>
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
            <CardContent>{post.body.slice(0, 120)}...</CardContent>
          </Card>
        ))
      )}

      {/* EDIT MODAL */}
      {editPost && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setEditPost(null)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-lg relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ❌ */}
            <button
              className="absolute top-3 right-3 text-xl"
              onClick={() => setEditPost(null)}
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold">Edit Post</h2>

            <Input
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
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
