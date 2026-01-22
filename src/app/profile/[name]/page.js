"use client";

import { useEffect, useState, useRef } from "react";
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
  CheckCircle2,
  PenTool,
  Zap,
  Target,
  DollarSign,
  ThumbsUp,
  MessageSquare,
  Share,
  Link as LinkIcon,
  Copy,
  Flag,
  Bell,
  Settings,
  Edit3,
  Shield,
  BookMarked,
  ExternalLink,
  BarChart,
  PieChart,
  TrendingUp as TrendingUpIcon,
  UsersRound,
  Eye as EyeIcon,
  Clock as ClockIcon,
  Medal,
  Crown,
  Star,
  FileText,
  Video,
  Mic,
  Image as ImageIcon,
  Code,
  Palette,
  Terminal,
  Server,
  Database,
  Smartphone,
  Cloud,
  Lock
} from "lucide-react";

export default function ProfilePage() {
  const { name } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.user);
  const shareRef = useRef(null);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [activeTab, setActiveTab] = useState("posts");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [stats, setStats] = useState({
    posts: 0,
    views: 0,
    likes: 0,
    comments: 0,
    followers: 0,
    following: 0,
    readTime: "5 min",
    engagement: 72,
    earnings: 1245
  });

  useEffect(() => {
    if (!name) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`/api/users/profile/${name}`),
          fetch(`/api/posts/user/${name}`)
        ]);

        if (!userRes.ok || !postsRes.ok) throw new Error("Failed to fetch");

        const userData = await userRes.json();
        const postsData = await postsRes.json();

        setUser(userData);
        setPosts(postsData);
        setFollowersCount(userData.followers?.length || 0);
        setIsFollowing(loggedInUser?.following?.includes(userData._id) || false);

        // Calculate stats
        const totalViews = postsData.reduce((sum, post) => sum + (post.views || 0), 0);
        const totalLikes = postsData.reduce((sum, post) => sum + (post.likes || 0), 0);
        const totalComments = postsData.reduce((sum, post) => sum + (post.comments || 0), 0);
        const engagementRate = postsData.length > 0 
          ? Math.min(100, (totalLikes / postsData.length) * 10)
          : 0;

        setStats({
          posts: postsData.length,
          views: totalViews,
          likes: totalLikes,
          comments: totalComments,
          followers: userData.followers?.length || 0,
          following: userData.following?.length || 0,
          readTime: "6 min",
          engagement: Math.round(engagementRate),
          earnings: Math.round(totalViews * 0.5 + totalLikes * 0.1)
        });

      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
      toast.success(isFollowing ? "Unfollowed" : "Following!");
    } catch (error) {
      toast.error("Failed to follow user");
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = `Check out ${user?.name}'s profile`;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
      return;
    }

    window.open(shareUrls[platform], '_blank');
  };

  const getTopTags = () => {
    const tagMap = {};
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });
    return Object.entries(tagMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);
  };

  const getPopularPosts = () => {
    return [...posts]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center">
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded-lg w-48 mb-4 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UserCheck className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Profile Not Found</h1>
          <p className="text-gray-600 mb-8">
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Background */}
      <div className="h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
        
        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative">
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-4 md:left-6 flex items-center text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-end w-full">
            <div className="relative -mb-8 mr-6">
              <div className="w-32 h-32 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden">
                <Image
                  src={user.avatar || "/avatar.png"}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              {user.role === "admin" && (
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-white pb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Verified
                  </div>
                  {user.role === "premium" && (
                    <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-sm font-bold flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      PRO
                    </div>
                  )}
                </div>
              </div>
              <p className="text-blue-100 mb-4">@{user.username || user.name.toLowerCase().replace(/\s+/g, '')}</p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-200" />
                  <span className="text-sm">Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-200" />
                    <span className="text-sm">{user.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-200" />
                  <span className="text-sm">English, Español</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Posts</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.posts}</div>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-500">Views</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.views.toLocaleString()}</div>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-pink-50 rounded-lg">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                  <span className="text-sm text-gray-500">Likes</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.likes.toLocaleString()}</div>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-500">Followers</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{followersCount.toLocaleString()}</div>
              </div>
            </div>

            {/* Bio & Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {user.about || "No bio yet. This user prefers to keep an air of mystery."}
                  </p>
                  
                  {user.expertise && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">EXPERTISE</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.expertise.split(',').slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  {user._id === loggedInUser?._id ? (
                    <>
                      <button className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        <Edit3 className="w-4 h-4 inline mr-2" />
                        Edit Profile
                      </button>
                      <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-md transition-all">
                        Dashboard
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleFollow}
                        className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                          isFollowing
                            ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-md'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-4 h-4 inline mr-2" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 inline mr-2" />
                            Follow
                          </>
                        )}
                      </button>
                      <button className="p-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Mail className="w-5 h-5" />
                      </button>
                      <div className="relative" ref={shareRef}>
                        <button
                          onClick={() => setShowShareMenu(!showShareMenu)}
                          className="p-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        
                        {showShareMenu && (
                          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                            <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                              Share Profile
                            </div>
                            <button
                              onClick={() => handleShare('twitter')}
                              className="flex items-center w-full px-4 py-3 hover:bg-gray-50"
                            >
                              <Twitter className="w-4 h-4 text-blue-400 mr-3" />
                              <span>Share on Twitter</span>
                            </button>
                            <button
                              onClick={() => handleShare('linkedin')}
                              className="flex items-center w-full px-4 py-3 hover:bg-gray-50"
                            >
                              <Linkedin className="w-4 h-4 text-blue-600 mr-3" />
                              <span>Share on LinkedIn</span>
                            </button>
                            <button
                              onClick={() => handleShare('copy')}
                              className="flex items-center w-full px-4 py-3 hover:bg-gray-50"
                            >
                              <Copy className="w-4 h-4 text-gray-500 mr-3" />
                              <span>Copy Link</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {[
                  { id: "posts", label: "Articles", count: posts.length },
                  { id: "popular", label: "Popular", count: 3 },
                  { id: "series", label: "Series" },
                  { id: "bookmarks", label: "Bookmarks" },
                  { id: "analytics", label: "Analytics" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === "posts" && (
                <div>
                  {posts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Articles Yet</h3>
                      <p className="text-gray-600 mb-6">
                        {user.name} hasn't published any articles yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {posts.map((post) => (
                        <div key={post._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                    {post.category || "Technology"}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                  <Link href={`/post/${post.slug}`} className="hover:text-blue-600">
                                    {post.title}
                                  </Link>
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                  {post.excerpt || post.content?.substring(0, 150)}...
                                </p>
                              </div>
                              {post.image && (
                                <div className="ml-6 w-32 h-24 rounded-lg overflow-hidden relative flex-shrink-0">
                                  <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{post.views?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  <span>{post.likes?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{post.comments?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{post.readTime || "5 min"}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                  <Bookmark className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                                  <Share2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                      <TrendingUpIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Engagement Metrics
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Engagement Rate</span>
                          <span className="font-medium">{stats.engagement}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            style={{ width: `${stats.engagement}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Avg. Read Time</span>
                          <span className="font-medium">{stats.readTime}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="w-4/5 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                      <BarChart className="w-5 h-5 mr-2 text-purple-600" />
                      Audience Growth
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <UsersRound className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <div className="font-medium">New Followers</div>
                            <div className="text-sm text-gray-500">This month</div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-green-600">+124</div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <EyeIcon className="w-5 h-5 text-purple-600 mr-3" />
                          <div>
                            <div className="font-medium">Profile Views</div>
                            <div className="text-sm text-gray-500">Last 30 days</div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-purple-600">2.4k</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Connect</h3>
              <div className="space-y-3">
                {user.socialLinks?.twitter && (
                  <a
                    href={user.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-100">
                      <Twitter className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Twitter</div>
                      <div className="text-sm text-gray-500">@{user.socialLinks.twitter.split('/').pop()}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                  </a>
                )}
                
                {user.socialLinks?.github && (
                  <a
                    href={user.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-100">
                      <Github className="w-5 h-5 text-gray-800" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">GitHub</div>
                      <div className="text-sm text-gray-500">{user.socialLinks.github.split('/').pop()}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </a>
                )}
                
                {user.socialLinks?.linkedin && (
                  <a
                    href={user.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-100">
                      <Linkedin className="w-5 h-5 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">LinkedIn</div>
                      <div className="text-sm text-gray-500">Professional profile</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-700" />
                  </a>
                )}
              </div>
            </div>

            {/* Top Tags */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Top Tags</h3>
              <div className="space-y-2">
                {getTopTags().map((tag, index) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag.toLowerCase()}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center mr-3">
                        <Tag className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">#{tag}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Popular Articles</h3>
              <div className="space-y-4">
                {getPopularPosts().map((post) => (
                  <Link
                    key={post._id}
                    href={`/post/${post.slug}`}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      {post.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views?.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {post.likes?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Writing Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg mb-1">Writing Stats</h3>
                  <p className="text-blue-100 text-sm">Monthly performance</p>
                </div>
                <Medal className="w-8 h-8 text-amber-300" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Articles Published</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Avg. Reading Time</span>
                    <span className="font-bold">6 min</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-300 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Reader Engagement</span>
                    <span className="font-bold">{stats.engagement}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-300 rounded-full" style={{ width: `${stats.engagement}%` }}></div>
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