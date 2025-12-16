"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser, fetchCurrentUser } from "@/redux/features/auth/authSlice";
import {
  User,
  LogOut,
  FilePlus2,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const menuRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    if (!user) dispatch(fetchCurrentUser());
  }, [dispatch, user]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
      setOpenMenu(false);
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const roleColor = (role) =>
    role === "admin" ? "text-red-600" : "text-green-600";

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* LOGO */}
        <Link href="/">
          <h1 className="text-2xl font-bold text-blue-700 hover:text-blue-800">
            My Blog
          </h1>
        </Link>

        {/* ================= DESKTOP MENU ================= */}
        <nav className="hidden sm:flex items-center space-x-6">
          <Link href="/" className="font-medium hover:text-blue-700">
            Home
          </Link>

          <Link href="/posts" className="font-medium hover:text-blue-700">
            All Posts
          </Link>

          <Link
            href={user ? "/posts/create" : "/login"}
            className="font-medium hover:text-blue-700"
          >
            Create Post
          </Link>

          {user?.role === "admin" && (
            <Link
              href="/posts/manage"
              className="font-medium hover:text-red-600"
            >
              Manage Posts
            </Link>
          )}

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700"
            >
              {user ? user.name.charAt(0).toUpperCase() : "G"}
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-lg py-3">
                {!user ? (
                  <div className="px-4 space-y-2">
                    <Link
                      href="/login"
                      className="block hover:bg-gray-100 px-3 py-2 rounded"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block hover:bg-gray-100 px-3 py-2 rounded"
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="px-4 pb-3 border-b">
                      <h4 className="font-semibold">{user.name}</h4>
                      <span className={`text-sm ${roleColor(user.role)}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <Link
                        href="/profile"
                        className="px-4 py-2 hover:bg-gray-100 flex gap-2"
                      >
                        <User size={18} /> My Profile
                      </Link>
<Link href="/my-posts" className="px-4 py-2 hover:bg-gray-100 flex gap-2">
  <FilePlus2 size={18} /> My Posts
</Link>

                      {user.role === "admin" && (
                        <Link
                          href="/posts/manage"
                          className="px-4 py-2 hover:bg-gray-100 flex gap-2"
                        >
                          <ClipboardList size={18} /> Manage Posts
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-red-600 hover:bg-gray-100 flex gap-2"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          className="sm:hidden"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenu && (
        <div className="sm:hidden px-4 py-3 space-y-3 shadow-md bg-white">
          <Link href="/" onClick={() => setMobileMenu(false)}>
            Home
          </Link>

          <Link href="/posts" onClick={() => setMobileMenu(false)}>
            All Posts
          </Link>

          <Link
            href={user ? "/posts/create" : "/login"}
            onClick={() => setMobileMenu(false)}
          >
            Create Post
          </Link>

          {!user ? (
            <>
              <Link href="/login" onClick={() => setMobileMenu(false)}>
                Login
              </Link>
              <Link href="/signup" onClick={() => setMobileMenu(false)}>
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenu(false);
              }}
              className="text-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
