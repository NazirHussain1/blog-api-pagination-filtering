"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast, Toaster } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // default role
    agree: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      return toast.error("Please fill all fields");
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) return toast.error("Please enter a valid email");

    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");

    if (!form.agree) return toast.error("You must agree to Terms & Privacy Policy");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Signup failed");
        setLoading(false);
        return;
      }

      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1000);

    } catch {
      toast.error("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Create Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

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

          <div>
  <Label>Role</Label>
  <select
    value={form.role}
    onChange={(e) => setForm({ ...form, role: e.target.value })}
    className="w-full border rounded p-2"
  >
    <option value="user">User</option>
    <option value="admin">Admin</option>
  </select>
</div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.agree}
              onCheckedChange={(checked) => setForm({ ...form, agree: checked })}
            />
            <Label>I agree to Terms & Privacy Policy</Label>
          </div>

          <Button
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push("/login")}>
              Login
            </span>
          </p>
        </CardContent>
      </Card>
      <Toaster richColors />
    </div>
  );
}
