"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Camera,
  Upload,
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
  Sparkles
} from "lucide-react";

const EMPTY_PROFILE = {
  name: "",
  email: "",
  phone: "",
  location: "",
  about: "",
  avatar: "",
};

export default function MyProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [originalProfile, setOriginalProfile] = useState(EMPTY_PROFILE);
  const [editing, setEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        const cleanProfile = {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          about: data.about || "",
          avatar: data.avatar || "",
        };

        setProfile(cleanProfile);
        setOriginalProfile(cleanProfile);
        setPreview(cleanProfile.avatar || "/avatar.png");
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchProfile();
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewAvatar(file);
    setPreview(URL.createObjectURL(file));
    toast.success("New avatar selected!", {
      description: "Click Save to update your profile picture"
    });
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
      setNewAvatar(file);
      setPreview(URL.createObjectURL(file));
      toast.success("Image dropped successfully!");
    }
  };

  const uploadAvatar = async () => {
    if (!newAvatar) return profile.avatar;

    const formData = new FormData();
    formData.append("image", newAvatar);

    const res = await fetch("/api/users/upload-avatar", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Avatar upload failed");
    return data.url;
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const avatarUrl = await uploadAvatar();
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...profile, avatar: avatarUrl }),
      });

      if (!res.ok) throw new Error("Profile update failed");
      const updated = await res.json();
      setProfile(updated);
      setOriginalProfile(updated);
      setPreview(updated.avatar || "/avatar.png");
      setEditing(false);
      setNewAvatar(null);
      
      toast.success("Profile Updated!", {
        description: "Your profile has been successfully updated",
        icon: <CheckCircle2 className="text-green-500" />,
        duration: 5000
      });
      
      if (typeof window !== 'undefined') {
        const confetti = import('canvas-confetti');
        confetti.then((confetti) => {
          confetti.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        });
      }
    } catch (err) {
      toast.error(err.message, {
        icon: <X className="text-red-500" />
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setPreview(originalProfile.avatar || "/avatar.png");
    setNewAvatar(null);
    setEditing(false);
  };

  const profileStats = {
    posts: 12,
    views: 12560,
    likes: 1243,
    followers: 456,
    following: 234,
    joined: "2023-06-15"
  };

  const socialLinks = [
    { platform: "Twitter", icon: Twitter, color: "text-blue-400", link: "#" },
    { platform: "LinkedIn", icon: Linkedin, color: "text-blue-600", link: "#" },
    { platform: "GitHub", icon: Github, color: "text-gray-800", link: "#" },
    { platform: "Instagram", icon: Instagram, color: "text-pink-500", link: "#" }
  ];

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-full">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Loading Profile</h3>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">Manage your personal information and account settings</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <Bell className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <Settings className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {[
              { icon: BookOpen, label: 'Articles', value: profileStats.posts, color: 'from-blue-500 to-cyan-500' },
              { icon: Eye, label: 'Views', value: profileStats.views.toLocaleString(), color: 'from-purple-500 to-pink-500' },
              { icon: Heart, label: 'Likes', value: profileStats.likes.toLocaleString(), color: 'from-red-500 to-orange-500' },
              { icon: User, label: 'Followers', value: profileStats.followers, color: 'from-green-500 to-emerald-500' },
              { icon: User, label: 'Following', value: profileStats.following, color: 'from-indigo-500 to-blue-500' },
              { icon: Award, label: 'Level', value: 'Pro', color: 'from-amber-500 to-orange-500' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center hover:shadow-xl transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-12 h-12 mb-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full"></div>
                
                <div className="relative z-10">
                  {/* Avatar */}
                  <div 
                    className="relative w-32 h-32 mx-auto mb-6 group"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 ${isDragging ? 'scale-110 blur-md' : ''}`}></div>
                    <div className={`relative w-full h-full rounded-full border-4 border-white shadow-2xl transition-transform duration-500 ${editing ? 'group-hover:scale-105' : ''}`}>
                      {preview ? (
                        <Image
                          src={preview}
                          fill
                          alt="Avatar"
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <User className="w-16 h-16 text-white" />
                        </div>
                      )}
                      
                      {editing && (
                        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-white" />
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                    
                    {editing && (
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-full shadow-lg">
                        <Edit2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-black text-white mb-2">{profile.name || "Anonymous User"}</h2>
                  <p className="text-blue-100">@{(profile.name || "user").toLowerCase().replace(/\s+/g, '_')}</p>
                  
                  <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mt-4">
                    <Shield className="w-4 h-4 text-amber-300 mr-2" />
                    <span className="text-sm font-semibold text-white">Verified Member</span>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-blue-50 rounded-xl">
                    <Mail className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">{profile.email}</div>
                    </div>
                  </div>

                  {profile.phone && (
                    <div className="flex items-center p-3 bg-green-50 rounded-xl">
                      <Phone className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium text-gray-900">{profile.phone}</div>
                      </div>
                    </div>
                  )}

                  {profile.location && (
                    <div className="flex items-center p-3 bg-purple-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium text-gray-900">{profile.location}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center p-3 bg-amber-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-amber-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Member Since</div>
                      <div className="font-medium text-gray-900">
                        {new Date(profileStats.joined).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-3">Social Profiles</h4>
                    <div className="flex space-x-3">
                      {socialLinks.map((social) => (
                        <a
                          key={social.platform}
                          href={social.link}
                          className={`w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center ${social.color} hover:scale-110 hover:shadow-lg transition-all duration-300`}
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-6 border-t border-gray-100 space-y-3">
                    {editing ? (
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="w-full"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdate}
                          disabled={updating}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg"
                        >
                          {updating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          {updating ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setEditing(true)}
                        className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:shadow-lg"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/settings')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-6">
                {['overview', 'activity', 'settings', 'analytics'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === tab 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-100'}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* About Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <User className="w-6 h-6 mr-3 text-indigo-600" />
                    About Me
                  </h3>
                  
                  {editing ? (
                    <textarea
                      rows={6}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 resize-none"
                      placeholder="Tell us about yourself..."
                      value={profile.about}
                      onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                    />
                  ) : (
                    <div className="text-gray-700 leading-relaxed">
                      {profile.about || (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                            <Edit2 className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">No bio yet. Click Edit Profile to add one.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-amber-500" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {[
                      { action: 'Published article', title: 'React Hooks Complete Guide', time: '2 hours ago', color: 'bg-green-100 text-green-700' },
                      { action: 'Received', title: '124 Likes on your post', time: 'Yesterday', color: 'bg-pink-100 text-pink-700' },
                      { action: 'Commented on', title: 'Web Development Trends', time: '2 days ago', color: 'bg-blue-100 text-blue-700' },
                      { action: 'Followed', title: 'Sarah Johnson', time: '3 days ago', color: 'bg-purple-100 text-purple-700' }
                    ].map((activity, idx) => (
                      <div key={idx} className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 group">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activity.color} mr-4`}>
                          <Star className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{activity.action} <span className="font-bold">{activity.title}</span></div>
                          <div className="text-sm text-gray-500">{activity.time}</div>
                        </div>
                        <Sparkles className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ))}
                  </div>
                </div>

              
              </div>
            )}

            {/* Security Settings Preview */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Lock className="w-6 h-6 mr-3 text-indigo-600" />
                  Security Settings
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: 'Email', value: profile.email, action: 'Change' },
                    { icon: Lock, label: 'Password', value: '••••••••', action: 'Update' },
                    { icon: Globe, label: 'Privacy', value: 'Public Profile', action: 'Edit' },
                    { icon: Bell, label: 'Notifications', value: 'Enabled', action: 'Manage' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all duration-300">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mr-4">
                          <item.icon className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.label}</div>
                          <div className="text-sm text-gray-600">{item.value}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {item.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}