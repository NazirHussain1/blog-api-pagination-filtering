"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", body: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      setFetching(true);
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setForm({ title: data.post.title, body: data.post.body });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and body are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update post");
      toast.success("Post updated successfully!");
      router.push("/posts/manage");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500">Loading post...</p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto my-8 p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <Label>Body</Label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={8}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Updating..." : "Update Post"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
