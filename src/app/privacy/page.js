"use client";

import Link from "next/link";
import {
  Shield,
  Lock,
  Eye,
  Users,
  Database,
  Settings,
  Mail,
  Globe,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "January 29, 2026";

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Database,
      content: [
        {
          subtitle: "Account Information",
          description: "When you create an account, we collect your name, email address, username, and profile information you choose to provide."
        },
        {
          subtitle: "Content Data",
          description: "We store the articles, comments, and other content you create on our platform, along with associated metadata like publication dates and view counts."
        },
        {
          subtitle: "Usage Information",
          description: "We collect information about how you use our service, including pages visited, features used, and interaction patterns to improve our platform."
        },
        {
          subtitle: "Device Information",
          description: "We may collect information about the device you use to access our service, including IP address, browser type, and operating system."
        }
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: Settings,
      content: [
        {
          subtitle: "Service Provision",
          description: "We use your information to provide, maintain, and improve our blogging platform and related services."
        },
        {
          subtitle: "Communication",
          description: "We may use your email address to send you important updates, newsletters (if subscribed), and respond to your inquiries."
        },
        {
          subtitle: "Personalization",
          description: "We use your data to personalize your experience, including content recommendations and customized features."
        },
        {
          subtitle: "Analytics",
          description: "We analyze usage patterns to understand how our platform is used and to make improvements to our services."
        }
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: Users,
      content: [
        {
          subtitle: "Public Content",
          description: "Articles, comments, and profile information you choose to make public will be visible to other users and may be indexed by search engines."
        },
        {
          subtitle: "Service Providers",
          description: "We may share information with trusted third-party service providers who help us operate our platform, subject to confidentiality agreements."
        },
        {
          subtitle: "Legal Requirements",
          description: "We may disclose information when required by law, to protect our rights, or to ensure the safety of our users and platform."
        },
        {
          subtitle: "Business Transfers",
          description: "In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the business transaction."
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: [
        {
          subtitle: "Encryption",
          description: "We use industry-standard encryption to protect your data both in transit and at rest on our servers."
        },
        {
          subtitle: "Access Controls",
          description: "We implement strict access controls to ensure only authorized personnel can access user data, and only when necessary."
        },
        {
          subtitle: "Regular Audits",
          description: "We conduct regular security audits and assessments to identify and address potential vulnerabilities."
        },
        {
          subtitle: "Incident Response",
          description: "We have procedures in place to quickly respond to and mitigate any security incidents that may occur."
        }
      ]
    },
    {
      id: "user-rights",
      title: "Your Rights and Choices",
      icon: Eye,
      content: [
        {
          subtitle: "Access and Portability",
          description: "You can access, download, and export your personal data and content at any time through your account settings."
        },
        {
          subtitle: "Correction and Updates",
          description: "You can update your profile information and account settings at any time to ensure accuracy."
        },
        {
          subtitle: "Deletion",
          description: "You can delete your account and associated data at any time. Some information may be retained for legal or operational purposes."
        },
        {
          subtitle: "Communication Preferences",
          description: "You can control what communications you receive from us through your account settings and email preferences."
        }
      ]
    },
    {
      id: "cookies-tracking",
      title: "Cookies and Tracking",
      icon: Globe,
      content: [
        {
          subtitle: "Essential Cookies",
          description: "We use cookies that are necessary for the basic functionality of our platform, such as maintaining your login session."
        },
        {
          subtitle: "Analytics Cookies",
          description: "We use analytics cookies to understand how users interact with our platform and to improve our services."
        },
        {
          subtitle: "Preference Cookies",
          description: "We store your preferences and settings to provide a personalized experience across your visits."
        },
        {
          subtitle: "Cookie Control",
          description: "You can control cookie settings through your browser, though disabling certain cookies may affect platform functionality."
        }
      ]
    }
  ];

  const principles = [
    {
      title: "Transparency",
      description: "We're clear about what data we collect and how we use it",
      icon: Eye
    },
    {
      title: "User Control",
      description: "You have control over your data and privacy settings",
      icon: Settings
    },
    {
      title: "Data Minimization",
      description: "We only collect data that's necessary for our services",
      icon: Database
    },
    {
      title: "Security First",
      description: "We prioritize the security and protection of your data",
      icon: Shield
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
              <Shield className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold">PRIVACY POLICY</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Privacy Policy
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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

      {/* Privacy Principles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Privacy Principles</h2>
            <p className="text-xl text-gray-600">
              These principles guide how we handle your personal information
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {principles.map((principle, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
                  <principle.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{principle.title}</h3>
                <p className="text-gray-600 text-sm">{principle.description}</p>
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
                <h2 className="text-2xl font-bold text-gray-900">Questions About Privacy?</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                If you have any questions about this Privacy Policy or how we handle your personal information, 
                please don't hesitate to contact us. We're committed to transparency and will respond to your 
                inquiries promptly.
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Updates</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or 
                    legal requirements. We will notify you of any material changes by posting the updated policy 
                    on our website and updating the "Last Updated" date. Your continued use of our services after 
                    any changes indicates your acceptance of the updated policy.
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