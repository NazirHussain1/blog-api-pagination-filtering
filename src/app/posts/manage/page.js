"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost, updatePost } from "@/redux/features/posts/postSlice";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";
export default function ManagePosts() {
  const dispatch = useDispatch();
  const { list: posts, loading, error } = useSelector((state) => state.posts);

  const [editPost, setEditPost] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    body: "",
    author: "",
    tags: "",
  });

  const modalRef = useRef(null);

  // Fetch posts on mount
  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 100, sort: "newest" }));
  }, [dispatch]);

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

  /* ================= DELETE POST ================= */
  const handleDelete = (slug) => {
    toast("Delete this post?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await dispatch(deletePost(slug)).unwrap();
            toast.success("Post deleted");
          } catch {
            toast.error("Delete failed");
          }
        },
      },
      cancel: { label: "Cancel" },
    });
  };

  /* ================= OPEN EDIT MODAL ================= */
  const openEdit = (post) => {
    setEditPost(post);
    setEditForm({
      title: post.title || "",
      body: post.body || "",
      author: post.author || "",
      tags: post.tags?.join(", ") || "",
    });
  };

  /* ================= SAVE EDIT ================= */
  const saveEdit = async () => {
    try {
      await dispatch(
        updatePost({
          slug: editPost.slug,
          data: {
            title: editForm.title,
            body: editForm.body,
            author: editForm.author,
            tags: editForm.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          },
        })
      ).unwrap();

      toast.success("Post updated");
      setEditPost(null);
    } catch {
      toast.error("Update failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Manage Posts (Admin)</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
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
                <Button size="sm" variant="destructive" onClick={() => handleDelete(post.slug)}>
                  Delete
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 text-sm text-gray-700">
              <p><b>Author:</b> {post.author}</p>
              <p><b>Slug:</b> {post.slug}</p>
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-600">{post.body.slice(0, 120)}...</p>
            </CardContent>
          </Card>
        ))
      )}

      {/* ================= EDIT MODAL ================= */}
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
              placeholder="Title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />

            <Input
              placeholder="Author"
              value={editForm.author}
              onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
            />

            <Input
              placeholder="Tags (comma separated)"
              value={editForm.tags}
              onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
            />

            <textarea
              className="w-full border rounded p-2 min-h-[100px]"
              placeholder="Body"
              value={editForm.body}
              onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
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
