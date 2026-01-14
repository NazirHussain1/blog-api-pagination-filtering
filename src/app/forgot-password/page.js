"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { Mail, AlertCircle, CheckCircle2, LockKeyhole, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async () => {
    if (!email) {
      toast.error("Please enter your email", { 
        icon: <AlertCircle className="text-red-500" />,
        description: "Email field cannot be empty"
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email format", { 
        icon: <AlertCircle className="text-red-500" />,
        description: "Please enter a valid email address"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      try {
        // Backend API call to send reset link
        // await axios.post("/api/auth/forgot-password", { email });
        
        toast.success("Reset link sent successfully!", { 
          icon: <CheckCircle2 className="text-green-500 animate-bounce" />,
          description: "Check your inbox for password reset instructions",
          duration: 5000
        });
        setSubmitted(true);
      } catch (err) {
        toast.error("Failed to send reset link", { 
          icon: <AlertCircle className="text-red-500" />,
          description: err?.response?.data?.message || "Please try again later"
        });
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back to Login */}
      <Link 
        href="/login"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 
        transition-all duration-300 group z-50"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Login</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 animate-slide-up">

          
          {/* Decorative Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
            <div className="absolute top-4 right-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <LockKeyhole className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Reset Password</h1>
                <p className="text-white/80 text-sm">Secure account recovery</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {!submitted ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full 
                  bg-gradient-to-r from-blue-100 to-purple-100 mb-4">
                    <Mail className="w-10 h-10 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Forgot your password?</h2>
                  <p className="text-gray-600">
                    Enter your email address and we will send you a link to reset your password.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 group-hover:border-blue-300"

                        disabled={loading}
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      We will send a secure link to this email
                    </p>
                  </div>

                  <Button
                    onClick={handleReset}
                 className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"

                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending Reset Link...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Send Reset Link
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    )}
                  </Button>

                  {/* Security Notice */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">Security Notice</h4>
                        <p className="text-xs text-gray-600">
                          The reset link will expire in 1 hour. If you do not see the email, check your spam folder.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full 
                bg-gradient-to-r from-green-100 to-emerald-100 mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600 animate-scale" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Check Your Email!</h2>
                <p className="text-gray-600 mb-6">
                  We have sent a password reset link to <span className="font-semibold text-blue-600">{email}</span>.
                  Please check your inbox and follow the instructions.
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Did not receive the email?</span> Check your spam folder or 
                      <button
                        onClick={() => setSubmitted(false)}
                        className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        try again
                      </button>
                    </p>
                  </div>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="w-full h-12 rounded-xl border-2 text-blue-600 border-blue-200 
                    hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                  >
                    Back to Reset Form
                  </Button>
                  <Link href="/login">
                    <Button
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 
                      hover:from-gray-900 hover:to-black text-white transition-all duration-300"
                    >
                      Return to Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-center text-sm text-gray-500">
              Need help?{" "}
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </div>

        {/* Stats/Info */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="text-2xl font-bold text-blue-600">100%</div>
            <div className="text-sm text-gray-600">Secure</div>
          </div>
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-600">Support</div>
          </div>
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="text-2xl font-bold text-pink-600">1hr</div>
            <div className="text-sm text-gray-600">Link Expiry</div>
          </div>
        </div>
      </div>

      <Toaster 
        richColors 
        position="top-right"
        toastOptions={{
          className: 'rounded-xl',
          style: {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
      />

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-scale {
          animation: scale 2s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}