"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  Globe,
  Twitter,
  Linkedin,
  Github,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Users,
  Shield,
  Zap,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus("success");
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "general",
        message: ""
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Admin",
      description: "Send email directly to admin",
      contact: "admin@insighthub.com",
      action: "mailto:admin@insighthub.com",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Phone,
      title: "Call Admin",
      description: "Speak directly with admin",
      contact: "+1 (555) 987-6543",
      action: "tel:+15559876543",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: MessageCircle,
      title: "Support Team",
      description: "General support inquiries",
      contact: "support@insighthub.com",
      action: "mailto:support@insighthub.com",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing & Account" },
    { value: "content", label: "Content Issues" },
    { value: "partnership", label: "Partnership" },
    { value: "feedback", label: "Feedback & Suggestions" }
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking 'Forgot Password' on the login page and following the instructions sent to your email."
    },
    {
      question: "How do I delete my account?",
      answer: "You can delete your account from your account settings page. This action is permanent and cannot be undone."
    },
    {
      question: "Can I change my username?",
      answer: "Currently, usernames cannot be changed after account creation. Please contact support if you need assistance."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "You can report content by clicking the report button on any article or comment, or by contacting our moderation team directly."
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/insighthub", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/insighthub", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/insighthub", label: "GitHub" }
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
              <MessageCircle className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold">CONTACT US</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Get in Touch
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Have questions, feedback, or need support? We're here to help and would love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center bg-white text-indigo-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 hover:shadow-xl transition-all duration-300"
              >
                <Send className="mr-2 w-5 h-5" />
                Send Message
              </a>
              
              <Link
                href="/help"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <HelpCircle className="mr-2 w-5 h-5" />
                Help Center
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

      {/* Contact Methods */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ways to Reach Us</h2>
            <p className="text-xl text-gray-600">
              Choose the method that works best for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactMethods.map((method, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${method.bgColor} rounded-2xl mb-6`}>
                  <method.icon className={`w-8 h-8 ${method.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <a
                  href={method.action}
                  className={`inline-flex items-center ${method.color} hover:underline font-semibold`}
                >
                  {method.contact}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div id="contact-form">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  
                  {submitStatus === "success" && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        <p className="text-green-800 font-medium">
                          Thank you! Your message has been sent successfully. We'll get back to you soon.
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Please provide details about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Sending Message...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Send className="mr-3 w-5 h-5" />
                          Send Message
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* FAQ */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                  <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                      <div key={idx}>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                          <HelpCircle className="w-5 h-5 text-indigo-600 mr-3" />
                          {faq.question}
                        </h4>
                        <p className="text-gray-600 leading-relaxed pl-8">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link
                      href="/help"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      View All FAQs
                      <HelpCircle className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-bold text-gray-900">Response Time</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">General Inquiries:</span>
                      <span className="font-semibold text-gray-900">24-48 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Technical Support:</span>
                      <span className="font-semibold text-gray-900">12-24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Urgent Issues:</span>
                      <span className="font-semibold text-gray-900">2-6 hours</span>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Stay updated with our latest news and announcements
                  </p>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:shadow-md transition-all duration-300"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}