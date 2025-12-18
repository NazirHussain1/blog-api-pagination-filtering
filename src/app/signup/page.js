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
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Users,
  Globe,
  Award,
  ArrowLeft,
  Facebook,
  Twitter,
  Github
} from "lucide-react";
import Link from "next/link";

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
    role: "user"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNextStep = () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.phone) {
        toast.error("Please fill in all personal details", {
          icon: <AlertCircle className="text-red-500" />
        });
        return;
      }
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
        toast.error("Please enter a valid email address", {
          icon: <AlertCircle className="text-red-500" />
        });
        return;
      }
      if (!/^[0-9]{10,15}$/.test(form.phone)) {
        toast.error("Please enter a valid phone number", {
          icon: <AlertCircle className="text-red-500" />
        });
        return;
      }
    }
    setIsAnimating(true);
    setTimeout(() => {
      setStep(step + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrevStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(step - 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleSignup = async () => {
    const { name, email, phone, password, confirmPassword, agree } = form;

    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error("All fields are required", {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    if (!/^[0-9]{10,15}$/.test(phone)) {
      toast.error("Enter a valid phone number (10-15 digits)", {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters", {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      toast.error("Password must contain uppercase, lowercase & numbers", {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    if (!agree) {
      toast.error("You must agree to Terms & Privacy Policy", {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    try {
      await dispatch(signupUser({
        name,
        email,
        phone,
        password,
        role: form.role
      })).unwrap();

      toast.success("Welcome to InsightHub!", {
        description: "Your account has been created successfully",
        icon: <CheckCircle2 className="text-green-500" />,
        duration: 5000
      });
      
      // Confetti celebration
      if (typeof window !== 'undefined') {
        const confetti = import('canvas-confetti');
        confetti.then((confetti) => {
          confetti.default({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        });
      }

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      toast.error(err?.error || "Signup failed", {
        icon: <AlertCircle className="text-red-500" />
      });
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Security", icon: Shield },
    { number: 3, title: "Account Type", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full opacity-10"></div>
      </div>

      {/* Back Button */}
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
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">InsightHub</h1>
                  <p className="text-blue-100 text-sm">Join our community</p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl font-black text-gray-900 leading-tight">
                  Join Thousands of <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Creators</span>
                </h2>
                <p className="text-gray-600 text-lg">
                  Share your knowledge, connect with experts, and grow your audience in our professional community.
                </p>
                
                <div className="space-y-4">
                  {[
                    { icon: Users, text: "Join 50,000+ active members" },
                    { icon: Globe, text: "Global community of experts" },
                    { icon: Award, text: "Build your professional reputation" }
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

              {/* Social Login */}
              <div className="pt-8 border-t border-gray-200">
                <p className="text-gray-600 mb-4">Or sign up with</p>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, color: "bg-blue-600 hover:bg-blue-700", label: "Facebook" },
                    { icon: Twitter, color: "bg-sky-500 hover:bg-sky-600", label: "Twitter" },
                    { icon: Github, color: "bg-gray-800 hover:bg-gray-900", label: "GitHub" }
                  ].map((social, idx) => (
                    <button
                      key={idx}
                      className={`${social.color} text-white p-3 rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300 flex-1`}
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="ml-2 font-medium hidden sm:inline">{social.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className={`transition-all duration-500 transform ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <CardTitle className="text-2xl font-black text-gray-900">Create Account</CardTitle>
                    <p className="text-gray-500 mt-1">Join our community in {4 - step} simple steps</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-500">STEP {step}/3</div>
                    <div className="text-2xl font-black text-indigo-600">{step}</div>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-2">
                  {steps.map((s, idx) => (
                    <div key={s.number} className="flex items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        step >= s.number 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      {idx < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                          step > s.number 
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                            : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  {steps.map(s => (
                    <span key={s.number} className={`transition-colors duration-300 ${
                      step >= s.number ? 'text-gray-900 font-semibold' : ''
                    }`}>{s.title}</span>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="relative">
                      <Label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 mr-2 text-indigo-500" />
                        Full Name
                      </Label>
                      <div className="relative">
                        <Input
                          placeholder="John Doe"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full pl-12 pr-4 py-3.5 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                        />
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div className="relative">
                      <Label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 mr-2 text-indigo-500" />
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full pl-12 pr-4 py-3.5 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div className="relative">
                      <Label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 mr-2 text-indigo-500" />
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Input
                          placeholder="0300 123 4567"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full pl-12 pr-4 py-3.5 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                        />
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Security */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="relative">
                      <Label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Lock className="w-4 h-4 mr-2 text-indigo-500" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                      <div className="mt-3">
                        <div className="text-sm font-semibold text-gray-700 mb-2">Password Strength</div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-500 ${
                            form.password.length >= 8 ? 
                            'bg-gradient-to-r from-green-500 to-emerald-500 w-3/4' : 
                            form.password.length >= 4 ? 
                            'bg-gradient-to-r from-amber-500 to-orange-500 w-1/2' : 
                            'bg-gradient-to-r from-red-500 to-pink-500 w-1/4'
                          }`}></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 space-y-1">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              form.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                            At least 8 characters
                          </div>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              /[A-Z]/.test(form.password) && /[a-z]/.test(form.password) ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                            Upper & lowercase letters
                          </div>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              /\d/.test(form.password) ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                            At least one number
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <Label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Shield className="w-4 h-4 mr-2 text-indigo-500" />
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          value={form.confirmPassword}
                          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                          className="w-full pl-12 pr-12 py-3.5 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                        />
                        <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {form.confirmPassword && form.password !== form.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Account Type & Terms */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="flex items-center text-sm font-semibold text-gray-700 mb-4">
                        <Award className="w-4 h-4 mr-2 text-indigo-500" />
                        Select Account Type
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, role: "user" })}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                            form.role === "user"
                              ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="text-center">
                            <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                              form.role === "user"
                                ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                                : "bg-gray-100"
                            }`}>
                              <User className={`w-6 h-6 ${form.role === "user" ? "text-white" : "text-gray-400"}`} />
                            </div>
                            <div className="font-bold text-gray-900">Regular User</div>
                            <div className="text-sm text-gray-500 mt-2">Read, comment, and interact</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, role: "admin" })}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                            form.role === "admin"
                              ? "border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="text-center">
                            <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                              form.role === "admin"
                                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                : "bg-gray-100"
                            }`}>
                              <Shield className={`w-6 h-6 ${form.role === "admin" ? "text-white" : "text-gray-400"}`} />
                            </div>
                            <div className="font-bold text-gray-900">Administrator</div>
                            <div className="text-sm text-gray-500 mt-2">Manage content & users</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <Checkbox
                          checked={form.agree}
                          onCheckedChange={(checked) => setForm({ ...form, agree: checked })}
                          className="mt-1"
                        />
                        <div>
                          <Label className="font-semibold text-gray-900">Terms & Conditions</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            I agree to the{" "}
                            <Link href="/terms" className="text-indigo-600 hover:underline font-medium">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-indigo-600 hover:underline font-medium">
                              Privacy Policy
                            </Link>
                            . I understand that my data will be processed securely.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <div className="text-sm text-gray-700">
                         <span className="font-semibold">Email verification required.</span>{" "}
You&apos;ll receive a confirmation email after signup.

                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-xl"
                    >
                      Back
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg rounded-xl"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSignup}
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg rounded-xl"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Creating Account...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Sparkles className="w-5 h-5 mr-2" />
                          Complete Signup
                        </div>
                      )}
                    </Button>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <button
                      onClick={() => router.push("/login")}
                      className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition-colors duration-300"
                    >
                      Sign in here
                    </button>
                  </p>
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