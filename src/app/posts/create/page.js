"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation"; // ← added for redirect
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
  AlertCircle
} from "lucide-react";
import Image from "next/image";

export default function CreatePost() {
  const dispatch = useDispatch();
  const router = useRouter(); // ← initialized router
  const { loading } = useSelector((state) => state.posts);

  const [form, setForm] = useState({
    title: "",
    body: "",
    author: "",
    tags: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = async () => {
    if (!imageFile) return "";
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch("/api/posts/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Upload failed");
      return data.url;
    } catch (err) {
      toast.error(err.message || "Image upload failed");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.body.trim()) newErrors.body = "Body is required";
    if (!form.author.trim()) newErrors.author = "Author is required";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      toast.error("Please fill all required fields", {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    try {
      const imageUrl = await handleImageUpload();
      const postData = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        image: imageUrl,
      };
      await dispatch(createPost(postData)).unwrap();
      
      toast.success("Post Published!", {
        description: "Your article is now live on InsightHub",
        icon: <CheckCircle2 className="text-green-500" />,
        duration: 5000
      });
      
      setForm({ title: "", body: "", author: "", tags: "" });
      setImageFile(null);
      setPreview(null);

      if (typeof window !== 'undefined') {
        const confetti = import('canvas-confetti');
        confetti.then((confetti) => {
          confetti.default({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        });
      }

      router.push("/"); // ← Redirect to Home after post creation

    } catch {
      toast.error("Failed to create post", {
        icon: <AlertCircle className="text-red-500" />
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Create Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Masterpiece</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your insights, knowledge, and perspectives with our global community of learners and innovators.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title Field */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <Type className="w-4 h-4 mr-2 text-indigo-500" />
                      Article Title
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="Craft a compelling title..."
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className={`w-full px-4 py-3.5 text-lg border-2 ${errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'} rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all duration-300`}
                      />
                      {errors.title && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  {/* Body Field */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                      Content
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        placeholder="Share your story, insights, or knowledge..."
                        value={form.body}
                        onChange={(e) => setForm({ ...form, body: e.target.value })}
                        rows={12}
                        className={`w-full p-4 border-2 ${errors.body ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'} rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all duration-300 resize-none`}
                      />
                      {errors.body && (
                        <div className="absolute right-3 top-3">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.body && (
                      <p className="mt-2 text-sm text-red-600">{errors.body}</p>
                    )}
                    <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                      <span>Supports markdown formatting</span>
                      <span>{form.body.length} characters</span>
                    </div>
                  </div>

                  {/* Author Field */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <User className="w-4 h-4 mr-2 text-indigo-500" />
                      Author Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="Your name or pseudonym"
                        value={form.author}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                        className={`w-full px-4 py-3.5 border-2 ${errors.author ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'} rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all duration-300`}
                      />
                      {errors.author && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.author && (
                      <p className="mt-2 text-sm text-red-600">{errors.author}</p>
                    )}
                  </div>

                  {/* Tags Field */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <Tag className="w-4 h-4 mr-2 text-indigo-500" />
                      Tags
                    </label>
                    <Input
                      placeholder="technology, web-development, AI, design (comma separated)"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Add up to 5 tags to help readers discover your content
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading || uploading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading || uploading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        {uploading ? "Uploading Image..." : "Publishing..."}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Sparkles className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        Publish Article
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Image Upload Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Image Upload Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-indigo-500" />
                  Featured Image
                </h3>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-dashed border-gray-300'} rounded-2xl transition-all duration-300 ${!preview ? 'p-8' : 'p-4'}`}
                >
                  {preview ? (
                    <div className="relative group">
                      <Image
                        src={preview}
                        alt="Preview"
                        width={400}
                        height={256}
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => {
                          setImageFile(null);
                          setPreview(null);
                        }}
                        className="absolute top-3 right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-indigo-500" />
                      </div>
                      <p className="text-gray-700 font-medium mb-2">
                        Drag & drop your image
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        or click to browse files
                      </p>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setImageFile(file);
                            setPreview(URL.createObjectURL(file));
                          }}
                          className="hidden"
                        />
                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300">
                          <Upload className="w-4 h-4 mr-2" />
                          Select Image
                        </div>
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 text-sm text-gray-500">
                  <p>• Recommended: 1200×630 pixels</p>
                  <p>• Max file size: 5MB</p>
                  <p>• Formats: JPG, PNG, WebP</p>
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
                  Pro Tips
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 text-sm">
                      <strong>Catchy titles</strong> get 73% more clicks
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 text-sm">
                      Use <strong>3-5 relevant tags</strong> for better reach
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 text-sm">
                      Articles with <strong>images</strong> get 94% more views
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 text-sm">
                      <strong>Proofread</strong> before publishing
                    </span>
                  </li>
                </ul>
              </div>

                     </div>
          </div>
        </div>
      </div>
    </div>
  );
}