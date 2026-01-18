"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { toggleFollowUser } from "@/redux/features/auth/authSlice";
import PostCard from "@/app/components/PostCard/PostCard";
import {
  Users,
  UserCheck,
  UserPlus,
  Mail,
  Calendar,
  MapPin,
  BookOpen,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Globe,
  Award,
  TrendingUp,
  Sparkles,
  Loader2,
  ArrowLeft,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  BarChart3,
  Bookmark,
  Clock,
  Tag,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

export default function ProfilePage() {
  const { name } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [activeTab, setActiveTab] = useState("posts");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!name) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`/api/users/profile/${name}`, { signal }),
          fetch(`/api/posts/user/${name}`, { signal }),
        ]);

        if (!userRes.ok) throw new Error("User not found");
        if (!postsRes.ok) throw new Error("Posts not found");

        const userData = await userRes.json();
        const postsData = await postsRes.json();

        setUser(userData);
        setPosts(postsData);
        setFollowersCount(userData.followers?.length || 0);
        setIsFollowing(loggedInUser?.following?.includes(userData._id) || false);

      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error(error.message, {
            icon: <CheckCircle2 className="text-red-500" />
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    return () => controller.abort();
  }, [name, loggedInUser]);

  const handleFollow = async () => {
    if (!user || !loggedInUser) {
      toast.error("Please login to follow users");
      return;
    }

    try {
      await dispatch(toggleFollowUser({ targetUserId: user._id })).unwrap();
      
      setIsFollowing(!isFollowing);
      setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
      
      toast.success(isFollowing ? "Unfollowed successfully" : "Following now!", {
        icon: <UserCheck className="text-green-500" />
      });
      
    } catch (error) {
      toast.error(error.message || "Failed to follow user");
    }
  };

  const userStats = {
    totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0),
    totalLikes: posts.reduce((sum, post) => sum + (post.likes || 0), 0),
    totalComments: posts.reduce((sum, post) => sum + (post.comments || 0), 0),
    engagementRate: posts.length > 0 ? ((posts.reduce((sum, post) => sum + (post.likes || 0), 0) / posts.length) * 100).toFixed(1) : 0,
    avgReadTime: "5 min"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-full">
                    <UserCheck className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Loading Profile</h3>
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl mb-6">
              <UserCheck className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">User Not Found</h1>
            <p className="text-gray-600 mb-8">
              The user profile you are looking for does not exist or has been removed.
            </p>
            <Button 
              onClick={() => router.push("/")}
              className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
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
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>

        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white mb-8">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full"></div>
          
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-start md:items-center gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur opacity-75"></div>
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl">
                      <Image
                        src={user.avatar || "/avatar.png"}
                        fill
                        alt={user.name}
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-3xl md:text-4xl font-black">{user.name}</h1>
                      {user.role === "admin" && (
                        <div className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          <Award className="w-3 h-3 mr-1" />
                          ADMIN
                        </div>
                      )}
                      <div className="inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        VERIFIED
                      </div>
                    </div>
                    
                    <p className="text-blue-200 mb-4">@{user.username || user.name.toLowerCase().replace(/\s+/g, '_')}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-300" />
                        <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}</span>
                      </div>
                      
                      {user.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-blue-300" />
                          <span>{user.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-blue-300" />
                        <span>English, espanol</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {user.about && (
                  <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl max-w-3xl">
                    <p className="text-blue-100 leading-relaxed">{user.about}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-3">
                {user._id === loggedInUser?._id ? (
                  <>
                    <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300">
                      Edit Profile
                    </button>
                    <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
                      Dashboard
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-3 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center ${
                        isFollowing
                          ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-white hover:from-gray-700 hover:to-gray-600'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-5 h-5 mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5 mr-2" />
                          Follow
                        </>
                      )}
                    </button>
                    <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
                      <Mail className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                <div className="relative">
                  <button
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 w-full"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {showMoreOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50 animate-slide-down">
                      <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Bookmark className="w-4 h-4 text-gray-600 mr-3" />
                        <span className="text-gray-700 font-medium">Bookmark</span>
                      </button>
                      <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Share2 className="w-4 h-4 text-gray-600 mr-3" />
                        <span className="text-gray-700 font-medium">Share Profile</span>
                      </button>
                      <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <BarChart3 className="w-4 h-4 text-gray-600 mr-3" />
                        <span className="text-gray-700 font-medium">Analytics</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-black text-gray-900">{followersCount.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-black text-gray-900">{user.following?.length || 0}</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-black text-gray-900">{posts.length}</div>
            <div className="text-sm text-gray-600">Articles</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-black text-gray-900">{userStats.totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-black text-gray-900">{userStats.totalLikes.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { id: "posts", label: "Articles", icon: BookOpen, count: posts.length },
                  { id: "about", label: "About", icon: UserCheck },
                  { id: "activity", label: "Activity", icon: TrendingUp },
                  { id: "analytics", label: "Analytics", icon: BarChart3 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-2" />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className="ml-2 px-2 py-1 bg-white/20 text-xs rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "posts" && (
              <div>
                {posts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-100">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Articles Yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8">
                      {user.name} has not published any articles yet. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {posts.map((post, index) => (
                      <div 
                        key={post._id} 
                        className="transform transition-all duration-500 hover:-translate-y-2"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <PostCard 
                          post={{
                            ...post,
                            author: post.author || { name: user.name, avatar: user.avatar }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="space-y-6">
                  {user.email && (
                    <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                      <Mail className="w-6 h-6 text-blue-600 mr-4" />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium text-gray-900">{user.email}</div>
                      </div>
                    </div>
                  )}
                  
                  {user.location && (
                    <div className="flex items-center p-4 bg-green-50 rounded-xl">
                      <MapPin className="w-6 h-6 text-green-600 mr-4" />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium text-gray-900">{user.location}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Award className="w-5 h-5 text-purple-600 mr-2" />
                      Expertise & Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Web Development', 'React', 'Node.js', 'UI/UX Design', 'Content Writing'].map((skill, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Clock className="w-5 h-5 text-amber-600 mr-2" />
                      Writing Stats
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Articles Published</span>
                        <span className="font-bold text-gray-900">{posts.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Average Read Time</span>
                        <span className="font-bold text-gray-900">{userStats.avgReadTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Engagement Rate</span>
                        <span className="font-bold text-gray-900">{userStats.engagementRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Social Links */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-indigo-500" />
                  Connect
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { platform: "Twitter", icon: Twitter, color: "bg-blue-400 text-white", link: "#" },
                    { platform: "LinkedIn", icon: Linkedin, color: "bg-blue-600 text-white", link: "#" },
                    { platform: "GitHub", icon: Github, color: "bg-gray-800 text-white", link: "#" },
                    { platform: "Instagram", icon: Instagram, color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white", link: "#" }
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.link}
                      className={`${social.color} p-4 rounded-xl flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300`}
                    >
                      <social.icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">{social.platform}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Top Tags */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-indigo-500" />
                  Top Tags
                </h3>
                <div className="space-y-3">
                  {['Technology', 'React', 'Web Development', 'Design', 'Tutorials'].map((tag, idx) => (
                    <Link
                      key={idx}
                      href={`/tag/${tag.toLowerCase()}`}
                      className="flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                        <span className="font-medium text-gray-900">#{tag}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">12</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {[
                    { action: 'Published', title: 'React Hooks Guide', time: '2 hours ago', icon: BookOpen, color: 'text-green-500' },
                    { action: 'Liked', title: '5 articles', time: 'Yesterday', icon: Heart, color: 'text-red-500' },
                    { action: 'Commented on', title: 'Web Trends', time: '2 days ago', icon: MessageCircle, color: 'text-blue-500' },
                    { action: 'Followed', title: '3 new users', time: '3 days ago', icon: UserPlus, color: 'text-purple-500' }
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-all duration-300">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 ${activity.color} mr-4`}>
                        <activity.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {activity.action} <span className="font-bold">{activity.title}</span>
                        </div>
                        <div className="text-sm text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-down {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// Button component for consistency
const Button = ({ children, className, onClick, ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg transition-all duration-300 ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);