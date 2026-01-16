"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile, fetchCurrentUser } from "@/redux/features/auth/authSlice";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Mail, LockKeyhole, Camera, Trash2, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) dispatch(fetchCurrentUser());
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, user]);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleProfileUpdate = async () => {
    if (!name || !email) {
      toast.error("Name and Email cannot be empty");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (currentPassword) formData.append("currentPassword", currentPassword);
      if (newPassword) formData.append("newPassword", newPassword);
      if (avatar) formData.append("avatar", avatar);

      await dispatch(updateUserProfile(formData)).unwrap();

      toast.success("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setAvatar(null);
    } catch (err) {
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    toast.info("Avatar removed");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 animate-slide-up">
        <div className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-t-2xl flex items-center gap-4">
          <ShieldCheck className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="p-8 space-y-8">
          {/* Profile Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-32 rounded-full bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                  <button
                    onClick={handleRemoveAvatar}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                  <Camera className="inline w-4 h-4 mr-1" />
                  Change Avatar
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </section>

                  <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
            <div className="space-y-4 md:w-1/2">
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <LockKeyhole className="w-4 h-4" /> Current Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <LockKeyhole className="w-4 h-4" /> New Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <LockKeyhole className="w-4 h-4" /> Confirm New Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </section>
          <div className="pt-4 border-t border-gray-100">
            <Button
              onClick={handleProfileUpdate}
              className="w-full md:w-1/3 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          className: 'rounded-xl',
          style: { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.9)' }
        }}
      />

      <style jsx global>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
      `}</style>
    </div>
  );
}
