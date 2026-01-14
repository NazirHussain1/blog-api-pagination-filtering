"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser, fetchCurrentUser } from "@/redux/features/auth/authSlice";
import { fetchUserPosts } from "@/redux/features/posts/postSlice";
import {
  User,
  LogOut,
  FilePlus2,
  Menu,
  X,
  Home,
  FileText,
  PenSquare,
  Settings,
  Bell,
  ChevronDown,
  BookOpen,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const userPosts = useSelector((state) => state.posts.userPosts); // user-specific posts
  const postCount = userPosts?.length || 0;

  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!user) dispatch(fetchCurrentUser());
    if (user) dispatch(fetchUserPosts());
  }, [dispatch, user]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const roleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-pink-500";
      case "editor":
        return "bg-gradient-to-r from-purple-500 to-indigo-500";
      default:
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100"
          : "bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center py-3 md:py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div
              className={`relative p-2 rounded-xl ${
                scrolled
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                  : "bg-white/10 backdrop-blur-sm"
              }`}
            >
              <BookOpen
                className={`w-6 h-6 ${
                  scrolled ? "text-white" : "text-amber-300"
                }`}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <h1
                className={`text-2xl font-black tracking-tight ${
                  scrolled
                    ? "bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent"
                    : "text-white"
                }`}
              >
                InsightHub
              </h1>
              <p
                className={`text-xs font-medium ${
                  scrolled ? "text-gray-500" : "text-blue-200"
                }`}
              >
                Where ideas spark innovation
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            <nav className="flex items-center space-x-1 mr-4">
              <Link
                href="/"
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  scrolled
                    ? "hover:bg-gray-50 text-gray-700 hover:text-indigo-600"
                    : "hover:bg-white/10 text-white/90"
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="font-semibold">Home</span>
              </Link>

              <Link
                href="/posts"
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  scrolled
                    ? "hover:bg-gray-50 text-gray-700 hover:text-indigo-600"
                    : "hover:bg-white/10 text-white/90"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="font-semibold">Articles</span>
              </Link>

              <Link
                href={user ? "/posts/create" : "/login"}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  scrolled
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg"
                    : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                }`}
              >
                <PenSquare className="w-4 h-4" />
                <span className="font-semibold">Write</span>
              </Link>
            </nav>

            <div className="relative mx-4">
              <input
                type="search"
                placeholder="Search articles..."
                className={`w-64 pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-300 ${
                  scrolled
                    ? "bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                    : "bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:border-white/30"
                }`}
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                  scrolled
                    ? "hover:bg-gray-50 text-gray-600"
                    : "hover:bg-white/10 text-white/90"
                }`}
              >
                <Bell className="w-5 h-5" />
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="flex items-center space-x-3 group"
                >
                  <div
                    className={`relative w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                      user
                        ? roleColor(user.role)
                        : "bg-gradient-to-r from-gray-600 to-gray-400"
                    }`}
                  >
                    {user ? user.name.charAt(0).toUpperCase() : "G"}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p
                      className={`font-semibold text-sm ${
                        scrolled ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {user ? user.name : "Guest"}
                    </p>
                    <p
                      className={`text-xs ${
                        scrolled ? "text-gray-500" : "text-blue-200"
                      }`}
                    >
                      {user ? user.role.toUpperCase() : "VISITOR"}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openMenu ? "rotate-180" : ""
                    } ${scrolled ? "text-gray-400" : "text-white/70"}`}
                  />
                </button>

                {openMenu && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-down">
                    {!user ? (
                      <div className="p-4 space-y-2">
                        <Link
                          href="/login"
                          className="block px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700 font-semibold rounded-xl text-center transition-all duration-300"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/signup"
                          className="block px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl text-center transition-all duration-300"
                        >
                          Join Community
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`relative w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-2xl ${roleColor(
                                user.role
                              )} shadow-lg`}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">
                                {user.name}
                              </h4>
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white mt-1">
                                <div
                                  className={`px-3 py-1 rounded-full ${
                                    user.role === "admin"
                                      ? "bg-gradient-to-r from-red-500 to-pink-500"
                                      : "bg-gradient-to-r from-blue-500 to-cyan-500"
                                  }`}
                                >
                                  {user.role.toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-1">
                          <Link
                            href="/profile"
                            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                            onClick={() => setOpenMenu(false)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-700">
                                My Profile
                              </span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400 rotate-270" />
                          </Link>

                          <Link
                            href="/my-posts"
                            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                            onClick={() => setOpenMenu(false)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                <FilePlus2 className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="font-medium text-gray-700">
                                My Articles
                              </span>
                            </div>
                            <div className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-bold rounded-full">
                              ({postCount})
                            </div>
                          </Link>

                          <Link
                            href="/settings"
                            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                            onClick={() => setOpenMenu(false)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                <Settings className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="font-medium text-gray-700">
                                Settings
                              </span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400 rotate-270" />
                          </Link>

                          {user.role === "admin" && (
                            <Link
                              href="/posts/manage"
                              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                              onClick={() => setOpenMenu(false)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                  <Sparkles className="w-4 h-4 text-amber-500" />
                                </div>
                                <span className="font-medium text-gray-700">
                                  Manage Content
                                </span>
                              </div>
                            </Link>
                          )}

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-300 group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                <LogOut className="w-4 h-4 text-red-600" />
                              </div>
                              <span className="font-medium text-gray-700">
                                Sign Out
                              </span>
                            </div>
                            <Zap className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? (
              <X
                className={`w-7 h-7 ${
                  scrolled ? "text-gray-700" : "text-white"
                }`}
              />
            ) : (
              <Menu
                className={`w-7 h-7 ${
                  scrolled ? "text-gray-700" : "text-white"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-down {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slide-left {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
        .animate-slide-left {
          animation: slide-left 0.3s ease-out forwards;
        }
        .rotate-270 {
          transform: rotate(-90deg);
        }
      `}</style>
    </header>
  );
}
