"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast, Toaster } from "sonner";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "", agree: false });
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    if (!form.agree) {
      toast.error("You must agree to Terms & Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1000);

    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
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
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.agree}
              onCheckedChange={(checked) => setForm({ ...form, agree: checked })}
            />
            <Label>I agree to Terms & Privacy Policy</Label>
          </div>
          <Button className="w-full" onClick={handleSignup} disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Global Toaster */}
      <Toaster richColors />
    </div>
  );
}
