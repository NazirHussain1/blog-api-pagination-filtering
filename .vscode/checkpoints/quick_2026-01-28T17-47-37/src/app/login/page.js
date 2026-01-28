"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/features/auth/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
  User,
  ArrowLeft
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Please enter email & password", {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    try {
      await dispatch(loginUser({ ...form, remember })).unwrap();

      toast.success("Login Successful", {
        icon: <CheckCircle2 className="text-green-500" />
      });

      router.replace("/");
    } catch (err) {
      toast.error(err?.error || "Login failed", {
        icon: <AlertCircle className="text-red-500" />
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative">
      
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </button>

      <div className="w-full max-w-4xl z-10 grid md:grid-cols-2 gap-8 items-center">
        
        <div className="hidden md:block space-y-8">
          <div className="inline-flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-2xl">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">InsightHub</h1>
              <p className="text-blue-100 text-sm">Secure Login Portal</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-black text-gray-900 leading-tight">
              Welcome <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Back</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Access your account to continue your journey with thousands of creators and experts.
            </p>
            
            <div className="space-y-4">
              {[{ icon: LogIn, text: "Access exclusive content" }, { icon: User, text: "Manage your articles" }, { icon: Shield, text: "Secure & encrypted" }].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4 shadow-lg mx-auto">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-black text-gray-900">Sign In</CardTitle>
            <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <Label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 mr-2 text-indigo-500" />
                Email Address
              </Label>
              <div className="relative">
                <Input
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3.5 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-2 focus:ring-indigo-200"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <Label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Lock className="w-4 h-4 mr-2 text-indigo-500" />
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-12 py-3.5 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-2 focus:ring-indigo-200"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={remember}
                  onCheckedChange={setRemember}
                  className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <Label className="text-sm text-gray-700">Remember me</Label>
              </div>
              <button
                onClick={() => router.push("/forgot-password")}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Forgot password?
              </button>
            </div>

            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <LogIn className="w-5 h-5 mr-3" />
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              )}
            </Button>

            <p className="text-center text-gray-600 pt-6 border-t border-gray-100">
              Don’t have an account?{" "}
              <span
                className="text-indigo-600 cursor-pointer"
                onClick={() => router.push("/signup")}
              >
                Sign up
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
