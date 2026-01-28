"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  TrendingUp,
  Flame,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  ChevronRight,
  Star,
  Award,
  Users,
  Calendar,
  Hash,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function TrendingPage() {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const [timeFilter, setTimeFilter] = useState("week");
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [topAuthors, setTopAuthors] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);

  useEffect(() => {
    // Sort posts by engagement (views, likes, comments)
    if (posts && posts.length > 0) {
      const sorted = [...posts]
        .sort((a, b) => {
          const scoreA = (a.views || 0) * 1 + (a.likes || 0) * 3 + (a.comments || 0) * 5;
          const scoreB = (b.views || 0) * 1 + (b.likes || 0) * 3 + (b.comments || 0) * 5;
          return scoreB - scoreA;
        })
        .slice(0, 10);
      setTrendingPosts(sorted);

      // Calculate top authors
      const authorMap = {};
      posts.forEach((post) => {
        const authorId = post.author?._id || post.author;
        if (authorId) {
          if (!authorMap[authorId]) {
            authorMap[authorId] = {
              id: authorId,
              name: post.author?.name || "Unknown",
              email: post.author?.email,
              posts: 0,
              totalViews: 0,
              totalLikes: 0,
            };
          }
          authorMap[authorId].posts += 1;
          authorMap[authorId].totalViews += post.views || 0;
          authorMap[authorId].totalLikes += post.likes || 0;
        }
      });

      const authors = Object.values(authorMap)
        .sort((a, b) => b.totalViews - a.totalViews)
        .slice(0, 5);
      setTopAuthors(authors);

      // Extract trending topics/tags
      const tagMap = {};
      posts.forEach((post) => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag) => {
            if (!tagMap[tag]) {
              tagMap[tag] = { name: tag, count: 0 };
            }
            tagMap[tag].count += 1;
          });
        }
      });

      const topics = Object.values(tagMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      setTrendingTopics(topics);
    }
  }, [posts]);

  const timeFilters = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "All Time", value: "all" },
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Trending Now</h1>
              <p className="text-indigo-100 mt-1">
                Discover the most popular articles and authors
              </p>
            </div>
          </div>

          {/* Time Filters */}
          <div className="flex flex-wrap gap-2 mt-6">
            {timeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTimeFilter(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeFilter === filter.value
                    ? "bg-white text-indigo-600 shadow-lg"
                    : "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Trending Posts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                <span>Top Articles</span>
              </h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : trendingPosts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No trending articles yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Be the first to create amazing content!
                </p>
                <Link
                  href="/posts/create"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  <span>Write an Article</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {trendingPosts.map((post, index) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 group"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Rank Badge */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                          index === 0
                            ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                            : index === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                            : index === 2
                            ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {index === 0 ? (
                          <Award className="w-6 h-6" />
                        ) : (
                          `#${index + 1}`
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/posts/${post._id}`}
                          className="block group"
                        >
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {post.description || post.content?.substring(0, 120) + "..."}
                          </p>
                        </Link>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium text-gray-700">
                              {post.author?.name || "Anonymous"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{formatNumber(post.views || 0)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3.5 h-3.5" />
                            <span>{formatNumber(post.likes || 0)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{formatNumber(post.comments || 0)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {post.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-md"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bookmark */}
                      <button className="flex-shrink-0 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Authors */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Top Authors</h3>
              </div>

              {topAuthors.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No authors yet
                </p>
              ) : (
                <div className="space-y-3">
                  {topAuthors.map((author, index) => (
                    <div
                      key={author.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {author.name.charAt(0).toUpperCase()}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Star className="w-3 h-3 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {author.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {author.posts} articles • {formatNumber(author.totalViews)} views
                        </p>
                      </div>
                      <button className="flex-shrink-0 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-md hover:bg-indigo-100 transition-colors">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <Hash className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Trending Topics
                </h3>
              </div>

              {trendingTopics.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No topics yet
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic, index) => (
                    <button
                      key={index}
                      className="px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 text-sm font-medium rounded-lg transition-all flex items-center space-x-1"
                    >
                      <span>#{topic.name}</span>
                      <span className="text-xs text-indigo-500">
                        ({topic.count})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Community Stats */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5" />
                <h3 className="text-lg font-bold">Community Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Total Articles</span>
                  <span className="text-2xl font-bold">
                    {formatNumber(posts?.length || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Active Authors</span>
                  <span className="text-2xl font-bold">
                    {topAuthors.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Total Views</span>
                  <span className="text-2xl font-bold">
                    {formatNumber(
                      posts?.reduce((acc, post) => acc + (post.views || 0), 0) ||
                        0
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Share Your Story
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Join our community and share your insights with readers worldwide
                </p>
                <Link
                  href="/posts/create"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <span>Start Writing</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}