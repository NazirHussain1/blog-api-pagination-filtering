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

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setForm({ title: data.post.title, body: data.post.body });
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async () => {
    if (!form.title || !form.body) {
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
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
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
            />
          </div>
          <div>
            <Label>Body</Label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={8}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Post"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
