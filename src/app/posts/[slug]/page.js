"use client";
import Comments from "@/app/components/Comments/Comments";
import PostCard from "@/app/components/PostCard/PostCard";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  User,
  Tag,
  Loader2,
  Home,
  TrendingUp,
  ChevronRight,
  ThumbsUp,
  BookOpen,
  Sparkles,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Laugh,
  Frown,
  Angry,
  Meh,
  X,
  Star,
  Award,
  Users,
  Feather,
  ThumbsDown,
  Copy,
  ExternalLink,
  Zap,
  Target,
  Lightbulb,
  Heart,
  Smile,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const REACTIONS = {
  like: { icon: ThumbsUp, label: "Like", color: "text-blue-500", bgColor: "bg-blue-50 hover:bg-blue-100", activeBg: "bg-blue-100" },
  love: { icon: Heart, label: "Love", color: "text-red-500", bgColor: "bg-red-50 hover:bg-red-100", activeBg: "bg-red-100" },
  laugh: { icon: Laugh, label: "Laugh", color: "text-yellow-500", bgColor: "bg-yellow-50 hover:bg-yellow-100", activeBg: "bg-yellow-100" },
  wow: { icon: Sparkles, label: "Wow", color: "text-purple-500", bgColor: "bg-purple-50 hover:bg-purple-100", activeBg: "bg-purple-100" },
  sad: { icon: Frown, label: "Sad", color: "text-blue-400", bgColor: "bg-blue-50 hover:bg-blue-100", activeBg: "bg-blue-100" },
  angry: { icon: Angry, label: "Angry", color: "text-red-600", bgColor: "bg-red-50 hover:bg-red-100", activeBg: "bg-red-100" },
};

