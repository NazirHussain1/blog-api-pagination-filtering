"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createPost } from "@/redux/features/posts/postSlice";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Image as ImageIcon, 
  Tag, 
  User, 
  Type, 
  FileText, 
  Sparkles,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  ArrowLeft,
  Info,
  Zap,
  BookOpen,
  Target,
  Lightbulb,
  Award,
  Star,
  Feather,
  Send,
  Save,
  Clock,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CreatePostPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    title: "",
    content: "",
    description: "",
    tags: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  // Initialize animation
  useState(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleImageChange = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return "";
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      
      const res = await fetch("/api/posts/upload", { 
        method: "POST", 
        body: formData 
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Upload failed");
      }
      
      const data = await res.json();
      return data.url || data.imageUrl;
    } catch (err) {
      toast.error(err.message || "Image upload failed");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    } else if (form.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!form.content.trim()) {
      newErrors.content = "Content is required";
    } else if (form.content.length < 50) {
      newErrors.content = "Content must be at least 50 characters";
    }

    if (form.description && form.description.length > 300) {
      newErrors.description = "Description must be less than 300 characters";
    }

    if (form.tags) {
      const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
      if (tags.length > 5) {
        newErrors.tags = "Maximum 5 tags allowed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();

    if (!isDraft && !validateForm()) {
      toast.error("Please fix the errors before publishing", {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />
      });
      return;
    }

    try {
      const imageUrl = imageFile ? await handleImageUpload() : "";
      
      const postData = {
        title: form.title.trim(),
        content: form.content.trim(),
        description: form.description.trim() || form.content.substring(0, 150).trim() + "...",
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        image: imageUrl,
        author: user?._id,
        status: isDraft ? "draft" : "published",
      };

      await dispatch(createPost(postData)).unwrap();
      
      toast.success(isDraft ? "Draft Saved!" : "Post Published!", {
        description: isDraft 
          ? "Your draft has been saved successfully" 
          : "Your article is now live on InsightHub",
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      });
      
      // Redirect to posts page or home
      router.push(isDraft ? "/my-posts" : "/posts");

    } catch (error) {
      toast.error(error.message || `Failed to ${isDraft ? 'save draft' : 'create post'}`, {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const getCharCount = (text, max) => {
    const count = text.length;
    const percentage = (count / max) * 100;
    let color = "text-gray-500";
    
    if (percentage > 90) color = "text-red-600";
    else if (percentage > 75) color = "text-amber-600";
    
    return { count, color };
  };

  return (
    <main className={`min-h-screen bg-white transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
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
              <Link
                href="/"
                className="inline-flex items-center text-white/90 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="hidden md:flex items-center px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  {showPreview ? (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      <span>Edit</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      <span>Preview</span>
                    </>
                  )}
                </button>

                <Button
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading || uploading}
                  variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/10 border border-white/30"
                >
                  {loading && saveAsDraft ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </>
                  )}
                </Button>

                <Button
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={loading || uploading}
                  className="bg-white text-indigo-600 hover:bg-gray-50 font-semibold"
                >
                  {loading && !saveAsDraft ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {uploading ? "Uploading..." : "Publishing..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Publish Article
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Header Content */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
                <Feather className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-semibold">CREATE ARTICLE</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-slide-up">
                Share Your Story
              </h1>
              
              <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
                Create engaging content that inspires and educates our community
              </p>
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

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Main Editor */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  {!showPreview ? (
                    <div className="p-8 md:p-12">
                      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
                        {/* Title */}
                        <div>
                          <label className="flex items-center text-lg font-bold text-gray-900 mb-4">
                            <Type className="w-5 h-5 mr-3 text-indigo-600" />
                            Article Title
                            <span className="text-red-500 ml-2">*</span>
                          </label>
                          <Input
                            placeholder="Write an attention-grabbing title that draws readers in..."
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className={`text-2xl font-bold border-2 py-4 px-6 ${
                              errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                            } rounded-xl transition-all duration-300`}
                            maxLength={200}
                          />
                          <div className="flex justify-between mt-3">
                            {errors.title && (
                              <p className="text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.title}
                              </p>
                            )}
                            <p className={`text-sm ml-auto ${getCharCount(form.title, 200).color}`}>
                              {getCharCount(form.title, 200).count}/200 characters
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="flex items-center text-lg font-bold text-gray-900 mb-4">
                            <FileText className="w-5 h-5 mr-3 text-indigo-600" />
                            Article Description
                            <span className="text-gray-500 text-sm font-normal ml-2">(Optional)</span>
                          </label>
                          <Input
                            placeholder="Brief description for search engines and social media previews..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className={`text-lg border-2 py-4 px-6 ${
                              errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                            } rounded-xl transition-all duration-300`}
                            maxLength={300}
                          />
                          <div className="flex justify-between mt-3">
                            {errors.description && (
                              <p className="text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.description}
                              </p>
                            )}
                            <p className={`text-sm ml-auto ${getCharCount(form.description, 300).color}`}>
                              {getCharCount(form.description, 300).count}/300 characters
                            </p>
                          </div>
                        </div>

                        {/* Content */}
                        <div>
                          <label className="flex items-center text-lg font-bold text-gray-900 mb-4">
                            <Edit3 className="w-5 h-5 mr-3 text-indigo-600" />
                            Article Content
                            <span className="text-red-500 ml-2">*</span>
                          </label>
                          <textarea
                            placeholder="Write your article content here... Share your knowledge, insights, and experiences with our community. Use clear paragraphs and engaging language to keep readers interested."
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            rows={20}
                            className={`w-full p-6 border-2 text-lg leading-relaxed ${
                              errors.content ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                            } rounded-xl focus:ring-4 focus:ring-indigo-100 transition-all duration-300 resize-none`}
                          />
                          <div className="flex justify-between mt-3">
                            {errors.content && (
                              <p className="text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.content}
                              </p>
                            )}
                            <div className="flex items-center space-x-6 ml-auto text-sm text-gray-500">
                              <span className="flex items-center">
                                <Type className="w-4 h-4 mr-1" />
                                {form.content.length} characters
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                ~{Math.ceil(form.content.split(/\s+/).length / 200)} min read
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="flex items-center text-lg font-bold text-gray-900 mb-4">
                            <Tag className="w-5 h-5 mr-3 text-indigo-600" />
                            Tags
                            <span className="text-gray-500 text-sm font-normal ml-2">(Help readers discover your content)</span>
                          </label>
                          <Input
                            placeholder="technology, programming, design, tutorial, tips (comma separated, max 5)"
                            value={form.tags}
                            onChange={(e) => setForm({ ...form, tags: e.target.value })}
                            className={`text-lg border-2 py-4 px-6 ${
                              errors.tags ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                            } rounded-xl transition-all duration-300`}
                          />
                          {errors.tags && (
                            <p className="mt-3 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.tags}
                            </p>
                          )}
                          {form.tags && (
                            <div className="flex flex-wrap gap-3 mt-4">
                              {form.tags.split(",").map((tag, i) => (
                                tag.trim() && (
                                  <span
                                    key={i}
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl text-sm font-semibold border border-indigo-200"
                                  >
                                    #{tag.trim()}
                                  </span>
                                )
                              ))}
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Preview Mode */
                    <div className="p-8 md:p-12">
                      <div className="prose prose-lg max-w-none">
                        {preview && (
                          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                            <Image
                              src={preview}
                              alt="Article preview"
                              width={800}
                              height={400}
                              className="w-full h-80 object-cover"
                            />
                          </div>
                        )}
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                          {form.title || "Your amazing title will appear here"}
                        </h1>
                        {form.description && (
                          <p className="text-xl text-gray-600 mb-8 leading-relaxed">{form.description}</p>
                        )}
                        <div className="flex flex-wrap gap-3 mb-8">
                          {form.tags && form.tags.split(",").map((tag, i) => (
                            tag.trim() && (
                              <span
                                key={i}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl text-sm font-semibold"
                              >
                                #{tag.trim()}
                              </span>
                            )
                          ))}
                        </div>
                        <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                          {form.content || "Your engaging content will appear here... Start writing to see the preview!"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                  {/* Featured Image */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                      <ImageIcon className="w-5 h-5 mr-3 text-indigo-600" />
                      Featured Image
                    </h3>
                    
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
                        isDragging 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                      }`}
                    >
                      {preview ? (
                        <div className="relative group">
                          <Image
                            src={preview}
                            alt="Preview"
                            width={400}
                            height={256}
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <button
                            onClick={() => {
                              setImageFile(null);
                              setPreview(null);
                            }}
                            className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block p-8 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files?.[0])}
                            className="hidden"
                          />
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl mb-4">
                            <Upload className="w-8 h-8 text-indigo-600" />
                          </div>
                          <p className="text-lg font-semibold text-gray-700 mb-2">
                            Upload Featured Image
                          </p>
                          <p className="text-sm text-gray-500 mb-2">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG, WebP up to 5MB
                          </p>
                        </label>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                        <span>Recommended: 1200×630 pixels</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                        <span>Max file size: 5MB</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                        <span>Formats: JPG, PNG, WebP</span>
                      </div>
                    </div>
                  </div>

                  {/* Writing Tips */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-3 text-amber-500" />
                      Writing Tips
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start text-sm text-gray-700">
                        <Target className="w-4 h-4 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Start with a compelling hook to grab attention</span>
                      </li>
                      <li className="flex items-start text-sm text-gray-700">
                        <BookOpen className="w-4 h-4 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Use clear headings and short paragraphs</span>
                      </li>
                      <li className="flex items-start text-sm text-gray-700">
                        <Star className="w-4 h-4 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Include examples and actionable insights</span>
                      </li>
                      <li className="flex items-start text-sm text-gray-700">
                        <Award className="w-4 h-4 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>End with a strong conclusion or call-to-action</span>
                      </li>
                    </ul>
                  </div>

                  {/* Publishing Guidelines */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-3 text-green-600" />
                      Publishing Guidelines
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Title should be 10-60 characters for best SEO</span>
                      </li>
                      <li className="flex items-start text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Add 3-5 relevant tags for discoverability</span>
                      </li>
                      <li className="flex items-start text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Include a featured image for engagement</span>
                      </li>
                      <li className="flex items-start text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Proofread before publishing</span>
                      </li>
                    </ul>
                  </div>

                  {/* Help Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
                    <div className="flex items-start">
                      <Info className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                      <div className="text-sm text-blue-900">
                        <p className="font-bold mb-2">Need Help?</p>
                        <p className="text-blue-700 leading-relaxed">
                          Check out our{" "}
                          <Link href="/guide" className="underline font-semibold hover:text-blue-800">
                            comprehensive writing guide
                          </Link>{" "}
                          for detailed tips, best practices, and examples.
                        </p>
                      </div>
                    </div>
                  </div>
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