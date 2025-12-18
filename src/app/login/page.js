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
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
  User,
  Facebook,
  Twitter,
  Github,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Please enter email & password", {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    setIsAnimating(true);
    try {
      const result = await dispatch(
        loginUser({ ...form, remember })
      ).unwrap();

      toast.success("Welcome Back!", {
        description: "You have successfully logged in",
        icon: <CheckCircle2 className="text-green-500" />,
        duration: 3000
      });

      // Confetti effect on successful login
      if (typeof window !== 'undefined') {
        const confetti = import('canvas-confetti');
        confetti.then((confetti) => {
          confetti.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        });
      }

      setTimeout(() => {
        if (result.user.role === "admin") {
          router.push("/posts/manage");
        } else {
          router.push("/");
        }
      }, 1500);

    } catch (err) {
      toast.error(err?.error || "Login failed", {
        icon: <AlertCircle className="text-red-500" />
      });
      setIsAnimating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full opacity-10"></div>
      </div>

      {/* Back to Home Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300 z-10"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </button>

      <div className="w-full max-w-4xl z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Info */}
          <div className="hidden md:block">
            <div className="space-y-8">
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
                  {[
                    { icon: Sparkles, text: "Access exclusive content" },
                    { icon: User, text: "Manage your articles" },
                    { icon: Shield, text: "Secure & encrypted" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Credentials */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Demo Credentials</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span><span className="font-semibold">Email:</span> demo@insighthub.com</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span><span className="font-semibold">Password:</span> demo123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className={`transition-all duration-500 transform ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
                    <LogIn className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-black text-gray-900">Sign In</CardTitle>
                  <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Email Field */}
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
                      className="w-full pl-12 pr-4 py-3.5 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Password Field */}
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
                      className="w-full pl-12 pr-12 py-3.5 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
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

                {/* Remember & Forgot */}
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
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors duration-300"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <Button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Signing In...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <LogIn className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Facebook, color: "bg-blue-600 hover:bg-blue-700", label: "Facebook" },
                    { icon: Twitter, color: "bg-sky-500 hover:bg-sky-600", label: "Twitter" },
                    { icon: Github, color: "bg-gray-800 hover:bg-gray-900", label: "GitHub" }
                  ].map((social, idx) => (
                    <button
                      key={idx}
                      className={`${social.color} text-white p-3 rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300`}
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="ml-2 font-medium hidden sm:inline">{social.label}</span>
                    </button>
                  ))}
                </div>

                {/* Sign Up Link */}
                <div className="pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-600">
                    Do not have an account?{" "}
                    <button
                      onClick={() => router.push("/signup")}
                      className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition-colors duration-300"
                    >
                      Create account
                    </button>
                  </p>
                </div>

                {/* Security Note */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">Secure Connection</span>
                      <div className="text-gray-600">Your login is encrypted and secure</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}