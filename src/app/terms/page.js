"use client";

import Link from "next/link";
import {
  FileText,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Scale,
  Globe,
  Lock,
  Mail,
  ExternalLink,
  Gavel,
  UserCheck,
} from "lucide-react";

export default function TermsOfService() {
  const lastUpdated = "January 29, 2026";

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: UserCheck,
      content: [
        {
          subtitle: "Agreement to Terms",
          description: "By accessing and using InsightHub, you accept and agree to be bound by the terms and provision of this agreement."
        },
        {
          subtitle: "Age Requirements",
          description: "You must be at least 13 years old to use our service. If you are under 18, you must have parental consent."
        },
        {
          subtitle: "Modifications",
          description: "We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms."
        }
      ]
    },
    {
      id: "user-accounts",
      title: "User Accounts and Registration",
      icon: Users,
      content: [
        {
          subtitle: "Account Creation",
          description: "You must provide accurate, current, and complete information during registration and keep your account information updated."
        },
        {
          subtitle: "Account Security",
          description: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account."
        },
        {
          subtitle: "Account Termination",
          description: "We reserve the right to terminate or suspend accounts that violate these terms or engage in harmful activities."
        }
      ]
    },
    {
      id: "content-guidelines",
      title: "Content and Conduct",
      icon: FileText,
      content: [
        {
          subtitle: "Content Ownership",
          description: "You retain ownership of content you create, but grant us a license to use, display, and distribute your content on our platform."
        },
        {
          subtitle: "Content Standards",
          description: "All content must comply with our community guidelines and applicable laws. Prohibited content will be removed."
        },
        {
          subtitle: "User Conduct",
          description: "Users must behave respectfully and lawfully. Harassment, spam, and malicious activities are strictly prohibited."
        },
        {
          subtitle: "Content Moderation",
          description: "We reserve the right to review, modify, or remove content that violates our terms or community standards."
        }
      ]
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      icon: Shield,
      content: [
        {
          subtitle: "Platform Rights",
          description: "InsightHub and its original content, features, and functionality are owned by us and protected by copyright and other laws."
        },
        {
          subtitle: "User Content License",
          description: "By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use your content in connection with our services."
        },
        {
          subtitle: "Respect for IP",
          description: "Users must respect the intellectual property rights of others and not post copyrighted material without permission."
        },
        {
          subtitle: "DMCA Compliance",
          description: "We comply with the Digital Millennium Copyright Act and will respond to valid takedown notices."
        }
      ]
    },
    {
      id: "privacy-data",
      title: "Privacy and Data Protection",
      icon: Lock,
      content: [
        {
          subtitle: "Privacy Policy",
          description: "Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these terms."
        },
        {
          subtitle: "Data Security",
          description: "We implement appropriate security measures to protect your personal information, but cannot guarantee absolute security."
        },
        {
          subtitle: "Data Retention",
          description: "We retain your data as long as necessary to provide services and comply with legal obligations."
        }
      ]
    },
    {
      id: "disclaimers",
      title: "Disclaimers and Limitations",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "Service Availability",
          description: "We strive to maintain service availability but do not guarantee uninterrupted access to our platform."
        },
        {
          subtitle: "Content Accuracy",
          description: "We do not verify the accuracy of user-generated content and are not responsible for any errors or omissions."
        },
        {
          subtitle: "Third-Party Links",
          description: "Our platform may contain links to third-party websites. We are not responsible for the content or practices of these sites."
        },
        {
          subtitle: "Limitation of Liability",
          description: "Our liability is limited to the maximum extent permitted by law. We are not liable for indirect or consequential damages."
        }
      ]
    },
    {
      id: "termination",
      title: "Termination and Suspension",
      icon: Gavel,
      content: [
        {
          subtitle: "User Termination",
          description: "You may terminate your account at any time by following the account deletion process in your settings."
        },
        {
          subtitle: "Our Right to Terminate",
          description: "We may terminate or suspend your account immediately for violations of these terms or harmful conduct."
        },
        {
          subtitle: "Effect of Termination",
          description: "Upon termination, your right to use the service ceases, and we may delete your account and content."
        }
      ]
    },
    {
      id: "governing-law",
      title: "Governing Law and Disputes",
      icon: Scale,
      content: [
        {
          subtitle: "Applicable Law",
          description: "These terms are governed by and construed in accordance with applicable laws, without regard to conflict of law principles."
        },
        {
          subtitle: "Dispute Resolution",
          description: "We encourage resolving disputes through direct communication. Legal disputes will be handled through appropriate legal channels."
        },
        {
          subtitle: "Jurisdiction",
          description: "Any legal proceedings will be conducted in the appropriate jurisdiction as determined by applicable law."
        }
      ]
    }
  ];

  const keyPoints = [
    {
      title: "Respectful Community",
      description: "Maintain a respectful and constructive environment for all users",
      icon: Users
    },
    {
      title: "Original Content",
      description: "Share original, high-quality content that adds value to our community",
      icon: FileText
    },
    {
      title: "Privacy Protection",
      description: "We protect your privacy and handle your data responsibly",
      icon: Lock
    },
    {
      title: "Fair Usage",
      description: "Use our platform fairly and in accordance with our guidelines",
      icon: Scale
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
              <Scale className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold">TERMS OF SERVICE</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Terms of Service
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Understanding the rules and guidelines that govern our community and platform
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-indigo-100">
                <strong>Last Updated:</strong> {lastUpdated}
              </p>
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

      {/* Key Points */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Points</h2>
            <p className="text-xl text-gray-600">
              The essential principles that guide our terms of service
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {keyPoints.map((point, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
                  <point.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{point.title}</h3>
                <p className="text-gray-600 text-sm">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {sections.map((section, idx) => (
                <div key={idx} id={section.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-white rounded-xl mr-4">
                        <section.icon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {section.content.map((item, itemIdx) => (
                        <div key={itemIdx}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                            {item.subtitle}
                          </h3>
                          <p className="text-gray-600 leading-relaxed pl-8">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="mt-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-xl mr-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Questions About These Terms?</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                If you have any questions about these Terms of Service or need clarification on any provisions, 
                please contact us. We're here to help you understand your rights and responsibilities as a member 
                of our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  <Mail className="mr-2 w-5 h-5" />
                  Contact Us
                </Link>
                <Link
                  href="/help"
                  className="inline-flex items-center justify-center border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  <ExternalLink className="mr-2 w-5 h-5" />
                  Help Center
                </Link>
              </div>
            </div>

            {/* Important Notice */}
            <div className="mt-8 bg-amber-50 rounded-2xl border border-amber-200 p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-amber-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Terms Updates</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We may update these Terms of Service from time to time to reflect changes in our services, 
                    legal requirements, or business practices. We will notify users of any material changes by 
                    posting the updated terms on our website and updating the "Last Updated" date. Your continued 
                    use of our services after any changes indicates your acceptance of the updated terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}