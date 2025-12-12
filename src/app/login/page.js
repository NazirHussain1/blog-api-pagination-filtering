"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast, Toaster } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Please enter email & password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, remember }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Login failed");
        setLoading(false);
        return;
      }

      toast.success("Login successful!");

      const role = data?.user?.role;

      setTimeout(() => {
        if (role === "admin") router.push("/posts/manage");
        else router.push("/");
      }, 800);

    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox checked={remember} onCheckedChange={setRemember} />
            <Label>Remember me</Label>
          </div>

          <Button
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don t have an account?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push("/signup")}>
              Sign Up
            </span>
          </p>
        </CardContent>
      </Card>
      <Toaster richColors />
    </div>
  );
}
