"use client";

import { useState } from "react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast("");
    setErrors({});

    // Validation
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!body.trim()) newErrors.body = "Body is required";
    if (!author.trim()) newErrors.author = "Author is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const postData = {
      title,
      body,
      author,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setToast("✅ Post successfully created!");
        setTitle("");
        setBody("");
        setAuthor("");
        setTags("");
      } else {
        setToast(`❌ Error: ${data?.message || "Failed to create post"}`);
      }
    } catch (error) {
      setToast(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setToast(""), 3000);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Post</h1>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-gray-100 border-l-4 border-blue-600 text-blue-700 p-3 rounded shadow-lg animate-fade">
          {toast}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <textarea
            placeholder="Body"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
          />
          {errors.body && (
            <p className="text-red-600 text-sm mt-1">{errors.body}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Author"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          {errors.author && (
            <p className="text-red-600 text-sm mt-1">{errors.author}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
