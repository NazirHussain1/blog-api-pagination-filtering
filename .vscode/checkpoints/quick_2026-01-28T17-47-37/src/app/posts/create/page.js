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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting", {
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
      };

      await dispatch(createPost(postData)).unwrap();
      
      toast.success("Post Published!", {
        description: "Your article is now live on InsightHub",
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      });
      
      // Redirect to posts page or home
      router.push("/posts");

    } catch (error) {
      toast.error(error.message || "Failed to create post", {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Back</span>
              </Link>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <h1 className="hidden sm:block text-lg font-semibold text-gray-900">
                Create New Article
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden md:flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
                onClick={handleSubmit}
                disabled={loading || uploading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {loading || uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {uploading ? "Uploading..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {!showPreview ? (
                <div className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                        <Type className="w-4 h-4 mr-2 text-indigo-600" />
                        Title
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <Input
                        placeholder="Write an attention-grabbing title..."
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className={`text-xl font-semibold border-2 ${
                          errors.title ? 'border-red-300' : 'border-gray-200'
                        } focus:border-indigo-500 rounded-lg`}
                        maxLength={200}
                      />
                      <div className="flex justify-between mt-2">
                        {errors.title && (
                          <p className="text-sm text-red-600">{errors.title}</p>
                        )}
                        <p className={`text-xs ml-auto ${getCharCount(form.title, 200).color}`}>
                          {getCharCount(form.title, 200).count}/200
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                        <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                        Description (Optional)
                      </label>
                      <Input
                        placeholder="Brief description for search engines and previews..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className={`border-2 ${
                          errors.description ? 'border-red-300' : 'border-gray-200'
                        } focus:border-indigo-500 rounded-lg`}
                        maxLength={300}
                      />
                      <div className="flex justify-between mt-2">
                        {errors.description && (
                          <p className="text-sm text-red-600">{errors.description}</p>
                        )}
                        <p className={`text-xs ml-auto ${getCharCount(form.description, 300).color}`}>
                          {getCharCount(form.description, 300).count}/300
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                        <Edit3 className="w-4 h-4 mr-2 text-indigo-600" />
                        Content
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <textarea
                        placeholder="Write your article content here... (Markdown supported)"
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        rows={16}
                        className={`w-full p-4 border-2 ${
                          errors.content ? 'border-red-300' : 'border-gray-200'
                        } focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-100 transition-all resize-none`}
                      />
                      <div className="flex justify-between mt-2">
                        {errors.content && (
                          <p className="text-sm text-red-600">{errors.content}</p>
                        )}
                        <div className="flex items-center space-x-4 ml-auto text-xs text-gray-500">
                          <span>{form.content.length} characters</span>
                          <span>~{Math.ceil(form.content.split(/\s+/).length / 200)} min read</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                        <Tag className="w-4 h-4 mr-2 text-indigo-600" />
                        Tags
                      </label>
                      <Input
                        placeholder="technology, programming, design (comma separated, max 5)"
                        value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                        className={`border-2 ${
                          errors.tags ? 'border-red-300' : 'border-gray-200'
                        } focus:border-indigo-500 rounded-lg`}
                      />
                      {errors.tags && (
                        <p className="mt-2 text-sm text-red-600">{errors.tags}</p>
                      )}
                      {form.tags && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {form.tags.split(",").map((tag, i) => (
                            tag.trim() && (
                              <span
                                key={i}
                                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
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
                <div className="p-6 md:p-8">
                  <div className="prose max-w-none">
                    {preview && (
                      <div className="mb-6 rounded-xl overflow-hidden">
                        <Image
                          src={preview}
                          alt="Article preview"
                          width={800}
                          height={400}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      {form.title || "Your title will appear here"}
                    </h1>
                    {form.description && (
                      <p className="text-xl text-gray-600 mb-6">{form.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mb-6">
                      {form.tags && form.tags.split(",").map((tag, i) => (
                        tag.trim() && (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            #{tag.trim()}
                          </span>
                        )
                      ))}
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {form.content || "Your content will appear here..."}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Featured Image */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-indigo-600" />
                  Featured Image
                </h3>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl transition-all ${
                    isDragging 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {preview ? (
                    <div className="relative group">
                      <Image
                        src={preview}
                        alt="Preview"
                        width={400}
                        height={256}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setImageFile(null);
                          setPreview(null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
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
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WebP up to 5MB
                      </p>
                    </label>
                  )}
                </div>
                
                <div className="mt-4 space-y-1 text-xs text-gray-500">
                  <p>• Recommended: 1200×630 pixels</p>
                  <p>• Max file size: 5MB</p>
                  <p>• Supported: JPG, PNG, WebP</p>
                </div>
              </div>

              {/* Publishing Tips */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-amber-500" />
                  Publishing Tips
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Use a clear, descriptive title (10-60 characters)</span>
                  </li>
                  <li className="flex items-start text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Add 3-5 relevant tags for better discoverability</span>
                  </li>
                  <li className="flex items-start text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Include a featured image to increase engagement</span>
                  </li>
                  <li className="flex items-start text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Proofread your content before publishing</span>
                  </li>
                </ul>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Need help?</p>
                    <p className="text-blue-700">
                      Check out our{" "}
                      <a href="/guide" className="underline font-medium">
                        writing guide
                      </a>{" "}
                      for best practices and tips.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}