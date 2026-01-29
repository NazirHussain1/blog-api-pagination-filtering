"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
import {
  FileText,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  BarChart3,
  Heart,
  MessageCircle,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Clock,
  TrendingUp,
  Filter,
  Search,
  MoreVertical,
  X,
  Save,
  ArrowLeft,
  BookOpen,
  Users,
  ChevronRight,
  Laugh,
  Frown,
  Angry,
  Meh
} from "lucide-react";
import Comments from "@/app/components/Comments/Comments";

const REACTIONS = {
  like: { icon: Heart, label: "Like", color: "text-red-500" },
  love: { icon: Heart, label: "Love", color: "text-red-500" },
  laugh: { icon: Laugh, label: "Laugh", color: "text-yellow-500" },
  wow: { icon: Sparkles, label: "Wow", color: "text-purple-500" },
  sad: { icon: Frown, label: "Sad", color: "text-blue-400" },
  angry: { icon: Angry, label: "Angry", color: "text-red-600" }
};

export default function MyPostsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editData, setEditData] = useState({ title: "", body: "" });
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showActions, setShowActions] = useState(null);
  const [activeCommentsSlug, setActiveCommentsSlug] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts/myposts", {
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPosts(data);
      } catch {
        toast.error("Failed to load your posts", {
          icon: <AlertCircle className="text-red-500" />
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const deletePost = (slug, title) => {
    toast(
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
        <div>
          <div className="font-semibold">Delete Post</div>
          <div className="text-sm text-gray-600">Are you sure you want to delete &quot;{title}&quot;?</div>
        </div>
      </div>,
      {
        action: {
          label: "Delete",
          onClick: async () => {
            const res = await fetch(`/api/posts/${slug}`, {
              method: "DELETE",
              credentials: "include",
            });

            if (res.ok) {
              setPosts((prev) => prev.filter((p) => p.slug !== slug));
              toast.success("Post deleted successfully", {
                icon: <CheckCircle2 className="text-green-500" />
              });
            } else {
              toast.error("Failed to delete post", {
                icon: <AlertCircle className="text-red-500" />
              });
            }
          },
        },
        cancel: { label: "Cancel" },
        duration: 10000,
      }
    );
  };

  const updatePost = async () => {
    if (!editData.title.trim() || !editData.body.trim()) {
      toast.error("Title and body are required", {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    setSaving(true);

    const res = await fetch(`/api/posts/${editingPost.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(editData),
    });

    if (res.ok) {
      const updated = await res.json();
      setPosts((prev) =>
        prev.map((p) => (p.slug === updated.slug ? updated : p))
      );
      toast.success("Post updated successfully", {
        icon: <CheckCircle2 className="text-green-500" />
      });
      setEditingPost(null);
    } else {
      toast.error("Update failed", {
        icon: <AlertCircle className="text-red-500" />
      });
    }

    setSaving(false);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.body?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const [showReactionPicker, setShowReactionPicker] = useState(null);

  const toggleReaction = async (post, reaction = null) => {
    if (!user) {
      toast.error("You must be logged in to react to posts", { icon: <AlertCircle className="text-red-500" /> });
      return;
    }

    try {
      const res = await fetch(`/api/posts/${post.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reaction }),
      });

      if (!res.ok) throw new Error("Failed to toggle reaction");

      const data = await res.json();
      setPosts(prev => prev.map(p => p.slug === post.slug ? { 
        ...p, 
        reactions: data.reactions,
        userReaction: data.userReaction,
        likes: data.likesCount // Keep for backward compatibility
      } : p));
      setShowReactionPicker(null);
    } catch (err) {
      // Error updating reaction
      toast.error("Could not update reaction", { icon: <AlertCircle className="text-red-500" /> });
    }
  };

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0),
    totalReactions: posts.reduce((sum, post) => sum + (Object.values(post.reactions || {}).reduce((rSum, count) => rSum + count, 0)), 0)
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-full">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Loading Your Articles</h3>
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Toaster richColors position="top-right" />
      
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full mb-4">
                <FileText className="w-4 h-4 mr-2" />
                MY CONTENT
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                My <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Articles</span>
              </h1>
              <p className="text-gray-600">Manage all your published articles in one place</p>
            </div>
            
            <Button
              onClick={() => router.push("/posts/create")}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Articles', value: stats.total, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
              { label: 'Published', value: stats.published, icon: Eye, color: 'from-green-500 to-emerald-500' },
              { label: 'Drafts', value: stats.draft, icon: FileText, color: 'from-amber-500 to-orange-500' },
              { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
              { label: 'Total Reactions', value: stats.totalReactions.toLocaleString(), icon: Heart, color: 'from-red-500 to-pink-500' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search your articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {['all', 'published', 'draft', 'featured'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${activeFilter === filter 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <Filter className="w-4 h-4 inline mr-2" />
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl mb-6">
              <FileText className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchQuery ? "No Articles Found" : "No Articles Yet"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {searchQuery 
                ? `No articles match your search. Try different keywords.`
                : 'Start sharing your knowledge with the community by creating your first article.'}
            </p>
            <Button
              onClick={() => router.push("/posts/create")}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Your First Article
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPosts.map((post) => (
              <div key={post._id} className="group relative">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Post Image */}
                      {post.image && (
                        <div className="lg:w-1/3">
                          <div className="relative h-48 lg:h-full rounded-xl overflow-hidden">
                            <Image
                              src={post.image}
                              alt={post.title || "Post image"}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>
                        </div>
                      )}

                      {/* Post Content */}
                      <div className={`${post.image ? 'lg:w-2/3' : 'w-full'}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <div className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(post.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric' 
                                })}
                              </div>
                              <div className="flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">
                                <Eye className="w-3 h-3 mr-1" />
                                {post.views || 0} views
                              </div>
                              <div className="flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium relative">
                                <button
                                  onClick={() => setShowReactionPicker(showReactionPicker === post.slug ? null : post.slug)}
                                  className="inline-flex items-center hover:scale-110 transition-transform"
                                >
                                  {post.userReaction ? (
                                    <div className={`w-3 h-3 mr-1 ${REACTIONS[post.userReaction].color}`}>
                                      {(() => {
                                        const IconComponent = REACTIONS[post.userReaction].icon;
                                        return <IconComponent className="w-3 h-3" />;
                                      })()}
                                    </div>
                                  ) : (
                                    <Heart className="w-3 h-3 mr-1" />
                                  )}
                                </button>
                                <span>
                                  {Object.values(post.reactions || {}).reduce((sum, count) => sum + count, 0) || 0} reactions
                                </span>
                                
                                {/* Reaction Picker */}
                                {showReactionPicker === post.slug && (
                                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 flex gap-1">
                                    {Object.entries(REACTIONS).map(([type, { icon: Icon, label, color }]) => (
                                      <button
                                        key={type}
                                        onClick={() => toggleReaction(post, type)}
                                        className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${color} ${post.userReaction === type ? 'bg-gray-100' : ''}`}
                                        title={label}
                                      >
                                        <Icon className="w-4 h-4" />
                                      </button>
                                    ))}
                                    {post.userReaction && (
                                      <button
                                        onClick={() => toggleReaction(post, null)}
                                        className="p-2 rounded-full hover:bg-red-100 transition-colors text-gray-400 hover:text-red-500"
                                        title="Remove reaction"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                              {post.status === 'draft' && (
                                <div className="flex items-center px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-sm font-medium">
                                  <FileText className="w-3 h-3 mr-1" />
                                  Draft
                                </div>
                              )}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                              {post.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {post.body}
                            </p>

                            {post.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-xs font-medium"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {post.tags.length > 3 && (
                                  <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                                    +{post.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <button
                                onClick={() => setActiveCommentsSlug(activeCommentsSlug === post.slug ? null : post.slug)}
                                className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {post.comments || 0} comments
                              </button>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {post.readTime || 5} min read
                              </div>
                              <div className="flex items-center">
                                <BarChart3 className="w-4 h-4 mr-1" />
                                {post.engagement || 0}% engagement
                              </div>
                            </div>
                          </div>

                          <div className="relative">
                            <button
                              onClick={() => setShowActions(showActions === post._id ? null : post._id)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            {showActions === post._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-10 animate-slide-down">
                                <button
                                  onClick={() => {
                                    setEditingPost(post);
                                    setEditData({ title: post.title, body: post.body });
                                    setShowActions(null);
                                  }}
                                  className="flex items-center w-full p-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200 text-indigo-600"
                                >
                                  <Edit className="w-4 h-4 mr-3" />
                                  Edit Article
                                </button>
                                <button
                                  onClick={() => router.push(`/posts/${post.slug}`)}
                                  className="flex items-center w-full p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                >
                                  <Eye className="w-4 h-4 mr-3 text-blue-600" />
                                  View Article
                                </button>
                                <button
                                  onClick={() => {
                                    deletePost(post.slug, post.title);
                                    setShowActions(null);
                                  }}
                                  className="flex items-center w-full p-3 rounded-lg hover:bg-red-50 transition-colors duration-200 text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-3" />
                                  Delete Article
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          <Button
                            onClick={() => {
                              setEditingPost(post);
                              setEditData({ title: post.title, body: post.body });
                            }}
                            variant="outline"
                            className="flex-1 border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => router.push(`/posts/${post.slug}`)}
                            variant="outline"
                            className="flex-1 border-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            onClick={() => deletePost(post.slug, post.title)}
                            variant="destructive"
                            className="flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              {activeCommentsSlug === post.slug && (
                <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-100">
                  <Comments slug={post.slug} user={user} />
                </div>
              )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Article</h2>
                <p className="text-gray-600">Update your article content</p>
              </div>
              <button 
                onClick={() => setEditingPost(null)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                  Article Title
                </label>
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  placeholder="Enter article title"
                  className="w-full py-3.5 border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                  Content
                </label>
                <textarea
                  className="w-full p-4 border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all duration-300 min-h-[300px] resize-none"
                  value={editData.body}
                  onChange={(e) => setEditData({ ...editData, body: e.target.value })}
                  placeholder="Write your article content..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => setEditingPost(null)}
                  className="px-6 py-3 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  disabled={saving}
                  onClick={updatePost}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg rounded-xl"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-down {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out forwards;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
}