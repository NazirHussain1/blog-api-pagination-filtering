"use client";

import Link from "next/link";
import Image from "next/image";
import {
  UserCircle,
  Clock,
  Tag,
  ArrowRight,
  Eye,
  MessageCircle,
  Heart,
  ThumbsUp,
  Laugh,
  Frown,
  Angry,
  Meh,
  X,
} from "lucide-react";
import { useState } from "react";

const REACTIONS = {
  like: { icon: ThumbsUp, label: "Like", color: "text-blue-500" },
  love: { icon: Heart, label: "Love", color: "text-red-500" },
  laugh: { icon: Laugh, label: "Laugh", color: "text-yellow-500" },
  wow: { icon: Meh, label: "Wow", color: "text-purple-500" },
  sad: { icon: Frown, label: "Sad", color: "text-blue-400" },
  angry: { icon: Angry, label: "Angry", color: "text-red-600" }
};

export default function PostCard({ post, user }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactions, setReactions] = useState(post.reactions || {});
  const [userReaction, setUserReaction] = useState(post.userReaction || null);

  const postBody =
    typeof post.body === "string"
      ? post.body
      : post.body?.text || post.body?.content || "";

  // Handle Reaction
  const handleReaction = async (reaction = null) => {
    try {
      const res = await fetch(`/api/posts/${post.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reaction }),
      });
      const data = await res.json();
      setReactions(data.reactions);
      setUserReaction(data.userReaction);
      setShowReactionPicker(false);
    } catch (err) {
      console.error("Reaction Error:", err);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-indigo-200 h-full transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 h-full flex flex-col">
        {post.image && (
          <div className="relative w-full h-56 md:h-64 overflow-hidden rounded-t-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent z-10"></div>
            <Image
              src={post.image}
              alt={post.title || "Post image"}
              fill
              className={`object-cover transition-transform duration-700 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-lg">
                FEATURED
              </div>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8 flex-1 flex flex-col">
          {/* Author + Date */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 p-1.5 rounded-full">
                  <UserCircle size={18} className="text-white" />
                </div>
              </div>
              <Link
                href={`/profile/${post.author?.name}`}
                className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-300"
              >
                {post.author?.name || "Unknown Author"}
              </Link>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              <span className="font-medium">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <div className="w-4 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
            </div>

            <Link href={`/posts/${post.slug}`}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2 leading-tight">
                {post.title}
              </h2>
            </Link>
          </div>

          {/* Post Body */}
          <div className="mb-6 flex-1">
            <p className="text-gray-600 line-clamp-3 leading-relaxed">
              {postBody ||
                "Explore this insightful article packed with valuable information and expert perspectives."}
            </p>
          </div>

          {/* Tags + Views + Comments + Likes */}
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-indigo-500" />
                <span className="text-xs font-semibold text-gray-700">TAGS</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={`${post._id}-${tag}`}
                    className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 font-medium px-3 py-1.5 rounded-full border border-indigo-100 hover:border-indigo-300 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-600 font-medium px-3 py-1.5 rounded-full">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Views, Comments, Likes */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>{post.views?.toLocaleString() || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={12} />
                  <span>{post.commentsCount ?? 0} comments</span>
                </div>
                <div className="flex items-center gap-1 relative">
                  <button
                    onClick={() => setShowReactionPicker(!showReactionPicker)}
                    className={`flex items-center gap-1 transition hover:scale-110 ${
                      userReaction ? REACTIONS[userReaction].color : ""
                    }`}
                  >
                    {userReaction ? (
                      (() => {
                        const IconComponent = REACTIONS[userReaction].icon;
                        return <IconComponent size={12} />;
                      })()
                    ) : (
                      <Heart size={12} />
                    )}
                  </button>
                  <span>
                    {Object.values(reactions).reduce((sum, count) => sum + count, 0) || 0}
                  </span>
                  
                  {/* Reaction Picker */}
                  {showReactionPicker && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 flex gap-1">
                      {Object.entries(REACTIONS).map(([type, { icon: Icon, label, color }]) => (
                        <button
                          key={type}
                          onClick={() => handleReaction(type)}
                          className={`p-1 rounded hover:bg-gray-100 transition-colors ${color} ${userReaction === type ? 'bg-gray-100' : ''}`}
                          title={label}
                        >
                          <Icon size={14} />
                        </button>
                      ))}
                      {userReaction && (
                        <button
                          onClick={() => handleReaction(null)}
                          className="p-1 rounded hover:bg-red-100 transition-colors text-gray-400 hover:text-red-500"
                          title="Remove reaction"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Read More */}
          <div className="pt-6 border-t border-gray-100 mt-auto">
            <Link
              href={`/posts/${post.slug}`}
              className="group/link inline-flex items-center justify-between w-full"
            >
              <span className="text-indigo-600 font-semibold group-hover/link:text-indigo-800 transition-colors duration-300">
                Read Full Article
              </span>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover/link:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-full group-hover/link:translate-x-2 transition-transform duration-300">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </div>
  );
}
