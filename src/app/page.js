"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "@/redux/features/posts/postSlice";
import PostCard from "@/app/components/PostCard/PostCard";
import Link from "next/link";
import {
  FaArrowRight,
  FaBlogger,
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaTags,
  FaFire,
} from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";

export default function Home() {
  const dispatch = useDispatch();
  const { list: posts, loading } = useSelector((state) => state.posts);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 3, sort: "newest" }));
    setTimeout(() => setIsLoaded(true), 100);
  }, [dispatch]);

  return (
    <main
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 transition-all duration-500 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <section className="relative py-20 md:py-28 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl mb-8 shadow-2xl animate-float">
              <FaBlogger className="text-4xl" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-pink-300 animate-slide-up">
              The Insight Hub
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light animate-slide-up delay-150">
              Where ideas spark innovation. Explore cutting-edge articles,
              expert tutorials, and transformative insights from visionary
              thinkers.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up delay-300">
              <Link
                href="/posts"
                className="group inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-10 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <span className="mr-3">Discover Articles</span>
                <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              <Link
                href="#latest"
                className="group inline-flex items-center justify-center bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white font-bold py-4 px-10 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <FaFire className="mr-3 text-amber-300" />
                Trending Now
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-20 md:h-28 text-gray-50"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill="currentColor"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35,6.36,117.35-5.65C939.06,29.08,1053,4,1200,0V0Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6" id="latest">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 font-bold py-2 px-4 rounded-full mb-4">
                <FiTrendingUp className="mr-2" />
                FRESH CONTENT
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Latest{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Insights
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl">
                Dive into our most recent articles covering technology, design,
                development, and innovation trends.
              </p>
            </div>

            <Link
              href="/posts"
              className="group inline-flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold py-4 px-8 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <span className="mr-3">Browse All Articles</span>
              <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
                >
                  <div className="h-48 bg-gray-200 rounded-xl mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-6"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <div
                  key={post._id || post.slug}
                  className="group transform transition-all duration-500 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 h-full border border-gray-100">
                    <div className="absolute top-6 right-6 z-10">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2 px-4 rounded-full text-sm shadow-lg">
                        NEW
                      </div>
                    </div>
                    <div className="p-8 h-full flex flex-col">
                      <div className="mb-6">
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <FaCalendarAlt className="mr-2" />
                          <span>Just Published</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                          {post.excerpt ||
                            "Explore this insightful article packed with valuable information and expert perspectives."}
                        </p>
                      </div>

                      <div className="mt-auto pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                              <FaUser />
                            </div>
                            <div className="ml-3">
                              <div className="font-semibold text-gray-900">
                                {post.author?.name || "Admin"}
                              </div>

                              <div className="text-sm text-gray-500">
                                Expert Writer
                              </div>
                            </div>
                          </div>
                          <Link
                            href={`/posts/${post.slug || post._id}`}
                            className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300"
                          >
                            Read More
                            <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-20 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <div className="text-center max-w-3xl mx-auto">
              <FaSearch className="text-4xl text-indigo-600 mb-6 mx-auto" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Can not Find What You are Looking For?
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Explore our complete archive of articles, tutorials, and
                resources. Use our advanced search to find exactly what you
                need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center bg-white text-gray-900 font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  <FaTags className="mr-3 text-indigo-600" />
                  Browse Categories
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all duration-300"
                >
                  <FaSearch className="mr-3" />
                  Advanced Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </main>
  );
}
