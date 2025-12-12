"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Icons from Lucide
import { User, Settings, LogOut, FilePlus2, LayoutGrid, ClipboardList } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  // Get Logged-in User
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user); // { name, email, role }
        }
      } catch (error) {}
    };
    fetchUser();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (res.ok) {
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/login");
      }
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">

        {/* LOGO */}
        <Link href="/">
          <h1 className="text-2xl font-extrabold cursor-pointer tracking-wide hover:opacity-90">
            My Blog
          </h1>
        </Link>

        <div className="flex items-center space-x-8">

          {/* Always visible Home */}
          <Link href="/" className="hover:underline text-lg">
            Home
          </Link>

          {/* USER → Create Post */}
          {user && (
            <Link href="/posts/create" className="hover:underline text-lg">
              Create Post
            </Link>
          )}

          {/* ADMIN → Manage Posts */}
          {user && user.role === "admin" && (
            <Link href="/posts/manage" className="hover:underline text-lg">
              Manage Posts
            </Link>
          )}

          {/* Login and Signup */}
          {!user && (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="hover:underline text-lg">
                Login
              </Link>
              <Link href="/signup" className="hover:underline text-lg">
                Sign Up
              </Link>
            </div>
          )}

          {/* Profile Icon Dropdown */}
          {user && (
            <div className="relative">
              <div
                onClick={() => setOpenMenu(!openMenu)}
                className="cursor-pointer flex items-center space-x-2"
              >
                <div className="w-10 h-10 bg-white rounded-full text-blue-600 font-bold flex items-center justify-center">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="hidden sm:block text-lg font-medium">{user.name}</span>
              </div>

              {openMenu && (
                <div className="absolute right-0 mt-3 w-60 bg-white shadow-xl rounded-lg py-3 z-50">
                  
                  {/* USER INFO */}
                  <div className="px-4 pb-3 border-b">
                    <h4 className="text-base font-semibold">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  {/* MENU ITEMS */}
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                    >
                      <User size={18} /> My Profile
                    </Link>

                    <Link
                      href="/posts/create"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                    >
                      <FilePlus2 size={18} /> Create Post
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        href="/posts/manage"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                      >
                        <ClipboardList size={18} /> Manage Posts
                      </Link>
                    )}

                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                    >
                      <Settings size={18} /> Settings
                    </Link>
                  </div>

                  {/* LOGOUT */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={18} /> Logout
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
