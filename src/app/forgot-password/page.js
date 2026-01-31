"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  Shield,
  Key,
  Clock,
  RefreshCw,
  ShieldCheck,
  Eye,
  EyeOff,
  Send,
  MailCheck,
  LockKeyhole
} from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code, 3: New password
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeInputs, setCodeInputs] = useState(["", "", "", "", "", ""]);

  const handleSendCode = async () => {
    if (!email) {
      toast.error("Email required", {
        description: "Please enter your email address",
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address",
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset code");
      }
      
      toast.success("Reset code sent!", {
        description: "Check your email for the 6-digit code",
        icon: <MailCheck className="text-green-500" />
      });
      
      // Show the code in development mode
      if (data.resetCode) {
        toast.info(`Development Code: ${data.resetCode}`, {
          description: "Use this code for testing",
          duration: 10000
        });
      }
      
      setStep(2);
    } catch (error) {
      toast.error("Failed to send reset code", {
        description: error.message,
        icon: <AlertCircle className="text-red-500" />
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeInput = (index, value) => {
    if (value.length > 1) return;
    
    const newInputs = [...codeInputs];
    newInputs[index] = value;
    setCodeInputs(newInputs);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    // Update verification code
    setVerificationCode(newInputs.join(""));
  };

  const handleVerifyCode = () => {
    const code = codeInputs.join("");
    if (code.length !== 6) {
      toast.error("Invalid code", {
        description: "Please enter the complete 6-digit code",
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }
    
    setVerificationCode(code);
    setStep(3);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Passwords required", {
        description: "Please enter and confirm your new password",
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password too short", {
        description: "Password must be at least 8 characters",
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure passwords match",
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          resetCode: verificationCode, 
          newPassword 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }
      
      toast.success("Password updated!", {
        description: "Your password has been reset successfully",
        icon: <CheckCircle2 className="text-green-500" />,
        duration: 5000
      });
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      toast.error("Failed to reset password", {
        description: error.message,
        icon: <AlertCircle className="text-red-500" />
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"></div>

      {/* Header */}
      <div className="relative border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InsightHub
              </span>
            </Link>
            
            <Link
              href="/login"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                  Enter Email
                </span>
              </div>
              
              <div className="h-px flex-1 mx-4 bg-gray-200"></div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
                <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                  Verify Code
                </span>
              </div>
              
              <div className="h-px flex-1 mx-4 bg-gray-200"></div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  3
                </div>
                <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
                  New Password
                </span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 mb-6">
                  <LockKeyhole className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {step === 1 && "Reset Your Password"}
                  {step === 2 && "Enter Verification Code"}
                  {step === 3 && "Create New Password"}
                </h1>
                <p className="text-gray-600">
                  {step === 1 && "Enter your email to receive a reset code"}
                  {step === 2 && "We've sent a 6-digit code to your email"}
                  {step === 3 && "Enter your new secure password"}
                </p>
              </div>

              {/* Step 1: Email Form */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 h-12 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        disabled={loading}
                      />
                      <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <Button
                    onClick={handleSendCode}
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Sending Code...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Send Reset Code
                        <Send className="w-4 h-4" />
                      </span>
                    )}
                  </Button>

                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">
                          Security Guaranteed
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Code expires in 15 minutes</li>
                          <li>• One-time use only</li>
                          <li>• Encrypted transmission</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Code Verification */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 mb-6">
                      <MailCheck className="w-10 h-10 text-green-600" />
                    </div>
                    <p className="text-gray-600 mb-6">
                      We sent a verification code to <span className="font-semibold text-blue-600">{email}</span>
                    </p>
                    
                    <div className="bg-blue-50 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">Enter 6-digit code</span>
                      </div>
                      <div className="grid grid-cols-6 gap-3 mb-4">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <Input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            maxLength={1}
                            value={codeInputs[index]}
                            onChange={(e) => handleCodeInput(index, e.target.value)}
                            className="h-14 text-center text-2xl font-bold rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={handleVerifyCode}
                      disabled={codeInputs.join("").length !== 6}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
                    >
                      Verify & Continue
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="w-full h-12 rounded-xl border-2"
                    >
                      Resend Code
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-11 pr-11 h-12 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                        <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {/* Password Strength */}
                      {newPassword && (
                        <div className="space-y-2">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                passwordStrength(newPassword) >= 75 ? 'bg-green-500' :
                                passwordStrength(newPassword) >= 50 ? 'bg-yellow-500' :
                                passwordStrength(newPassword) >= 25 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${passwordStrength(newPassword)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Weak</span>
                            <span>Strong</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-11 h-12 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                        <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-sm text-red-500">Passwords do not match</p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleResetPassword}
                    disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Updating Password...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Reset Password
                        <Key className="w-4 h-4" />
                      </span>
                    )}
                  </Button>

                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                      Password Requirements
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-center">
                        <CheckCircle2 className={`w-4 h-4 mr-2 ${newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
                        At least 8 characters
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className={`w-4 h-4 mr-2 ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`} />
                        One uppercase letter
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className={`w-4 h-4 mr-2 ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`} />
                        One number
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className={`w-4 h-4 mr-2 ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`} />
                        One special character
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-blue-600 font-medium"
                >
                  ← Back to Login
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Secure Connection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}