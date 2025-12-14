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
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageUpload = async () => {
    if (!imageFile) return "";

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch("/api/posts/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      return data.url;
    } catch {
      toast.error("Image upload failed");
      throw new Error();
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.body.trim()) newErrors.body = "Body is required";
    if (!form.author.trim()) newErrors.author = "Author is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await handleImageUpload();

      const postData = {
        title: form.title,
        body: form.body,
        author: form.author,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        image: imageUrl,
      };

      await dispatch(createPost(postData)).unwrap();

      toast.success("Post created successfully");

      setForm({ title: "", body: "", author: "", tags: "" });
      setImageFile(null);
      setPreview(null);
    } catch {
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}

        <textarea
          placeholder="Body"
          className="w-full p-3 border rounded"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          rows={6}
        />
        {errors.body && <p className="text-red-600 text-sm">{errors.body}</p>}

        <Input
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        {errors.author && <p className="text-red-600 text-sm">{errors.author}</p>}

        <Input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
          }}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="rounded border max-h-48 object-cover"
          />
        )}

        <Button disabled={loading || uploading} className="w-full">
          {uploading ? "Uploading Image..." : loading ? "Creating..." : "Create Post"}
        </Button>

      </form>
    </div>
  );
}
