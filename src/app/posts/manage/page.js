"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost, updatePost } from "@/redux/features/posts/postSlice";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  X, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Tag, 
  FileText, 
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  MoreVertical,
  Clock,
  TrendingUp,
  Sparkles,
  Image as ImageIcon,
  Save,
  Sliders
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ManagePosts() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { list: posts, loading, error } = useSelector((state) => state.posts);

  const [editPost, setEditPost] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    body: "",
    authorName: "",
    tags: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const modalRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access denied. Admins only.");
      router.push("/");
    } else {
      dispatch(fetchPosts({ page: 1, limit: 100, sort: "newest" }));
    }
  }, [dispatch, user, router]);

  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setEditPost(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDelete = (slug, title) => {
    toast(
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
        <div>
          <div className="font-semibold">Delete Post</div>
          <div className="text-sm text-gray-600">Are you sure you want to delete "{title}"?</div>
        </div>
      </div>,
      {
        action: {
          label: "Delete",
          onClick: async () => {
            try {
              await dispatch(deletePost(slug)).unwrap();
              toast.success("Post deleted successfully", {
                icon: <CheckCircle2 className="text-green-500" />
              });
            } catch {
              toast.error("Delete failed", {
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

  const openEdit = (post) => {
    setEditPost(post);
    setEditForm({
      title: post.title || "",
      body: post.body || "",
      authorName: post.author?.name || "",
      tags: post.tags?.join(", ") || "",
    });
    setPreview(post.image || null);
    setNewImage(null);
  };

  const uploadImage = async () => {
    if (!newImage) return editPost.image;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", newImage);

      const res = await fetch("/api/posts/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      return data.url;
    } finally {
      setUploading(false);
    }
  };

  const saveEdit = async () => {
    try {
      const imageUrl = await uploadImage();

      await dispatch(
        updatePost({
          slug: editPost.slug,
          data: {
            title: editForm.title,
            body: editForm.body,
            author: { name: editForm.authorName },
            tags: editForm.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
            image: imageUrl,
          },
        })
      ).unwrap();

      toast.success("Post updated successfully", {
        icon: <CheckCircle2 className="text-green-500" />
      });
      setEditPost(null);
    } catch {
      toast.error("Update failed", {
        icon: <AlertCircle className="text-red-500" />
      });
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    featured: posts.filter(p => p.featured).length
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">This area is restricted to administrators only.</p>
          <Button 
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
                <Shield className="w-4 h-4 mr-2" />
                ADMIN PANEL
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                Manage <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Content</span>
              </h1>
              <p className="text-gray-600">Manage and moderate all articles on the platform</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => router.push("/posts/create")}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Posts', value: stats.total, icon: FileText, color: 'from-blue-500 to-cyan-500' },
              { label: 'Published', value: stats.published, icon: Eye, color: 'from-green-500 to-emerald-500' },
              { label: 'Drafts', value: stats.draft, icon: FileText, color: 'from-amber-500 to-orange-500' },
              { label: 'Featured', value: stats.featured, icon: TrendingUp, color: 'from-purple-500 to-pink-500' }
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

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Sliders className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search posts by title, author, or content..."
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
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-full">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Loading Posts</h3>
              <p className="text-gray-600">Fetching content management data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Posts</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">{error}</p>
            <Button
              onClick={() => dispatch(fetchPosts({ page: 1, limit: 100, sort: "newest" }))}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg"
            >
              Try Again
            </Button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl mb-6">
              <FileText className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Posts Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {searchQuery 
                ? `No posts match your search criteria. Try different keywords.`
                : 'No posts have been created yet.'}
            </p>
            <Button
              onClick={() => router.push("/posts/create")}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create First Post
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPosts.map((post) => (
              <div key={post.slug} className="group relative">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">
                            <User className="w-3 h-3 mr-1" />
                            {post.author?.name || "Unknown"}
                          </div>
                          {post.featured && (
                            <div className="flex items-center px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-sm font-medium">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Featured
                            </div>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {post.body?.slice(0, 150)}...
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
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views || 0} views
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.readTime || 5} min read
                          </div>
                          <div className="flex items-center">
                            <BarChart3 className="w-4 h-4 mr-1" />
                            {post.status || 'published'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => openEdit(post)}
                          variant="outline"
                          className="px-4 py-2 border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(post.slug, post.title)}
                          variant="destructive"
                          className="px-4 py-2"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef} 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
                <p className="text-gray-600">Update post details and content</p>
              </div>
              <button 
                onClick={() => setEditPost(null)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                    Title
                  </label>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Post title"
                    className="w-full py-3.5 border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-indigo-500" />
                    Author Name
                  </label>
                  <Input
                    value={editForm.authorName}
                    onChange={(e) => setEditForm({ ...editForm, authorName: e.target.value })}
                    placeholder="Author name"
                    className="w-full py-3.5 border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="w-4 h-4 mr-2 text-indigo-500" />
                  Tags
                </label>
                <Input
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  placeholder="web, development, react (comma separated)"
                  className="w-full py-3.5 border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <ImageIcon className="w-4 h-4 mr-2 text-indigo-500" />
                  Featured Image
                </label>
                <div 
                  className={`border-2 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-dashed border-gray-300'} rounded-xl p-8 text-center transition-all duration-300`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith('image/')) {
                      setNewImage(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                >
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl mb-4" />
                      <button
                        onClick={() => {
                          setNewImage(null);
                          setPreview(null);
                        }}
                        className="absolute top-2 right-2 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-indigo-500" />
                      </div>
                      <p className="text-gray-700 mb-2">Drag & drop image or</p>
                      <label className="inline-block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setNewImage(file);
                            setPreview(URL.createObjectURL(file));
                          }}
                          className="hidden"
                        />
                        <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 cursor-pointer">
                          Browse Files
                        </span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                  Content
                </label>
                <textarea
                  className="w-full p-4 border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all duration-300 min-h-[200px] resize-none"
                  value={editForm.body}
                  onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                  placeholder="Post content..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => setEditPost(null)}
                  className="px-6 py-3 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  disabled={uploading}
                  onClick={saveEdit}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg rounded-xl"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
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
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
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