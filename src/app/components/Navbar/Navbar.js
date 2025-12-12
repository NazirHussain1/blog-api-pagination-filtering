"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false); // dropdown state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.log("User not logged in");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        
        {/* LEFT — LOGO */}
        <Link href="/">
          <h1 className="text-2xl font-extrabold cursor-pointer tracking-wide hover:opacity-90">
            Lost & Found
          </h1>
        </Link>

        {/* RIGHT — MENU */}
        <div className="flex items-center space-x-6">

          {/* Create Post + Manage Posts */}
          {user && (
            <>
              <Link href="/posts/create" className="hover:underline">
                Create Post
              </Link>

              <Link href="/posts/manage" className="hover:underline">
                Manage Posts
              </Link>
            </>
          )}

          {/* LOGIN / SIGNUP */}
          {!user && (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" variant="secondary">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* USER DROPDOWN */}
          {user && (
            <div className="relative">
              <div
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{user.name}</span>
              </div>

              {/* DROPDOWN MENU */}
              {openMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-xl z-20">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>

                  <Link
                    href="/posts/manage"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Items
                  </Link>

                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
