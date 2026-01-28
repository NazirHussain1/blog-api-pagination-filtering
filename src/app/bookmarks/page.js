"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  BookmarkX,
  Search,
  Filter,
  Grid3X3,
  List,
  Sparkles,
  TrendingUp,
  Star,
  Tag,
  User,
  ChevronRight,
  ArrowRight,
  Trash2,
  Share2,
  ExternalLink,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookmarksPage() {
  const { user } = useSelector((state) => state.auth);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchBookmarks();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API endpoint
      const response = await fetch("/api/bookmarks", {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
      } else {
        // Mock data for demonstration
        setBookmarks([
          {
            id: 1,
            title: "Getting Started with React Hooks",
            description: "A comprehensive guide to understanding and using React Hooks in your applications.",
            image: "/api/placeholder/400/250",
            author: { name: "John Doe", avatar: null },
            category: "Technology",
            createdAt: "2024-01-15T10:00:00Z",
            bookmarkedAt: "2024-01-20T14:30:00Z",
            slug: "getting-started-react-hooks",
            views: 1250,
            likes: 89,
            readTime: 8,
            tags: ["React", "JavaScript", "Frontend"]
          },
          {
            id: 2,
            title: "Design Systems Best Practices",
            description: "Learn how to build and maintain scalable design systems for modern web applications.",
            image: "/api/placeholder/400/250",
            author: { name: "Jane Smith", avatar: null },
            category: "Design",
            createdAt: "2024-01-10T15:30:00Z",
            bookmarkedAt: "2024-01-18T09:15:00Z",
            slug: "design-systems-best-practices",
            views: 890,
            likes: 67,
            readTime: 12,
            tags: ["Design", "UI/UX", "Systems"]
          },
          {
            id: 3,
            title: "The Future of Artificial Intelligence",
            description: "Exploring the latest trends and developments in AI technology and their impact on society.",
            image: "/api/placeholder/400/250",
            author: { name: "Alex Johnson", avatar: null },
            category: "Technology",
            createdAt: "2024-01-05T12:00:00Z",
            bookmarkedAt: "2024-01-16T16:45:00Z",
            slug: "future-artificial-intelligence",
            views: 2100,
            likes: 156,
            readTime: 15,
            tags: ["AI", "Technology", "Future"]
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (bookmarkId) => {
    try {
      // Simulate API call
      await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const filteredBookmarks = bookmarks
    .filter(bookmark => {
      const matchesSearch = bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           bookmark.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || bookmark.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt);
        case "oldest":
          return new Date(a.bookmarkedAt) - new Date(b.bookmarkedAt);
        case "title":
          return a.title.localeCompare(b.title);
        case "popular":
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const categories = ["all", ...new Set(bookmarks.map(bookmark => bookmark.category))];

  const stats = {
    total: bookmarks.length,
    thisMonth: bookmarks.filter(b => 
      new Date(b.bookmarkedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    categories: new Set(bookmarks.map(b => b.category)).size,
    totalReadTime: bookmarks.reduce((sum, b) => sum + b.readTime, 0)
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl mb-6">
              <Bookmark className="w-10 h-10 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sign In Required
            </h1>
            <p className="text-gray-600 mb-8">
              Please sign in to view your bookmarked articles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Sign In
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 py-3 px-6 rounded-xl transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen bg-white transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 animate-fade-in">
              <Bookmark className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold">YOUR COLLECTION</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-slide-up">
              Saved Articles
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
              Your personal collection of insightful articles and must-read content
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up animation-delay-400">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-indigo-200">Total Saved</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.thisMonth}</div>
                <div className="text-sm text-indigo-200">This Month</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.categories}</div>
                <div className="text-sm text-indigo-200">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.totalReadTime}m</div>
                <div className="text-sm text-indigo-200">Read Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 md:h-24 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="popular">Most Popular</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bookmarks Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl mb-4">
                  <BookOpen className="w-8 h-8 text-indigo-500 animate-pulse" />
                </div>
                <p className="text-gray-600">Loading your bookmarks...</p>
              </div>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl mb-6">
                <Bookmark className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchQuery || selectedCategory !== "all" ? "No bookmarks found" : "No bookmarks yet"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchQuery || selectedCategory !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Start building your collection by bookmarking articles you want to read later."
                }
              </p>
              {!searchQuery && selectedCategory === "all" && (
                <Link
                  href="/posts"
                  className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore Articles
                </Link>
              )}
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-6"
            }>
              {filteredBookmarks.map((bookmark) => (
                <article
                  key={bookmark.id}
                  className={`group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  {/* Post Image */}
                  <Link 
                    href={`/posts/${bookmark.slug}`} 
                    className={`block relative bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden ${
                      viewMode === "list" ? "w-48 flex-shrink-0" : "h-48"
                    }`}
                  >
                    {bookmark.image ? (
                      <Image
                        src={bookmark.image}
                        alt={bookmark.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-indigo-300" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-semibold rounded-full">
                        {bookmark.category}
                      </span>
                    </div>
                  </Link>

                  {/* Post Content */}
                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Saved {new Date(bookmark.bookmarkedAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{bookmark.readTime} min read</span>
                    </div>

                    <Link href={`/posts/${bookmark.slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {bookmark.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {bookmark.description}
                    </p>

                    {/* Tags */}
                    {bookmark.tags && bookmark.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {bookmark.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-1">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {bookmark.author?.avatar ? (
                            <Image
                              src={bookmark.author.avatar}
                              alt={bookmark.author.name}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            bookmark.author?.name?.charAt(0) || "A"
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900 ml-2">
                          {bookmark.author?.name || "Anonymous"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {bookmark.views}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {bookmark.likes}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => removeBookmark(bookmark.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Remove bookmark"
                        >
                          <BookmarkX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}