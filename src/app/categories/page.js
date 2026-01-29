"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  BookOpen,
  Code,
  Palette,
  Briefcase,
  Heart,
  Gamepad2,
  Camera,
  Music,
  Plane,
  Utensils,
  Dumbbell,
  GraduationCap,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Tag,
  ArrowRight,
  Filter,
  Grid3X3,
  List,
  Star,
  Zap,
} from "lucide-react";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoaded, setIsLoaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchCategoriesData();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const fetchCategoriesData = async () => {
    try {
      setLoading(true);
      
      // Fetch all posts to analyze categories
      const postsResponse = await fetch('/api/posts', {
        credentials: 'include'
      });
      
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(postsData);
        
        // Process posts to create category data
        const categoryMap = new Map();
        
        postsData.forEach(post => {
          // Extract category from post (assuming posts have a category field)
          const category = post.category || 'General';
          const tags = post.tags || [];
          
          if (!categoryMap.has(category)) {
            categoryMap.set(category, {
              id: category.toLowerCase().replace(/\s+/g, '-'),
              name: category,
              description: getCategoryDescription(category),
              icon: getCategoryIcon(category),
              color: getCategoryColor(category),
              articles: 0,
              followers: 0,
              trending: false,
              posts: []
            });
          }
          
          const categoryData = categoryMap.get(category);
          categoryData.articles += 1;
          categoryData.followers += (post.likes?.length || 0) + (post.views || 0) / 10; // Simulate followers based on engagement
          categoryData.posts.push(post);
          
          // Mark as trending if it has high engagement
          if (categoryData.articles > 5 && categoryData.followers > 100) {
            categoryData.trending = true;
          }
        });
        
        // Convert map to array and add default categories if none exist
        let categoriesArray = Array.from(categoryMap.values());
        
        if (categoriesArray.length === 0) {
          categoriesArray = getDefaultCategories();
        }
        
        // Sort by article count
        categoriesArray.sort((a, b) => b.articles - a.articles);
        
        setCategories(categoriesArray);
      } else {
        // Fallback to default categories if API fails
        setCategories(getDefaultCategories());
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(getDefaultCategories());
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      'Technology': 'Programming, AI, web development, and tech trends',
      'Design': 'UI/UX, graphic design, and creative inspiration',
      'Business': 'Entrepreneurship, marketing, and business strategy',
      'Lifestyle': 'Health, wellness, and personal development',
      'Gaming': 'Game reviews, industry news, and gaming culture',
      'Photography': 'Photography tips, techniques, and visual storytelling',
      'Music': 'Music reviews, industry insights, and artist features',
      'Travel': 'Travel guides, experiences, and destination reviews',
      'Food': 'Recipes, restaurant reviews, and culinary adventures',
      'Fitness': 'Workout routines, nutrition, and fitness motivation',
      'Education': 'Learning resources, tutorials, and educational content',
      'Science': 'Scientific discoveries, research, and innovations',
      'General': 'Diverse topics and general discussions'
    };
    return descriptions[category] || 'Explore articles and discussions on various topics';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Technology': Code,
      'Design': Palette,
      'Business': Briefcase,
      'Lifestyle': Heart,
      'Gaming': Gamepad2,
      'Photography': Camera,
      'Music': Music,
      'Travel': Plane,
      'Food': Utensils,
      'Fitness': Dumbbell,
      'Education': GraduationCap,
      'Science': Zap,
      'General': BookOpen
    };
    return icons[category] || BookOpen;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'from-blue-500 to-cyan-500',
      'Design': 'from-purple-500 to-pink-500',
      'Business': 'from-green-500 to-emerald-500',
      'Lifestyle': 'from-red-500 to-rose-500',
      'Gaming': 'from-indigo-500 to-purple-500',
      'Photography': 'from-yellow-500 to-orange-500',
      'Music': 'from-pink-500 to-red-500',
      'Travel': 'from-teal-500 to-cyan-500',
      'Food': 'from-orange-500 to-red-500',
      'Fitness': 'from-green-500 to-teal-500',
      'Education': 'from-blue-500 to-indigo-500',
      'Science': 'from-cyan-500 to-blue-500',
      'General': 'from-gray-500 to-slate-500'
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  };

  const getDefaultCategories = () => {
    return [
      {
        id: "technology",
        name: "Technology",
        description: "Programming, AI, web development, and tech trends",
        icon: Code,
        color: "from-blue-500 to-cyan-500",
        articles: 0,
        followers: 0,
        trending: false
      },
      {
        id: "design",
        name: "Design",
        description: "UI/UX, graphic design, and creative inspiration",
        icon: Palette,
        color: "from-purple-500 to-pink-500",
        articles: 0,
        followers: 0,
        trending: false
      },
      {
        id: "business",
        name: "Business",
        description: "Entrepreneurship, marketing, and business strategy",
        icon: Briefcase,
        color: "from-green-500 to-emerald-500",
        articles: 0,
        followers: 0,
        trending: false
      }
    ];
  };

  const filteredCategories = categories
    .filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           category.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedCategory === "all" || 
                           (selectedCategory === "trending" && category.trending) ||
                           (selectedCategory === "popular" && category.followers > 5000);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (selectedCategory === "trending") return b.trending - a.trending;
      if (selectedCategory === "popular") return b.followers - a.followers;
      return b.articles - a.articles;
    });

  const totalArticles = categories.reduce((sum, cat) => sum + cat.articles, 0);
  const totalFollowers = categories.reduce((sum, cat) => sum + cat.followers, 0);
  const trendingCount = categories.filter(cat => cat.trending).length;

  const filterOptions = [
    { value: "all", label: "All Categories" },
    { value: "trending", label: "Trending" },
    { value: "popular", label: "Most Popular" },
  ];

  return (
    <main className={`min-h-screen bg-white transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 animate-fade-in">
              <Tag className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold">EXPLORE CATEGORIES</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-slide-up">
              Discover Topics
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
              Explore diverse categories and find content that matches your interests and passions
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up animation-delay-400">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{categories.length}</div>
                <div className="text-sm text-indigo-200">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{totalArticles.toLocaleString()}</div>
                <div className="text-sm text-indigo-200">Articles</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{Math.round(totalFollowers / 1000)}K+</div>
                <div className="text-sm text-indigo-200">Followers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{trendingCount}</div>
                <div className="text-sm text-indigo-200">Trending</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 md:h-24 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              {/* Filter Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No categories found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
              : "space-y-6"
            }>
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className={`group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  {/* Category Image */}
                  <Link 
                    href={`/posts?category=${category.id}`} 
                    className={`block relative bg-gradient-to-br ${category.color} overflow-hidden ${
                      viewMode === "list" ? "w-48 flex-shrink-0" : "h-48"
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <category.icon className="w-16 h-16 text-white/80" />
                    </div>
                    {category.trending && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-red-600 text-xs font-semibold rounded-full flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </Link>

                  {/* Category Content */}
                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <Link href={`/posts?category=${category.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                        {category.name}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {category.articles}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {category.followers.toLocaleString()}
                        </span>
                      </div>
                      
                      <Link
                        href={`/posts?category=${category.id}`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold text-sm group-hover:translate-x-1 transition-transform"
                      >
                        Explore
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Categories */}
      {selectedCategory === "all" && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Most Popular Categories</h2>
              <p className="text-xl text-gray-600">
                Categories with the most active communities and content
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {categories
                .sort((a, b) => b.followers - a.followers)
                .slice(0, 3)
                .map((category, idx) => (
                <div key={category.id} className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl mb-6`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {category.articles} articles
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {category.followers.toLocaleString()} followers
                    </span>
                  </div>
                  <Link
                    href={`/posts?category=${category.id}`}
                    className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Explore Category
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}