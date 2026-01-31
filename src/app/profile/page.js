"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { fetchCurrentUser } from "@/redux/features/auth/authSlice";
import { fetchUserPosts } from "@/redux/features/posts/postSlice";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Camera,
  Shield,
  Award,
  Calendar,
  BookOpen,
  Eye,
  Heart,
  Settings,
  Bell,
  Lock,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Star,
  TrendingUp,
  CheckCircle2,
  Loader2,
  Sparkles,
  Plus,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ChevronRight,
  Trash2,
  Edit3,
  ExternalLink,
  Facebook,
  AlertCircle,
} from "lucide-react";

export default function MyProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { userPosts: posts, loading: postsLoading } = useSelector((state) => state.posts);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    about: "",
    website: "",
    avatar: "",
    coverImage: "",
    socialLinks: {
      twitter: "",
      linkedin: "",
      github: "",
      instagram: "",
      facebook: "",
      website: "",
      whatsapp: ""
    }
  });
  
  const [originalProfile, setOriginalProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to view your profile");
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Fetch user data
  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  // Fetch user posts
  useEffect(() => {
    if (user) {
      dispatch(fetchUserPosts());
    }
  }, [dispatch, user]);

  // Initialize profile data
  useEffect(() => {
    if (user) {
      console.log("User data received:", { 
        name: user.name, 
        avatar: user.avatar,
        coverImage: user.coverImage,
        hasAvatar: !!user.avatar 
      });
      
      const userData = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        about: user.about || user.bio || "",
        website: user.website || "",
        avatar: user.avatar || "",
        coverImage: user.coverImage || "",
        socialLinks: {
          twitter: user.socialLinks?.twitter || "",
          linkedin: user.socialLinks?.linkedin || "",
          github: user.socialLinks?.github || "",
          instagram: user.socialLinks?.instagram || "",
          facebook: user.socialLinks?.facebook || "",
          website: user.socialLinks?.website || "",
          whatsapp: user.socialLinks?.whatsapp || ""
        }
      };
      setProfile(userData);
      setOriginalProfile(userData);
      setPreview(user.avatar || null);
      setCoverPreview(user.coverImage || null);
      
      console.log("Preview set to:", user.avatar || null);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    setNewAvatar(file);
    setPreview(URL.createObjectURL(file));
    toast.success("New avatar selected! Click Save to update.");
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
      if (!file.type.startsWith('image/')) {
        toast.error("Please drop an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setNewAvatar(file);
      setPreview(URL.createObjectURL(file));
      toast.success("Image dropped successfully!");
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max for cover)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Cover image size should be less than 10MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    setNewCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
    toast.success("New cover image selected! Click Save to update.");
  };

  const uploadAvatar = async () => {
    if (!newAvatar) return profile.avatar;

    const formData = new FormData();
    formData.append("avatar", newAvatar);

    try {
      const res = await fetch("/api/users/upload-avatar", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Avatar upload failed");
      }

      const data = await res.json();
      return data.url || data.avatar;
    } catch (error) {
      console.error("Avatar upload error:", error);
      throw error;
    }
  };

  const uploadCoverImage = async () => {
    if (!newCoverImage) return profile.coverImage;

    const formData = new FormData();
    formData.append("cover", newCoverImage);

    try {
      const res = await fetch("/api/users/upload-cover", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Cover image upload failed");
      }

      const data = await res.json();
      return data.url || data.cover;
    } catch (error) {
      console.error("Cover image upload error:", error);
      throw error;
    }
  };

  const validateProfile = () => {
    if (!profile.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!profile.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      toast.error("Valid email is required");
      return false;
    }

    if (profile.website && !/^https?:\/\/.+/.test(profile.website)) {
      toast.error("Website must be a valid URL");
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validateProfile()) return;

    setUpdating(true);
    try {
      const avatarUrl = newAvatar ? await uploadAvatar() : profile.avatar;
      const coverImageUrl = newCoverImage ? await uploadCoverImage() : profile.coverImage;
      
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          ...profile, 
          avatar: avatarUrl,
          coverImage: coverImageUrl,
          socialLinks: profile.socialLinks
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Profile update failed");
      }

      const updated = await res.json();
      setProfile(updated);
      setOriginalProfile(updated);
      setPreview(updated.avatar || null);
      setCoverPreview(updated.coverImage || null);
      setEditing(false);
      setNewAvatar(null);
      setNewCoverImage(null);
      
      // Refresh user data
      dispatch(fetchCurrentUser());
      
      toast.success("Profile Updated!", {
        description: "Your profile has been successfully updated",
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      });
    } catch (err) {
      toast.error(err.message || "Failed to update profile", {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setPreview(originalProfile.avatar || null);
    setNewAvatar(null);
    setEditing(false);
  };

  const profileStats = {
    posts: posts?.length || 0,
    views: posts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0,
    likes: posts?.reduce((sum, post) => sum + (post.likes?.length || post.likes || 0), 0) || 0,
    comments: posts?.reduce((sum, post) => sum + (post.comments?.length || post.commentsCount || 0), 0) || 0,
    followers: user?.followers?.length || 0,
    following: user?.following?.length || 0,
    joined: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) : "N/A"
  };

  const socialLinks = [
    { platform: "Twitter", icon: Twitter, color: "text-blue-400 hover:bg-blue-50", link: user?.socialLinks?.twitter },
    { platform: "LinkedIn", icon: Linkedin, color: "text-blue-600 hover:bg-blue-50", link: user?.socialLinks?.linkedin },
    { platform: "GitHub", icon: Github, color: "text-gray-800 hover:bg-gray-100", link: user?.socialLinks?.github },
    { platform: "Instagram", icon: Instagram, color: "text-pink-500 hover:bg-pink-50", link: user?.socialLinks?.instagram },
  ].filter(link => link.link);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">Loading Profile...</h3>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "posts", label: "Articles", icon: BookOpen, badge: profileStats.posts },
    { id: "activity", label: "Activity", icon: TrendingUp },
    { id: "stats", label: "Analytics", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster richColors position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal information and content</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/settings"
                className="p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-700" />
              </Link>
              <button className="p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            {[
              { icon: BookOpen, label: 'Articles', value: profileStats.posts, color: 'bg-blue-500' },
              { icon: Eye, label: 'Views', value: profileStats.views.toLocaleString(), color: 'bg-purple-500' },
              { icon: Heart, label: 'Likes', value: profileStats.likes.toLocaleString(), color: 'bg-red-500' },
              { icon: MessageCircle, label: 'Comments', value: profileStats.comments, color: 'bg-green-500' },
              { icon: User, label: 'Followers', value: profileStats.followers, color: 'bg-indigo-500' },
              { icon: Star, label: 'Following', value: profileStats.following, color: 'bg-amber-500' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className={`inline-flex items-center justify-center w-10 h-10 ${stat.color} rounded-lg mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-8">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center relative">
                {/* Avatar */}
                <div 
                  className="relative w-24 h-24 mx-auto mb-4 group"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="relative w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden">
                    {preview ? (
                      <Image
                        src={preview}
                        fill
                        alt="Avatar"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                    )}
                    
                    {editing && (
                      <>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>
                  
                  {editing && (
                    <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg">
                      <Camera className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white mb-1">{profile.name || "Anonymous User"}</h2>
                <p className="text-indigo-100 text-sm">@{(profile.name || "user").toLowerCase().replace(/\s+/g, '_')}</p>
                
                {user?.role === "admin" && (
                  <div className="inline-flex items-center bg-amber-400/20 backdrop-blur-sm px-3 py-1 rounded-full mt-3">
                    <Shield className="w-3 h-3 text-amber-300 mr-1.5" />
                    <span className="text-xs font-semibold text-white">Admin</span>
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-4">
                {editing ? (
                  <>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Full Name</label>
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Phone</label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Location</label>
                      <Input
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Website</label>
                      <Input
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">Email</div>
                        <div className="text-sm font-medium text-gray-900 truncate">{profile.email}</div>
                      </div>
                    </div>

                    {profile.phone && (
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-4 h-4 text-gray-600 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500">Phone</div>
                          <div className="text-sm font-medium text-gray-900">{profile.phone}</div>
                        </div>
                      </div>
                    )}

                    {profile.location && (
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500">Location</div>
                          <div className="text-sm font-medium text-gray-900">{profile.location}</div>
                        </div>
                      </div>
                    )}

                    {profile.website && (
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Globe className="w-4 h-4 text-gray-600 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500">Website</div>
                          <a 
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 truncate block"
                          >
                            {profile.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">Joined</div>
                        <div className="text-sm font-medium text-gray-900">{profileStats.joined}</div>
                      </div>
                    </div>
                  </>
                )}

                {/* Social Links */}
                {!editing && socialLinks.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Social</h4>
                    <div className="flex flex-wrap gap-2">
                      {socialLinks.map((social) => (
                        <a
                          key={social.platform}
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center ${social.color} transition-all`}
                        >
                          <social.icon className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  {editing ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpdate}
                        disabled={updating}
                        size="sm"
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        {updating ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-1" />
                        )}
                        Save
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        onClick={() => setEditing(true)}
                        size="sm"
                        className="w-full bg-gray-900 hover:bg-gray-800"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => router.push('/settings')}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* About Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                  {editing ? (
                    <textarea
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Tell us about yourself..."
                      value={profile.about}
                      onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                    />
                  ) : (
                    <div className="text-gray-700">
                      {profile.about || (
                        <div className="text-center py-8 text-gray-500">
                          <Edit3 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p>No bio yet. Click Edit Profile to add one.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/posts/create"
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200">
                        <Plus className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">New Article</div>
                        <div className="text-xs text-gray-500">Write & publish</div>
                      </div>
                    </Link>

                    <Link
                      href="/my-posts"
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">My Articles</div>
                        <div className="text-xs text-gray-500">{profileStats.posts} published</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-6">
                {postsLoading ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading articles...</p>
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all">
                        <Link href={`/posts/${post._id}`} className="block">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 mb-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {post.description || post.content?.substring(0, 150) + "..."}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {post.views || 0}
                              </span>
                              <span className="flex items-center">
                                <Heart className="w-4 h-4 mr-1" />
                                {post.likes?.length || post.likes || 0}
                              </span>
                              <span className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {post.comments?.length || post.commentsCount || 0}
                              </span>
                            </div>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No articles yet</h4>
                    <p className="text-gray-600 mb-6">Start sharing your knowledge with the community.</p>
                    <Button
                      onClick={() => router.push('/posts/create')}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Article
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <p className="text-gray-600 text-center py-8">Activity feed coming soon...</p>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
                <p className="text-gray-600 text-center py-8">Detailed analytics coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}