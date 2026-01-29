"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Users,
  Settings,
  Shield,
  Zap,
  Star,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", icon: BookOpen },
    { id: "getting-started", name: "Getting Started", icon: Zap },
    { id: "writing", name: "Writing & Publishing", icon: Lightbulb },
    { id: "account", name: "Account & Settings", icon: Settings },
    { id: "community", name: "Community", icon: Users },
    { id: "privacy", name: "Privacy & Security", icon: Shield },
  ];

  const faqs = [
    {
      category: "getting-started",
      question: "How do I create my first article?",
      answer: "To create your first article, click the 'Create Post' button in the navigation menu or go to /posts/create. Fill in your title, content, and add relevant tags to help readers discover your article."
    },
    {
      category: "getting-started",
      question: "What makes a good article title?",
      answer: "A good title should be clear, descriptive, and engaging. Keep it between 10-60 characters for optimal SEO. Use action words and make it specific to your content."
    },
    {
      category: "writing",
      question: "How do I add images to my articles?",
      answer: "You can upload a featured image when creating or editing your article. The recommended size is 1200×630 pixels. Supported formats are JPG, PNG, and WebP up to 5MB."
    },
    {
      category: "writing",
      question: "Can I save my work as a draft?",
      answer: "Yes! When creating an article, you can click 'Save Draft' to save your work without publishing. You can access your drafts from your profile page."
    },
    {
      category: "account",
      question: "How do I update my profile information?",
      answer: "Go to your profile page and click 'Edit Profile'. You can update your bio, profile picture, social links, and contact information."
    },
    {
      category: "account",
      question: "How do I change my password?",
      answer: "Visit your account settings page and look for the 'Change Password' section. You'll need to enter your current password and choose a new one."
    },
    {
      category: "community",
      question: "How do I interact with other writers?",
      answer: "You can like articles, leave comments, follow other writers, and share articles on social media. Engage respectfully and constructively with the community."
    },
    {
      category: "community",
      question: "What are the community guidelines?",
      answer: "We promote respectful, constructive discussions. No spam, harassment, or inappropriate content. Be kind, helpful, and contribute meaningfully to conversations."
    },
    {
      category: "privacy",
      question: "How is my data protected?",
      answer: "We use industry-standard encryption and security measures to protect your data. Read our Privacy Policy for detailed information about data collection and usage."
    },
    {
      category: "privacy",
      question: "Can I delete my account?",
      answer: "Yes, you can delete your account from the account settings page. This action is permanent and will remove all your articles and data."
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const quickLinks = [
    { title: "Writing Guidelines", href: "/guidelines", icon: BookOpen },
    { title: "Community Rules", href: "/community", icon: Users },
    { title: "Privacy Policy", href: "/privacy", icon: Shield },
    { title: "Terms of Service", href: "/terms", icon: Settings },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold">HELP CENTER</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              How can we help you?
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions, learn how to use InsightHub, and get the support you need
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles, guides, and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
              />
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

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                  {/* Categories */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Categories</h3>
                    <nav className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${
                            selectedCategory === category.id
                              ? "bg-indigo-100 text-indigo-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <category.icon className="w-5 h-5 mr-3" />
                          <span className="font-medium">{category.name}</span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Links</h3>
                    <div className="space-y-3">
                      {quickLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.href}
                          className="flex items-center p-3 rounded-xl hover:bg-white/50 transition-all duration-300 group"
                        >
                          <link.icon className="w-4 h-4 text-indigo-600 mr-3" />
                          <span className="text-gray-700 font-medium group-hover:text-indigo-600">
                            {link.title}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Contact Support */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Need More Help?</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Can't find what you're looking for? Our support team is here to help.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Popular Topics */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Topics</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-xl mr-4">
                          <Zap className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Getting Started</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Learn the basics of creating your account, writing your first article, and navigating the platform.
                      </p>
                      <Link
                        href="#getting-started"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        View guides
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-purple-100 rounded-xl mr-4">
                          <Lightbulb className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Writing Tips</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Discover best practices for writing engaging articles, optimizing for SEO, and growing your audience.
                      </p>
                      <Link
                        href="/guidelines"
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
                      >
                        Read guidelines
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Frequently Asked Questions
                  </h2>
                  
                  {filteredFaqs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                      <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-600">Try adjusting your search or browse different categories.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredFaqs.map((faq, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <HelpCircle className="w-5 h-5 text-indigo-600 mr-3" />
                            {faq.question}
                          </h3>
                          <p className="text-gray-600 leading-relaxed pl-8">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}