"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { toggleFollowUser } from "@/redux/features/auth/authSlice";
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
  Globe,
  Award,
  TrendingUp,
  Loader2,
  ArrowLeft,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Bookmark,
  Clock,
  Tag,
  ChevronRight,
  CheckCircle2,
  Crown,
  Star,
  FileText,
  ExternalLink,
  BarChart,
  Copy,
  Shield,
  Edit3,
} from "lucide-react";

export default function PublicProfilePage() {
  const { name } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (!name) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`/api/users/profile/${name}`),
          fetch(`/api/posts/user/${name}`)
        ]);

        if (!userRes.ok) {
          if (userRes.status === 404) {
            throw new Error("User not found");
          }
          throw new Error("Failed to fetch profile");
        }

        const userData = await userRes.json();
        const postsData = postsRes.ok ? await postsRes.json() : [];

        setUser(userData);
        setPosts(postsData);
        setFollowersCount(userData.followers?.length || 0);
        setFollowingCount(userData.following?.length || 0);
        setIsFollowing(loggedInUser?.following?.includes(userData._id) || false);

      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error(error.message || "Failed to load profile");
        if (error.message === "User not found") {
          setTimeout(() => router.push("/"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [name, loggedInUser, router]);

  const handleFollow = async () => {
    if (!loggedInUser) {
      toast.error("Please login to follow users");
      router.push("/login");
      return;
    }

    if (!user) return;

    try {
      await dispatch(toggleFollowUser({ targetUserId: user._id })).unwrap();
      setIsFollowing(!isFollowing);
      setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
      toast.success(isFollowing ? "Unfollowed successfully" : "Following!");
    } catch (error) {
      toast.error("Failed to follow user");
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Check out ${user?.name}'s profile on InsightHub`;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
      setShowShareMenu(false);
      return;
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  const stats = {
    posts: posts.length,
    views: posts.reduce((sum, post) => sum + (post.views || 0), 0),
    likes: posts.reduce((sum, post) => sum + (post.likes?.length || post.likes || 0), 0),
    comments: posts.reduce((sum, post) => sum + (post.comments?.length || post.commentsCount || 0), 0),
  };

  const getTopTags = () => {
    const tagMap = {};
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });
    return Object.entries(tagMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([tag, count]) => ({ tag, count }));
  };

  const getPopularPosts = () => {
    return [...posts]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">Loading Profile...</h3>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UserCheck className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Profile Not Found</h1>
          <p className="text-gray-600 mb-8">
            The profile you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = user._id === loggedInUser?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Cover */}
      <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 flex items-center text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-20 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-xl border-4 border-white bg-white shadow-xl overflow-hidden">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {user.role === "admin" && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                      {user.verified && (
                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                      )}
                      {user.role === "admin" && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-md">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">
                      @{user.username || user.name.toLowerCase().replace(/\s+/g, '')}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      </div>
                      {user.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{user.location}</span>
                        </div>
                      )}
                      {user.website && (
                        <a 
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {isOwnProfile ? (
                      <>
                        <Link
                          href="/profile"
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Edit3 className="w-4 h-4 inline mr-2" />
                          Edit Profile
                        </Link>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleFollow}
                          className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                            isFollowing
                              ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {isFollowing ? (
                            <>
                              <UserCheck className="w-4 h-4 inline mr-1" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 inline mr-1" />
                              Follow
                            </>
                          )}
                        </button>
                        <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                          <Mail className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          
                          {showShareMenu && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setShowShareMenu(false)}
                              />
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                <button
                                  onClick={() => handleShare('twitter')}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Twitter className="w-4 h-4 text-blue-400 mr-2" />
                                  Twitter
                                </button>
                                <button
                                  onClick={() => handleShare('linkedin')}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Linkedin className="w-4 h-4 text-blue-600 mr-2" />
                                  LinkedIn
                                </button>
                                <button
                                  onClick={() => handleShare('copy')}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Copy className="w-4 h-4 text-gray-500 mr-2" />
                                  Copy Link
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {user.about && (
                  <p className="text-gray-700 mb-4">{user.about}</p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-xl font-bold text-gray-900">{followersCount}</span>
                    <span className="text-gray-600 ml-1">Followers</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gray-900">{followingCount}</span>
                    <span className="text-gray-600 ml-1">Following</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gray-900">{stats.posts}</span>
                    <span className="text-gray-600 ml-1">Articles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 pb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <span className="text-xs text-gray-500">VIEWS</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.views.toLocaleString()}</div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span className="text-xs text-gray-500">LIKES</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.likes.toLocaleString()}</div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="text-xs text-gray-500">COMMENTS</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.comments.toLocaleString()}</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {[
                    { id: "posts", label: "Articles", count: posts.length },
                    { id: "popular", label: "Popular" },
                    { id: "about", label: "About" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Posts Tab */}
                {activeTab === "posts" && (
                  <div>
                    {posts.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Articles Yet</h3>
                        <p className="text-gray-600">
                          {isOwnProfile ? "Start writing your first article!" : `${user.name} hasn't published any articles yet.`}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {posts.map((post) => (
                          <Link
                            key={post._id}
                            href={`/posts/${post._id}`}
                            className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 mb-2">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {post.description || post.content?.substring(0, 150) + "..."}
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {post.views || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  {post.likes?.length || post.likes || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-4 h-4" />
                                  {post.comments?.length || post.commentsCount || 0}
                                </span>
                              </div>
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Popular Tab */}
                {activeTab === "popular" && (
                  <div className="space-y-4">
                    {getPopularPosts().length === 0 ? (
                      <p className="text-center py-8 text-gray-600">No popular posts yet</p>
                    ) : (
                      getPopularPosts().map((post) => (
                        <Link
                          key={post._id}
                          href={`/posts/${post._id}`}
                          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
                        >
                          <h4 className="font-semibold text-gray-900 hover:text-indigo-600 mb-2">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {post.likes?.length || post.likes || 0}
                            </span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}

                {/* About Tab */}
                {activeTab === "about" && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700">
                      {user.about || user.bio || "This user hasn't added a bio yet."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Links */}
            {(user.socialLinks?.twitter || user.socialLinks?.github || user.socialLinks?.linkedin) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Social Links</h3>
                <div className="space-y-2">
                  {user.socialLinks?.twitter && (
                    <a
                      href={user.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <Twitter className="w-5 h-5 text-blue-400 mr-3" />
                      <span className="flex-1 font-medium">Twitter</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </a>
                  )}
                  
                  {user.socialLinks?.github && (
                    <a
                      href={user.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <Github className="w-5 h-5 text-gray-800 mr-3" />
                      <span className="flex-1 font-medium">GitHub</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </a>
                  )}
                  
                  {user.socialLinks?.linkedin && (
                    <a
                      href={user.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <Linkedin className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="flex-1 font-medium">LinkedIn</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Top Tags */}
            {getTopTags().length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Top Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {getTopTags().map(({ tag, count }) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 rounded-lg text-sm font-medium transition-colors"
                    >
                      #{tag} ({count})
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Activity</h3>
                <BarChart className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-indigo-100">Total Articles</span>
                  <span className="font-bold">{stats.posts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-100">Total Views</span>
                  <span className="font-bold">{stats.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-100">Engagement</span>
                  <span className="font-bold">{stats.likes + stats.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}