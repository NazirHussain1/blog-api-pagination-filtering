"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "@/redux/features/posts/postSlice";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreatePost() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: "",
    body: "",
    author: "",
    tags: "",
    image: null, // ready for image upload
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* ================= HANDLE FORM SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.body.trim()) newErrors.body = "Body is required";
    if (!form.author.trim()) newErrors.author = "Author is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Prepare data for Redux/API
      const postData = {
        title: form.title,
        body: form.body,
        author: form.author,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        image: form.image, // future: base64 or Cloud URL
      };

      await dispatch(createPost(postData)).unwrap();

      toast.success("Post created successfully!");
      setForm({ title: "", body: "", author: "", tags: "", image: null });
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <textarea
            placeholder="Body"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={6}
          />
          {errors.body && <p className="text-red-600 text-sm mt-1">{errors.body}</p>}
        </div>

        <div>
          <Input
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
          {errors.author && <p className="text-red-600 text-sm mt-1">{errors.author}</p>}
        </div>

        <div>
          <Input
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Post"}
        </Button>
      </form>
    </div>
  );
}
