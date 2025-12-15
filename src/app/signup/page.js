"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "@/redux/features/auth/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast, Toaster } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleSignup = async () => {
    const { name, email, phone, password, confirmPassword, agree } = form;

    // 🔴 Basic validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      return toast.error("All fields are required");
    }

    // 🔴 Phone validation
    if (!/^[0-9]{10,15}$/.test(phone)) {
      return toast.error("Enter a valid phone number");
    }

    // 🔴 Password validation
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (!agree) {
      return toast.error("You must agree to Terms & Privacy Policy");
    }

    try {
      await dispatch(
        signupUser({
          name,
          email,
          phone,
          password,
          role: "user", // 🔐 force user role
        })
      ).unwrap();

      toast.success("Signup successful! Redirecting to login...");
      router.push("/login");
    } catch (err) {
      toast.error(err?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Create Your Account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Name */}
          <div>
            <Label>Full Name</Label>
            <Input
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div>
            <Label>Phone Number</Label>
            <Input
              placeholder="e.g. 03001234567"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* Password */}
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </div>

          {/* Terms */}
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.agree}
              onCheckedChange={(checked) =>
                setForm({ ...form, agree: checked })
              }
            />
            <Label className="text-sm">
              I agree to the{" "}
              <span className="text-blue-600 cursor-pointer">Terms</span> &{" "}
              <span className="text-blue-600 cursor-pointer">Privacy Policy</span>
            </Label>
          </div>

          {/* Button */}
          <Button
            className="w-full"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>

      <Toaster richColors />
    </div>
  );
}
