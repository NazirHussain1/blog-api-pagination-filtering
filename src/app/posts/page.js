"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost, updatePost } from "@/redux/features/posts/postSlice";
import PostCard from "@/app/components/PostCard/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function MyPostsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: posts, loading, error } = useSelector((state) => state.posts);

  const [editPost, setEditPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", body: "", tags: "" });
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const modalRef = useRef(null);

  // Fetch only user's posts
  useEffect(() => {
    if (user) {
      dispatch(fetchPosts({ page: 1, limit: 100, author: user._id }));
    }
  }, [dispatch, user]);

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

  // Delete post with confirmation and optimistic UI
  const handleDelete = async (postId, slug) => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      // Optimistic UI: remove post immediately
      dispatch({ type: "posts/deletePostOptimistic", payload: postId });
      await dispatch(deletePost(slug)).unwrap();
      toast.success("Post deleted");
    } catch {
      toast.error("Delete failed");
      dispatch(fetchPosts({ page: 1, limit: 100, author: user._id })); // fallback
    }
  };

  const openEdit = (post) => {
    setEditPost(post);
    setEditForm({
      title: post.title || "",
      body: post.body || "",
      tags: post.tags?.join(", ") || "",
    });
    setPreview(post.image || null);
    setNewImage(null);
  };

  const uploadImage = async () => {
    if (!newImage) return editPost.image;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", newImage);

      const res = await fetch("/api/posts/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error();
      return data.url;
    } finally {
      setUploading(false);
    }
  };

  const saveEdit = async () => {
    if (!editForm.title.trim() || !editForm.body.trim()) {
      toast.error("Title and body are required");
      return;
    }

    try {
      const imageUrl = await uploadImage();

      await dispatch(
        updatePost({
          slug: editPost.slug,
          data: {
            title: editForm.title,
            body: editForm.body,
            tags: editForm.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
            image: imageUrl,
          },
        })
      ).unwrap();

      toast.success("Post updated");
      setEditPost(null);
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold text-center">My Posts</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">You have no posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="border rounded p-4 shadow-sm">
            <PostCard post={post} />
            {post.author?._id === user._id && (
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(post)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(post._id, post.slug)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        ))
      )}

      {/* Edit Modal */}
      {editPost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4 relative"
          >
            <button
              onClick={() => setEditPost(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold">Edit Post</h2>

            <Input
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Title"
            />
            <Input
              value={editForm.tags}
              onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
              placeholder="Tags (comma separated)"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setNewImage(file);
                setPreview(URL.createObjectURL(file));
              }}
            />

            {preview && (
              <img
                src={preview}
                className="rounded border max-h-40 object-cover"
                alt="Preview"
              />
            )}

            <textarea
              className="w-full border rounded p-2 min-h-[100px]"
              value={editForm.body}
              onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
              placeholder="Body"
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditPost(null)}>
                Cancel
              </Button>
              <Button disabled={uploading} onClick={saveEdit}>
                {uploading ? "Uploading..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
