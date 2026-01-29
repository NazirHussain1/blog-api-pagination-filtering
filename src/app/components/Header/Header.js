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
  Search,
  TrendingUp,
  Bookmark,
  Shield,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const userPosts = useSelector((state) => state.posts.userPosts);
  const postCount = userPosts?.length || 0;

  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (!user) dispatch(fetchCurrentUser());
    if (user) dispatch(fetchUserPosts());
  }, [dispatch, user]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Handle body scroll lock for mobile menu
    if (mobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenu]);

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
      setMobileMenu(false);
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { bg: "bg-red-100", text: "text-red-700", label: "Admin" },
      editor: { bg: "bg-purple-100", text: "text-purple-700", label: "Editor" },
      user: { bg: "bg-blue-100", text: "text-blue-700", label: "Member" },
    };
    return badges[role] || badges.user;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                InsightHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                href="/posts"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Articles
              </Link>
              <Link
                href="/categories"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/trending"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Trending
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div
                className={`relative w-full transition-all duration-200 ${
                  searchFocused ? "scale-105" : ""
                }`}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search articles..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Write Button */}
              <Link
                href={user ? "/posts/create" : "/login"}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write</span>
              </Link>

              {/* Notifications */}
              {user && (
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              )}

              {/* User Menu */}
              <div className="hidden lg:block relative" ref={menuRef}>
                {user ? (
                  <>
                    <button
                      onClick={() => setOpenMenu(!openMenu)}
                      className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-600 transition-transform ${
                          openMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-dropdown">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                getRoleBadge(user.role).bg
                              } ${getRoleBadge(user.role).text}`}
                            >
                              {getRoleBadge(user.role).label}
                            </span>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <Link
                            href="/profile"
                            onClick={() => setOpenMenu(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            href="/my-posts"
                            onClick={() => setOpenMenu(false)}
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-4 h-4" />
                              <span>My Articles</span>
                            </div>
                            <span className="text-xs font-semibold text-indigo-600">
                              {postCount}
                            </span>
                          </Link>
                          <Link
                            href="/bookmarks"
                            onClick={() => setOpenMenu(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Bookmark className="w-4 h-4" />
                            <span>Bookmarks</span>
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setOpenMenu(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>

                          {user.role === "admin" && (
                            <>
                              <div className="my-1 border-t border-gray-100"></div>
                              <Link
                                href="/posts/manage"
                                onClick={() => setOpenMenu(false)}
                                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Shield className="w-4 h-4 text-red-600" />
                                <span>Admin Panel</span>
                              </Link>
                            </>
                          )}
                        </div>

                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/login"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {mobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenu(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto animate-slide-left">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">InsightHub</span>
              </div>
              <button
                onClick={() => setMobileMenu(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search in Menu */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-4">
              {/* User Section */}
              {user ? (
                <div className="mb-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                      getRoleBadge(user.role).bg
                    } ${getRoleBadge(user.role).text}`}
                  >
                    {getRoleBadge(user.role).label}
                  </span>
                </div>
              ) : (
                <div className="mb-4 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenu(false)}
                    className="block w-full px-4 py-3 text-center bg-white border-2 border-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenu(false)}
                    className="block w-full px-4 py-3 text-center bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-1 mb-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </Link>
                <Link
                  href="/posts"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Articles</span>
                </Link>
                <Link
                  href="/categories"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Categories</span>
                </Link>
                <Link
                  href="/trending"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">Trending</span>
                </Link>
                <Link
                  href={user ? "/posts/create" : "/login"}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <PenSquare className="w-5 h-5" />
                  <span className="font-medium">Write Article</span>
                </Link>
              </nav>

              {user && (
                <>
                  <div className="border-t border-gray-200 my-4"></div>
                  <nav className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      href="/my-posts"
                      onClick={() => setMobileMenu(false)}
                      className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">My Articles</span>
                      </div>
                      <span className="text-sm font-semibold text-indigo-600">
                        {postCount}
                      </span>
                    </Link>
                    <Link
                      href="/bookmarks"
                      onClick={() => setMobileMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Bookmark className="w-5 h-5" />
                      <span className="font-medium">Bookmarks</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMobileMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Settings</span>
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        href="/posts/manage"
                        onClick={() => setMobileMenu(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Shield className="w-5 h-5 text-red-600" />
                        <span className="font-medium">Admin Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign out</span>
                    </button>
                  </nav>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-left {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.15s ease-out;
        }
        .animate-slide-left {
          animation: slide-left 0.2s ease-out;
        }
      `}</style>
    </>
  );
}