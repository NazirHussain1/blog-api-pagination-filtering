"use client";
import Comments from "@/app/components/Comments/Comments";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Eye, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  User, 
  Tag, 
  Loader2,
  Home,
  TrendingUp,
  ChevronRight,
  Heart,
  BookOpen,
  Sparkles,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";

export default function SinglePost() {
  const { slug } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
        
        // Simulate fetching related posts
        setTimeout(() => {
          setRelatedPosts([
            { id: 1, title: "Mastering React Hooks", slug: "mastering-react-hooks", category: "Technology" },
            { id: 2, title: "Design Systems 101", slug: "design-systems-101", category: "Design" },
            { id: 3, title: "The Future of AI", slug: "future-of-ai", category: "Technology" },
          ]);
        }, 1000);
      } catch (err) {
        setError("Post not found");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || '';
    const text = `Check out this article: ${title}`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
      return;
    }

    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };
  useEffect(() => {
  if (!post) return;

  const incrementViews = async () => {
    try {
      await fetch(`/api/posts/${slug}/view`, { method: 'POST', credentials: 'include' });
      setPost(prev => ({ ...prev, views: (prev.views || 0) + 1 }));
    } catch (err) {
      console.error(err);
    }
  };

  incrementViews();
}, [post]);

  const handleLike = async () => {
  try {
    const res = await fetch(`/api/posts/${slug}/like`, { method: 'POST', credentials: 'include' });
    if (!res.ok) throw new Error('Failed to like');
    const data = await res.json();
    setIsLiked(data.isLiked);
    setPost(prev => ({ ...prev, likes: data.likes }));
  } catch (err) {
    console.error(err);
  }
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
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Loading Article</h3>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-loading-bar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl mb-6">
              <Sparkles className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">
              The article you are looking for does not exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push("/")}
                className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/posts")}
                className="inline-flex items-center"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Articles
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Article Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="relative container mx-auto px-6 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-8">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                className="inline-flex items-center text-white/90 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${isBookmarked 
                    ? 'bg-white/20 text-amber-300' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  
                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50 animate-slide-down">
                      <button
                        onClick={() => handleShare('twitter')}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <Twitter className="w-5 h-5 text-blue-400 mr-3" />
                        <span className="text-gray-700 font-medium">Share on Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <Facebook className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-gray-700 font-medium">Share on Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <Linkedin className="w-5 h-5 text-blue-700 mr-3" />
                        <span className="text-gray-700 font-medium">Share on LinkedIn</span>
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <LinkIcon className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="text-gray-700 font-medium">Copy Link</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Article Meta */}
            <div className="mb-8">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="font-semibold text-sm">FEATURED ARTICLE</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur opacity-75"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author?.name?.charAt(0) || "A"}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{post.author?.name || "Unknown Author"}</div>
                    <div className="text-sm text-white/70">Expert Contributor</div>
                  </div>
                </div>
                
                <div className="h-4 w-px bg-white/30"></div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>8 min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-20 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35,6.36,117.35-5.65C939.06,29.08,1053,4,1200,0V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Featured Image */}
                {post.image && (
                  <div className="relative h-64 md:h-96 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                
                {/* Article Body */}
                <div className="p-8">
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line mb-8">
                      {post.body}
                    </div>

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <div className="pt-8 border-t border-gray-100">
                        <div className="flex items-center mb-4">
                          <Tag className="w-5 h-5 text-indigo-500 mr-2" />
                          <h3 className="font-bold text-gray-900">Tags</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {post.tags.map((tag) => (
                            <Link
                              key={tag}
                              href={`/tag/${tag}`}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-medium rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-300"
                            >
                              #{tag}
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Article Stats */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button
  onClick={handleLike}
  className={`flex items-center space-x-2 transition-all duration-300 ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
>
  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
  <span className="font-semibold">{post.likes || 0}</span>
</button>

                     <div className="flex items-center space-x-2 text-gray-500">
  <Eye className="w-5 h-5" />
  <span className="font-semibold">{post.views || 0} views</span>
</div>

                      
                      <div className="flex items-center space-x-2 text-gray-500">
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-semibold">comments</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Author Bio */}
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-8">
                <div className="flex items-center mb-6">
                  <div className="relative mr-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur opacity-75"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {post.author?.name?.charAt(0) || "A"}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{post.author?.name || "Unknown Author"}</h3>
                    <p className="text-gray-600">Senior Content Writer & Technology Expert</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Passionate about technology, design, and innovation. With over 10 years of experience in software development and technical writing, I love sharing insights that help others grow in their careers.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Related Articles */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-amber-500" />
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.id}
                        href={`/posts/${related.slug}`}
                        className="group block p-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                          <div>
                            <div className="text-xs font-semibold text-indigo-600 mb-1">{related.category}</div>
                            <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                              {related.title}
                            </h4>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
{/* Comments Section */}
<Comments slug={post.slug} user={post.author} />

                {/* Table of Contents */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                    Article Contents
                  </h3>
                  <nav className="space-y-3">
                    {['Introduction', 'Key Concepts', 'Implementation', 'Best Practices', 'Conclusion'].map((item, idx) => (
                      <a
                        key={idx}
                        href={`#${item.toLowerCase().replace(' ', '-')}`}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all duration-300"
                      >
                        <span className="text-gray-700 font-medium">{item}</span>
                        <ChevronRight className="w-4 h-4 text-purple-400" />
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

<style jsx global>{`
  @keyframes slide-down {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes loading-bar {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-slide-down {
    animation: slide-down 0.2s ease-out forwards;
  }
  .animate-loading-bar {
    animation: loading-bar 1.5s ease-in-out infinite;
  }
`}</style>