export default function SinglePost() {
  const { slug } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userReaction, setUserReaction] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
        setUserReaction(data.userReaction || null);

        // Simulate fetching related posts
        setTimeout(() => {
          setRelatedPosts([
            {
              id: 1,
              title: "Mastering React Hooks",
              slug: "mastering-react-hooks",
              category: "Technology",
            },
            {
              id: 2,
              title: "Design Systems 101",
              slug: "design-systems-101",
              category: "Design",
            },
            {
              id: 3,
              title: "The Future of AI",
              slug: "future-of-ai",
              category: "Technology",
            },
          ]);
        }, 1000);
      } catch (err) {
        setError("Post not found");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || "";
    const text = `Check out this insightful article: ${title}`;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url).then(() => {
        // Show success toast or notification
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        toast.textContent = 'Link copied to clipboard!';
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      });
      setShowShareMenu(false);
      return;
    }

    window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
    setShowShareMenu(false);
  };
  useEffect(() => {
    if (!post) return;
  }, [post]);

  const handleReaction = async (reaction = null) => {
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reaction }),
      });
      if (!res.ok) throw new Error("Failed to react");
      const data = await res.json();
      setPost((prev) => ({
        ...prev,
        reactions: data.reactions,
        userReaction: data.userReaction,
        likes: data.likesCount, // Keep for backward compatibility
      }));
      setUserReaction(data.userReaction);
      setShowReactionPicker(false);
    } catch (err) {
      // Error updating reaction
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-full">
                    <BookOpen className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Loading Article
              </h3>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-600 mt-4">Please wait while we fetch the content...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl mb-6">
              <BookOpen className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Article Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The article you are looking for does not exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/")}
                className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/posts")}
                className="inline-flex items-center border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 py-3 px-6 rounded-xl transition-all duration-300"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Articles
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-8">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                className="inline-flex items-center text-white/90 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    isBookmarked
                      ? "bg-white/20 text-amber-300"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  title={isBookmarked ? "Remove bookmark" : "Bookmark article"}
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                    title="Share article"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50 animate-slide-down">
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <Twitter className="w-5 h-5 text-blue-400 mr-3" />
                        <span className="text-gray-700 font-medium">Share on Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare("facebook")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <Facebook className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-gray-700 font-medium">Share on Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <Linkedin className="w-5 h-5 text-blue-700 mr-3" />
                        <span className="text-gray-700 font-medium">Share on LinkedIn</span>
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Copy className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="text-gray-700 font-medium">Copy Link</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Article Meta */}
            <div className="mb-8">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                <span className="font-semibold text-sm">FEATURED ARTICLE</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <Link 
                  href={`/profile/${post.author?.name || 'unknown'}`}
                  className="flex items-center group hover:bg-white/10 rounded-xl p-2 -m-2 transition-all duration-300"
                >
                  <div className="relative mr-3">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform duration-300">
                      {post.author?.avatar ? (
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        post.author?.name?.charAt(0) || "A"
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold group-hover:text-white transition-colors duration-300">
                      {post.author?.name || "Anonymous Author"}
                    </div>
                    <div className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
                      {post.author?.role === "admin" ? "Administrator" : "Content Writer"}
                    </div>
                  </div>
                </Link>

                <div className="h-4 w-px bg-white/30"></div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{Math.ceil((post.body?.length || 1000) / 200)} min read</span>
                  </div>

                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    <span>{post.views || 0} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-16 md:h-24 text-white"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Article Content */}
              <div className="lg:col-span-3">
                <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  {/* Featured Image */}
                  {post.image && (
                    <div className="relative h-64 md:h-96 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={800}
                        height={400}
                        className="w-full h-full object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  )}

                  {/* Article Body */}
                  <div className="p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                      <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line mb-8">
                        {post.body}
                      </div>

                      {/* Tags */}
                      {post.tags?.length > 0 && (
                        <div className="pt-8 border-t border-gray-100">
                          <div className="flex items-center mb-4">
                            <Tag className="w-5 h-5 text-indigo-500 mr-2" />
                            <h3 className="font-bold text-gray-900">Related Topics</h3>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {post.tags.map((tag) => (
                              <Link
                                key={tag}
                                href={`/tag/${tag}`}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-medium rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 hover:shadow-sm"
                              >
                                #{tag}
                                <ChevronRight className="w-4 h-4 ml-2" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Article Engagement */}
                  <div className="px-8 md:px-12 pb-8 border-t border-gray-100">
                    <div className="flex items-center justify-between py-6">
                      <div className="flex items-center space-x-4">
                        {/* Like/Reaction Button */}
                        <div className="relative">
                          <button
                            onClick={() => setShowReactionPicker(!showReactionPicker)}
                            className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                              userReaction
                                ? `${REACTIONS[userReaction].color} ${REACTIONS[userReaction].activeBg} shadow-sm`
                                : "text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50"
                            }`}
                          >
                            {userReaction ? (
                              (() => {
                                const IconComponent = REACTIONS[userReaction].icon;
                                return <IconComponent className="w-5 h-5 fill-current" />;
                              })()
                            ) : (
                              <ThumbsUp className="w-5 h-5" />
                            )}
                            <div className="flex flex-col items-start">
                              <span className="text-lg font-bold">
                                {Object.values(post.reactions || {}).reduce(
                                  (sum, count) => sum + count,
                                  0,
                                ) || 0}
                              </span>
                              <span className="text-sm">
                                {userReaction ? REACTIONS[userReaction].label : "Like"}
                              </span>
                            </div>
                          </button>

                          {/* Enhanced Reaction Picker */}
                          {showReactionPicker && (
                            <div className="absolute top-full left-0 mt-3 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 z-20 min-w-max">
                              <div className="text-sm font-semibold text-gray-700 mb-3 px-2">
                                How do you feel about this article?
                              </div>
                              <div className="flex gap-2">
                                {Object.entries(REACTIONS).map(
                                  ([type, { icon: Icon, label, color, bgColor, activeBg }]) => (
                                    <button
                                      key={type}
                                      onClick={() => handleReaction(type)}
                                      className={`group flex flex-col items-center p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
                                        userReaction === type ? `${color} ${activeBg}` : `${bgColor} text-gray-600`
                                      }`}
                                      title={label}
                                    >
                                      <Icon className="w-6 h-6 mb-1" />
                                      <span className="text-xs font-medium">{label}</span>
                                      {post.reactions?.[type] > 0 && (
                                        <span className="text-xs text-gray-500 mt-1">
                                          {post.reactions[type]}
                                        </span>
                                      )}
                                    </button>
                                  ),
                                )}
                                {userReaction && (
                                  <button
                                    onClick={() => handleReaction(null)}
                                    className="group flex flex-col items-center p-3 rounded-xl hover:bg-red-100 transition-all duration-200 text-gray-400 hover:text-red-500"
                                    title="Remove reaction"
                                  >
                                    <X className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-medium">Remove</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Comment Button */}
                        <button
                          onClick={() => setShowComments((prev) => !prev)}
                          className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                            showComments
                              ? "text-indigo-600 bg-indigo-100 shadow-sm"
                              : "text-gray-600 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50"
                          }`}
                        >
                          <MessageCircle className="w-5 h-5" />
                          <div className="flex flex-col items-start">
                            <span className="text-lg font-bold">
                              {post.commentsCount || 0}
                            </span>
                            <span className="text-sm">
                              {showComments ? "Hide Comments" : "Comments"}
                            </span>
                          </div>
                        </button>
                      </div>

                      {/* Article Stats */}
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span className="font-medium">{post.views || 0} views</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">
                            {Math.ceil((post.body?.length || 1000) / 200)} min read
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {showComments && (
                      <div className="pt-6 border-t border-gray-100 animate-fade-in">
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <Comments slug={post.slug} user={post.author} />
                        </div>
                      </div>
                    )}
                  </div>
                </article>

                {/* Author Bio */}
                <div className="mt-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <Link 
                      href={`/profile/${post.author?.name || 'unknown'}`}
                      className="relative flex-shrink-0 group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl hover:scale-105 transition-transform duration-300">
                        {post.author?.avatar ? (
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          post.author?.name?.charAt(0) || "A"
                        )}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Link 
                          href={`/profile/${post.author?.name || 'unknown'}`}
                          className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-300"
                        >
                          {post.author?.name || "Anonymous Author"}
                        </Link>
                        {post.author?.role === "admin" && (
                          <div className="inline-flex items-center bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
                            <Award className="w-4 h-4 mr-1" />
                            Admin
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">
                        {post.author?.role === "admin" ? "Administrator" : "Content Writer"} •
                        {post.author?.location ? ` ${post.author.location}` : " Location not specified"}
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {post.author?.about || "This author is passionate about sharing knowledge and insights with the community. Stay tuned for more great content!"}
                      </p>
                      
                      {/* Contact Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-indigo-200">
                        <div className="flex items-center space-x-4">
                          <p className="text-sm text-gray-500">
                            Member since{" "}
                            {post.author?.createdAt
                              ? new Date(post.author.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                })
                              : "Recently"}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {/* WhatsApp Contact */}
                          {post.author?.phone && (
                            <a
                              href={`https://wa.me/${post.author.phone.replace(/[^0-9]/g, '')}?text=Hi! I read your article "${post.title}" on InsightHub and wanted to connect.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              title="Contact via WhatsApp"
                            >
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                              </svg>
                              WhatsApp
                            </a>
                          )}
                          
                          {/* View Profile Button */}
                          <Link
                            href={`/profile/${post.author?.name || 'unknown'}`}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <User className="w-4 h-4 mr-2" />
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                  {/* Table of Contents */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                      Quick Navigation
                    </h3>
                    <nav className="space-y-3">
                      {[
                        { title: "Introduction", icon: Lightbulb },
                        { title: "Key Concepts", icon: Target },
                        { title: "Implementation", icon: Zap },
                        { title: "Best Practices", icon: Star },
                        { title: "Conclusion", icon: Award },
                      ].map((item, idx) => (
                        <a
                          key={idx}
                          href={`#${item.title.toLowerCase().replace(" ", "-")}`}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all duration-300 group"
                        >
                          <div className="flex items-center">
                            <item.icon className="w-4 h-4 text-purple-400 mr-3" />
                            <span className="text-gray-700 font-medium">{item.title}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                        </a>
                      ))}
                    </nav>
                  </div>

                  {/* Article Stats */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                      Article Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Views</span>
                        <span className="font-semibold text-gray-900">{post.views || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Reactions</span>
                        <span className="font-semibold text-gray-900">
                          {Object.values(post.reactions || {}).reduce((sum, count) => sum + count, 0) || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Reading Time</span>
                        <span className="font-semibold text-gray-900">
                          {Math.ceil((post.body?.length || 1000) / 200)} min
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Published</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Related Articles */}
                  {relatedPosts.length > 0 && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-green-500" />
                        Related Articles
                      </h3>
                      <div className="space-y-4">
                        {relatedPosts.slice(0, 3).map((relatedPost, idx) => (
                          <Link
                            key={idx}
                            href={`/posts/${relatedPost.slug}`}
                            className="block p-3 rounded-xl hover:bg-white/50 transition-all duration-300 group"
                          >
                            <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-1">
                              {relatedPost.title}
                            </h4>
                            <p className="text-sm text-gray-600">{relatedPost.category}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
        
        .prose {
          max-width: none;
        }
        
        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        
        .prose h1, .prose h2, .prose h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        
        .prose ul, .prose ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }
        
        .prose blockquote {
          border-left: 4px solid #6366f1;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
        }
      `}</style>
    </main>
  );
}
