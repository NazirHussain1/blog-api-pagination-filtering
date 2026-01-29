"use client";

import Link from "next/link";
import {
  Users,
  Heart,
  Shield,
  MessageCircle,
  ThumbsUp,
  AlertTriangle,
  CheckCircle,
  Star,
  Award,
  Target,
  Lightbulb,
  BookOpen,
  Globe,
  Zap,
  UserCheck,
} from "lucide-react";

export default function CommunityRules() {
  const coreValues = [
    {
      title: "Respect & Kindness",
      description: "Treat all community members with respect, kindness, and empathy",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Constructive Dialogue",
      description: "Engage in meaningful, constructive conversations that add value",
      icon: MessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Quality Content",
      description: "Share high-quality, original content that educates and inspires",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Inclusive Environment",
      description: "Foster an inclusive space where everyone feels welcome and valued",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const communityRules = [
    {
      category: "Content Guidelines",
      icon: BookOpen,
      rules: [
        {
          title: "Original Content Only",
          description: "Share only original work or properly attributed content with permission.",
          type: "required"
        },
        {
          title: "Stay On-Topic",
          description: "Keep discussions relevant to the article or community topic at hand.",
          type: "required"
        },
        {
          title: "Quality Over Quantity",
          description: "Focus on creating valuable, well-thought-out content rather than frequent low-quality posts.",
          type: "recommended"
        },
        {
          title: "Proper Attribution",
          description: "Always credit sources, quotes, and references appropriately.",
          type: "required"
        }
      ]
    },
    {
      category: "Interaction Standards",
      icon: MessageCircle,
      rules: [
        {
          title: "Be Respectful",
          description: "Treat all community members with respect, regardless of their background or opinions.",
          type: "required"
        },
        {
          title: "Constructive Criticism",
          description: "Provide feedback that is helpful, specific, and aimed at improvement.",
          type: "recommended"
        },
        {
          title: "No Personal Attacks",
          description: "Focus on ideas and content, not personal characteristics or attacks on individuals.",
          type: "required"
        },
        {
          title: "Encourage Others",
          description: "Support fellow community members and celebrate their achievements.",
          type: "recommended"
        }
      ]
    },
    {
      category: "Prohibited Behavior",
      icon: Shield,
      rules: [
        {
          title: "No Harassment",
          description: "Harassment, bullying, or intimidation of any kind is strictly prohibited.",
          type: "required"
        },
        {
          title: "No Spam",
          description: "Avoid repetitive posts, excessive self-promotion, or irrelevant content.",
          type: "required"
        },
        {
          title: "No Hate Speech",
          description: "Content promoting hatred or discrimination based on identity is not allowed.",
          type: "required"
        },
        {
          title: "No Misinformation",
          description: "Do not share false, misleading, or deliberately deceptive information.",
          type: "required"
        }
      ]
    }
  ];

  const reportingProcess = [
    {
      step: 1,
      title: "Identify the Issue",
      description: "Recognize content or behavior that violates community guidelines",
      icon: Target
    },
    {
      step: 2,
      title: "Use Report Feature",
      description: "Click the report button on the content or contact our moderation team",
      icon: AlertTriangle
    },
    {
      step: 3,
      title: "Provide Details",
      description: "Give specific information about the violation to help our review",
      icon: MessageCircle
    },
    {
      step: 4,
      title: "Review Process",
      description: "Our team reviews reports within 24-48 hours and takes appropriate action",
      icon: UserCheck
    }
  ];

  const consequences = [
    {
      level: "Warning",
      description: "First-time minor violations receive a friendly warning and guidance",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      level: "Content Removal",
      description: "Violating content is removed with notification to the author",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      level: "Temporary Suspension",
      description: "Repeated violations may result in temporary account suspension",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      level: "Permanent Ban",
      description: "Severe or repeated violations may result in permanent account termination",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    }
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
              <Users className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold">COMMUNITY GUIDELINES</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Community Rules
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Building a respectful, inclusive, and thriving community together
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/posts"
                className="inline-flex items-center justify-center bg-white text-indigo-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 hover:shadow-xl transition-all duration-300"
              >
                <BookOpen className="mr-2 w-5 h-5" />
                Explore Community
              </Link>
              
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Report Issue
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

      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide our community interactions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {coreValues.map((value, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${value.bgColor} rounded-xl mb-4`}>
                  <value.icon className={`w-6 h-6 ${value.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Rules */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Guidelines</h2>
              <p className="text-xl text-gray-600">
                Clear rules to ensure a positive experience for everyone
              </p>
            </div>

            <div className="space-y-8">
              {communityRules.map((section, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-white rounded-xl mr-4">
                        <section.icon className="w-6 h-6 text-indigo-600" />
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
        </div>
      </section>

      {/* Reporting Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Reporting Violations</h2>
              <p className="text-xl text-gray-600">
                How to report content or behavior that violates our guidelines
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reportingProcess.map((step, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
                    <step.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-600 mb-2">Step {step.step}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Consequences */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Enforcement & Consequences</h2>
              <p className="text-xl text-gray-600">
                What happens when community guidelines are violated
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {consequences.map((consequence, idx) => (
                <div key={idx} className={`${consequence.bgColor} ${consequence.borderColor} border-2 rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold ${consequence.color} mb-3`}>{consequence.level}</h3>
                  <p className="text-gray-700 leading-relaxed">{consequence.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-blue-50 rounded-2xl border border-blue-200 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Appeals Process</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                If you believe a moderation action was taken in error, you can appeal the decision by 
                contacting our support team with details about your case.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}