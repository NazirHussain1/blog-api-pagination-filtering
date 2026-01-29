"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  Users,
  Shield,
  Star,
  Zap,
  Award,
  ArrowRight,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Tag,
  TrendingUp,
} from "lucide-react";

export default function WritingGuidelines() {
  const guidelines = [
    {
      category: "Content Quality",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      rules: [
        {
          title: "Write Original Content",
          description: "All articles must be original work. Plagiarism or copying content from other sources is strictly prohibited.",
          type: "required"
        },
        {
          title: "Provide Value",
          description: "Focus on creating content that educates, informs, or entertains your readers. Share insights, tutorials, or unique perspectives.",
          type: "recommended"
        },
        {
          title: "Fact-Check Your Work",
          description: "Ensure all facts, statistics, and claims in your articles are accurate and properly sourced.",
          type: "required"
        }
      ]
    },
    {
      category: "Writing Style",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      rules: [
        {
          title: "Clear and Engaging Titles",
          description: "Create titles that are descriptive, engaging, and between 10-60 characters for optimal SEO performance.",
          type: "recommended"
        },
        {
          title: "Use Proper Grammar",
          description: "Proofread your articles for grammar, spelling, and punctuation errors before publishing.",
          type: "required"
        },
        {
          title: "Structure Your Content",
          description: "Use headings, bullet points, and short paragraphs to make your content easy to read and scan.",
          type: "recommended"
        }
      ]
    },
    {
      category: "Visual Content",
      icon: ImageIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      rules: [
        {
          title: "Use High-Quality Images",
          description: "Include relevant, high-resolution images that complement your content. Recommended size: 1200×630 pixels.",
          type: "recommended"
        },
        {
          title: "Respect Copyright",
          description: "Only use images you own, have permission to use, or are available under appropriate licenses.",
          type: "required"
        },
        {
          title: "Add Alt Text",
          description: "Include descriptive alt text for images to improve accessibility and SEO.",
          type: "recommended"
        }
      ]
    },
    {
      category: "Community Standards",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      rules: [
        {
          title: "Be Respectful",
          description: "Maintain a respectful tone in all content and interactions. No hate speech, harassment, or discriminatory content.",
          type: "required"
        },
        {
          title: "Stay On-Topic",
          description: "Keep your content relevant to your chosen category and tags. Avoid off-topic or misleading content.",
          type: "required"
        },
        {
          title: "Engage Constructively",
          description: "Respond to comments thoughtfully and engage in meaningful discussions with your readers.",
          type: "recommended"
        }
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Research Your Topic",
      description: "Spend time researching your topic thoroughly before writing. This ensures accuracy and depth.",
      icon: Target
    },
    {
      title: "Know Your Audience",
      description: "Write for your target audience. Consider their knowledge level and interests when crafting your content.",
      icon: Users
    },
    {
      title: "Use SEO Best Practices",
      description: "Include relevant keywords naturally, use proper headings, and write compelling meta descriptions.",
      icon: TrendingUp
    },
    {
      title: "Add Relevant Tags",
      description: "Use 3-5 relevant tags to help readers discover your content. Choose specific, descriptive tags.",
      icon: Tag
    },
    {
      title: "Include a Call-to-Action",
      description: "End your articles with a clear call-to-action, whether it's asking for comments, shares, or follows.",
      icon: ArrowRight
    },
    {
      title: "Edit and Revise",
      description: "Always review and edit your work. Consider reading it aloud or having someone else review it.",
      icon: CheckCircle
    }
  ];

  const prohibitedContent = [
    "Spam, promotional content, or excessive self-promotion",
    "Hate speech, harassment, or discriminatory content",
    "Plagiarized or copied content from other sources",
    "Misleading, false, or deliberately deceptive information",
    "Content that violates copyright or intellectual property rights",
    "Adult content, violence, or inappropriate material",
    "Personal attacks or inflammatory language",
    "Off-topic content that doesn't match the article's category"
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
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold">WRITING GUIDELINES</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Writing Guidelines
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create exceptional content that engages readers and builds a thriving community
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/posts/create"
                className="inline-flex items-center justify-center bg-white text-indigo-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 hover:shadow-xl transition-all duration-300"
              >
                <span>Start Writing</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <Link
                href="/help"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <BookOpen className="mr-2 w-5 h-5" />
                <span>Help Center</span>
              </Link>
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
          <div className="max-w-4xl mx-auto">
            {/* Guidelines */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Content Guidelines</h2>
              <div className="space-y-8">
                {guidelines.map((section, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className={`${section.bgColor} p-6 border-b border-gray-200`}>
                      <div className="flex items-center">
                        <div className={`p-3 bg-white rounded-xl mr-4`}>
                          <section.icon className={`w-6 h-6 ${section.color}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{section.category}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        {section.rules.map((rule, ruleIdx) => (
                          <div key={ruleIdx} className="flex items-start">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-4 mt-1 ${
                              rule.type === 'required' 
                                ? 'bg-red-100 text-red-600' 
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              {rule.type === 'required' ? (
                                <AlertTriangle className="w-4 h-4" />
                              ) : (
                                <Lightbulb className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h4 className="text-lg font-semibold text-gray-900 mr-3">{rule.title}</h4>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  rule.type === 'required' 
                                    ? 'bg-red-100 text-red-600' 
                                    : 'bg-blue-100 text-blue-600'
                                }`}>
                                  {rule.type === 'required' ? 'Required' : 'Recommended'}
                                </span>
                              </div>
                              <p className="text-gray-600 leading-relaxed">{rule.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Practices */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Best Practices</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {bestPractices.map((practice, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                    <div className="flex items-start">
                      <div className="p-3 bg-indigo-100 rounded-xl mr-4 flex-shrink-0">
                        <practice.icon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{practice.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{practice.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prohibited Content */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Prohibited Content</h2>
              <div className="bg-red-50 rounded-2xl border border-red-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-red-100 rounded-xl mr-4">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Content We Don't Allow</h3>
                </div>
                <ul className="space-y-3">
                  {prohibitedContent.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                <Zap className="w-8 h-8" />
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Ready to Start Writing?</h2>
              
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Follow these guidelines to create amazing content that resonates with our community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/posts/create"
                  className="inline-flex items-center justify-center bg-white text-indigo-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  <BookOpen className="mr-2 w-5 h-5" />
                  Create Your First Article
                </Link>
                
                <Link
                  href="/help"
                  className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  <ExternalLink className="mr-2 w-5 h-5" />
                  Get Help
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}