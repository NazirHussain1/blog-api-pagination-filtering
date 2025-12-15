"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { User, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useSelector((state) => state.auth);
  const router = useRouter();

  // 🔐 Protect route
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        My Profile
      </h1>

      <div className="bg-white shadow rounded-xl p-8">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-4xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-lg">
            <User className="text-gray-500" />
            <span className="font-medium">Name:</span>
            <span>{user.name}</span>
          </div>

          <div className="flex items-center gap-3 text-lg">
            <Mail className="text-gray-500" />
            <span className="font-medium">Email:</span>
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-3 text-lg">
            <Shield className="text-gray-500" />
            <span className="font-medium">Role:</span>
            <span
              className={`font-semibold ${
                user.role === "admin"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
