"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser, fetchCurrentUser } from "@/redux/features/auth/authSlice";
import { User, LogOut, FilePlus2, ClipboardList, Menu, X } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const menuRef = useRef(null);

  const { user, loading } = useSelector((state) => state.auth);

  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Fetch current user on mount
  useEffect(() => {
    if (!user) dispatch(fetchCurrentUser());
  }, [dispatch, user]);

  // Close dropdown when clicking outside
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

  const roleColor = (role) => (role === "admin" ? "text-red-600" : "text-green-600");

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-2xl font-bold text-blue-700 cursor-pointer hover:text-blue-800">
            My Blog
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-700 font-medium">
            Home
          </Link>

          {user && (
            <Link href="/posts/create" className="text-gray-700 hover:text-blue-700 font-medium">
              Create Post
            </Link>
          )}

          {user?.role === "admin" && (
            <Link href="/posts/manage" className="text-gray-700 hover:text-red-600 font-medium">
              Manage Posts
            </Link>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setOpenMenu((prev) => !prev)}
              className="cursor-pointer flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full text-blue-700 font-bold flex items-center justify-center">
                {user ? user.name.charAt(0).toUpperCase() : "G"}
              </div>
            </div>

            {openMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-lg py-3 z-50">
                {!user ? (
                  <div className="flex flex-col px-4 py-3 space-y-2">
                    <p className="text-gray-800 font-medium">Welcome!</p>
                    <Link href="/login" className="hover:bg-gray-100 px-3 py-2 rounded">
                      Login
                    </Link>
                    <Link href="/signup" className="hover:bg-gray-100 px-3 py-2 rounded">
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="px-4 pb-3 border-b">
                      <h4 className="font-semibold">{user.name}</h4>
                      <span className={`text-sm font-medium ${roleColor(user.role)}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </div>
                    <div className="py-2 flex flex-col">
                      <Link href="/profile" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <User size={18} /> My Profile
                      </Link>
                      <Link href="/posts/myposts" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <FilePlus2 size={18} /> My Posts
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/posts/manage" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                          <ClipboardList size={18} /> Manage Posts
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="sm:hidden flex items-center">
          <button onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="sm:hidden bg-white text-gray-700 w-full flex flex-col space-y-2 px-4 py-3 shadow-md">
          <Link href="/" className="hover:text-blue-700 text-lg" onClick={() => setMobileMenu(false)}>
            Home
          </Link>
          {user && (
            <Link href="/posts/create" className="hover:text-blue-700 text-lg" onClick={() => setMobileMenu(false)}>
              Create Post
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="/posts/manage" className="hover:text-red-600 text-lg" onClick={() => setMobileMenu(false)}>
              Manage Posts
            </Link>
          )}

          {!user ? (
            <>
              <Link href="/login" className="hover:text-blue-700 text-lg" onClick={() => setMobileMenu(false)}>
                Login
              </Link>
              <Link href="/signup" className="hover:text-blue-700 text-lg" onClick={() => setMobileMenu(false)}>
                Register
              </Link>
            </>
          ) : (
            <div className="border-t border-gray-200 mt-2 pt-2">
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full text-blue-700 font-bold flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className={`font-medium ${roleColor(user.role)}`}>
                  {user.name} ({user.role.toUpperCase()})
                </span>
              </div>
              <Link href="/profile" className="px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
                <User size={18} /> My Profile
              </Link>
              <Link href="/posts/myposts" className="px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
                <FilePlus2 size={18} /> My Posts
              </Link>
              {user.role === "admin" && (
                <Link href="/posts/manage" className="px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
                  <ClipboardList size={18} /> Manage Posts
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenu(false);
                }}
                className="w-full px-4 py-2 text-red-600 hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
