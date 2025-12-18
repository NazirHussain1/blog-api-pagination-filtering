"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaGithub, 
  FaYoutube,
  FaNewspaper,
  FaRss,
  FaHeart,
  FaArrowRight,
  FaEnvelope,
  FaRegCopyright
} from "react-icons/fa";
import { FiSend, FiMail } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Please enter your email");
    
    setIsSubscribing(true);
    
    setTimeout(() => {
      toast.success("Welcome to InsightHub!", {
        description: "You'll receive our weekly newsletter with exclusive content."
      });
      setEmail("");
      setIsSubscribing(false);
      
      // Confetti effect
      if (typeof window !== 'undefined') {
        const confetti = import('canvas-confetti');
        confetti.then((confetti) => {
          confetti.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        });
      }
    }, 800);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Main footer content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                <FaNewspaper className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">InsightHub</h2>
                <p className="text-sm text-blue-200 font-semibold">Where Ideas Spark Innovation</p>
              </div>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed">
              A premier platform for thought leaders, innovators, and creators to share cutting-edge insights, 
              tutorials, and transformative perspectives that shape the future.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: FaTwitter, color: "hover:text-blue-400", bg: "hover:bg-blue-500/20" },
                { icon: FaLinkedin, color: "hover:text-blue-500", bg: "hover:bg-blue-600/20" },
                { icon: FaInstagram, color: "hover:text-pink-400", bg: "hover:bg-pink-500/20" },
                { icon: FaGithub, color: "hover:text-gray-300", bg: "hover:bg-gray-500/20" },
                { icon: FaYoutube, color: "hover:text-red-400", bg: "hover:bg-red-500/20" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label={social.icon.name}
                  className={`w-12 h-12 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center text-gray-300 ${social.color} ${social.bg} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
                >
                  <social.icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-8 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full mr-3"></div>
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { label: "Home", href: "/" },
                { label: "All Articles", href: "/posts" },
                { label: "Create Post", href: "/posts/create" },
                { label: "Categories", href: "/categories" },
                { label: "Trending", href: "/trending" },
                { label: "Bookmarks", href: "/bookmarks" }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white group flex items-center transition-all duration-300"
                  >
                    <FaArrowRight className="opacity-0 group-hover:opacity-100 mr-2 text-amber-400 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold text-white mb-8 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
              Resources
            </h3>
            <ul className="space-y-4">
              {[
                { label: "Documentation", href: "/docs" },
                { label: "Blog Guidelines", href: "/guidelines" },
                { label: "Code of Conduct", href: "/conduct" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Community Forum", href: "/forum" }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white group flex items-center transition-all duration-300"
                  >
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full mr-3"></div>
              <div className="flex items-center">
                Stay Updated
                <HiOutlineSparkles className="ml-2 text-amber-300 animate-pulse" />
              </div>
            </h3>
            
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center mb-4">
                <FiMail className="text-2xl text-cyan-300 mr-3" />
                <h4 className="text-lg font-semibold text-white">Weekly Digest</h4>
              </div>
              <p className="text-gray-300 text-sm mb-6">
                Get curated articles, exclusive insights, and community highlights delivered every Friday.
              </p>
              
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Subscribing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <FiSend className="mr-3" />
                      Join Newsletter
                    </span>
                  )}
                </Button>
              </form>
              
              <div className="flex items-center mt-6 pt-6 border-t border-white/10">
                <FaRss className="text-amber-400 mr-3" />
                <span className="text-sm text-gray-300">
                  <span className="font-semibold text-white">2,500+</span> subscribers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-gray-400 text-sm">
            <div className="flex items-center">
              <FaRegCopyright className="mr-2" />
              <span>{currentYear} InsightHub. All rights reserved.</span>
              <span className="mx-2">•</span>
              <span>Built with</span>
              <FaHeart className="mx-2 text-red-400 animate-pulse" />
              <span>by our community</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
              Sitemap
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
              Accessibility
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Back to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/40 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>

      {/* Decorative wave */}
      <div className="absolute top-0 left-0 right-0 transform translate-y-[-1px]">
        <svg className="w-full h-12 md:h-20 text-gray-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>
    </footer>
  );
}