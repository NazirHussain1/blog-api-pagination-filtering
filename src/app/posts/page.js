"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { fetchPosts } from "@/redux/features/posts/postSlice";
import PostCard from "@/app/components/PostCard/PostCard";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  TrendingUp, 
  Clock,
  ChevronDown,
  X,
  Loader2,
  Tag,
  Users,
  Eye,
  BookOpen,
  Star,
  ArrowRight,
  Zap
} from "lucide-react";

export default function AllPostsPage() {
  const dispatch = useDispatch();
  const { list: posts, loading, error } = useSelector((state) => state.posts);
  const searchParams = useSearchParams();
  
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  useEffect(() => {
    // Read category from URL parameters
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(fetchPosts({ page: currentPage, limit: postsPerPage, sort: sortBy }));
  }, [dispatch, currentPage, sortBy]);

  const categories = [
    'All', 
    'Technology', 
    'Web Development', 
    'Mobile Development',
    'AI & Machine Learning',
    'Design', 
    'Business', 
    'Startup',
    'Career',
    'Productivity',
    'Tutorials',
    'Open Source',
    'DevOps',
    'Data Science'
  ];
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.body?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (Array.isArray(post.tags) && post.tags.some(tag => 
                             tag.toLowerCase() === selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalPosts: posts.length,
    totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0),
    totalAuthors: new Set(posts.map(p => p.author?.name)).size,
    avgReadTime: Math.ceil(posts.reduce((sum, post) => sum + (post.readTime || 5), 0) / posts.length) || 5
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-2xl mb-8 animate-float">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Discover 
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 bg-clip-text text-transparent"> Amazing</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Content</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore our curated collection of insights, tutorials, and stories from the world's most innovative creators and thought leaders.
            </p>
            
            {/* Quick stats in hero */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span className="font-semibold">{stats.totalPosts}+ Articles</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">{stats.totalAuthors}+ Authors</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Eye className="w-5 h-5 text-green-400" />
                <span className="font-semibold">{stats.totalViews.toLocaleString()} Views</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-1">
                <Zap className="w-5 h-5 mr-2" />
                Start Reading
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300">
                <Star className="w-5 h-5 mr-2" />
                Featured Posts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Bar */}
      <div className="relative -mt-12 z-10">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 backdrop-blur-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { 
                  icon: BookOpen, 
                  label: 'Published Articles', 
                  value: stats.totalPosts, 
                  color: 'from-blue-500 to-cyan-500',
                  description: 'Quality content'
                },
                { 
                  icon: Eye, 
                  label: 'Total Reads', 
                  value: stats.totalViews.toLocaleString(), 
                  color: 'from-purple-500 to-pink-500',
                  description: 'Community engagement'
                },
                { 
                  icon: Users, 
                  label: 'Expert Authors', 
                  value: stats.totalAuthors, 
                  color: 'from-green-500 to-emerald-500',
                  description: 'Diverse perspectives'
                },
                { 
                  icon: Clock, 
                  label: 'Avg. Read Time', 
                  value: `${stats.avgReadTime} min`, 
                  color: 'from-amber-500 to-orange-500',
                  description: 'Quick insights'
                }
              ].map((stat, idx) => (
                <div key={idx} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className={`inline-flex items-center justify-center w-20 h-20 mb-4 bg-gradient-to-r ${stat.color} rounded-3xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-800 font-semibold mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      
      <div className="container mx-auto px-6 py-12">
    
        {/* Enhanced Search and Controls */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            {/* Enhanced Search */}
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles, topics, authors, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-12 py-4 text-lg bg-white border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 shadow-sm hover:shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Enhanced Controls */}
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-2xl p-1.5 shadow-inner">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-md text-indigo-600 scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Grid View"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-md text-indigo-600 scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Enhanced Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-3 bg-white border-2 border-gray-200 hover:border-indigo-500 hover:shadow-lg px-6 py-4 rounded-2xl transition-all duration-300 group"
                >
                  <Filter className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
                  <span className="font-semibold text-gray-700 group-hover:text-indigo-600">Filters</span>
                  <div className="flex items-center space-x-1">
                    {(searchQuery || selectedCategory !== 'all') && (
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    )}
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50 animate-slide-down">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900">Filters</h3>
                      <button onClick={() => setShowFilters(false)}>
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Categories */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-indigo-500" />
                        Categories
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat.toLowerCase())}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === cat.toLowerCase() 
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-indigo-500" />
                        Sort By
                      </h4>
                      <div className="space-y-2">
                        {[
                          { value: 'newest', label: 'Newest First', icon: Clock },
                          { value: 'popular', label: 'Most Popular', icon: TrendingUp },
                          { value: 'trending', label: 'Trending', icon: TrendingUp }
                        ].map(option => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setShowFilters(false);
                            }}
                            className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 ${sortBy === option.value 
                              ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-100' 
                              : 'hover:bg-gray-50 text-gray-700'}`}
                          >
                            <option.icon className="w-4 h-4 mr-3" />
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSortBy('newest');
                        setSearchQuery('');
                        setShowFilters(false);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

                    {(searchQuery || selectedCategory !== 'all') && (
            <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
              <span className="text-gray-700 font-medium">Active filters:</span>
              {searchQuery && (
                <div className="inline-flex items-center bg-white px-3 py-1.5 rounded-full border border-gray-200">
                  <span className="mr-2 text-gray-600">Search: &quot;{searchQuery}&quot;</span>
                  <button onClick={() => setSearchQuery('')} className="text-gray-500 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {selectedCategory !== 'all' && (
                <div className="inline-flex items-center bg-white px-3 py-1.5 rounded-full border border-gray-200">
                  <span className="mr-2 text-gray-600">Category: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('all')} className="text-gray-500 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

              {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading articles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl mb-6">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Articles</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">{error}</p>
            <button
              onClick={() => dispatch(fetchPosts({ page: 1, limit: 20 }))}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl mb-6">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Articles Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {searchQuery || selectedCategory !== 'all' 
                ? `No articles match your search criteria. Try different filters.`
                : 'No articles have been published yet.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              View All Articles
            </button>
          </div>
        ) : (
          <>
            <div className={`${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3' : 'space-y-6'} gap-6 mb-12`}>
              {filteredPosts.map((post, index) => (
                <div 
                  key={post._id} 
                  className={`transform transition-all duration-500 hover:-translate-y-2 ${viewMode === 'list' ? 'flex' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Previous
              </button>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg transition-all duration-300 ${currentPage === page 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-500 transition-all duration-300"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

<style jsx global>{`
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes slide-down {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .animate-slide-down {
    animation: slide-down 0.2s ease-out forwards;
  }
`}</style>