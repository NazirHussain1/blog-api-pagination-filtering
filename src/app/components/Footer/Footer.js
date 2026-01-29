"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaGithub, 
  FaYoutube,
  FaNewspaper,
  FaRss,
  FaHeart,
  FaRegCopyright,
  FaWhatsapp,
  FaDiscord,
  FaTelegram,
  FaBookOpen,
  FaUsers,
  FaShieldAlt,
  FaQuestionCircle,
  FaLightbulb,
  FaTags,
  FaAward,
  FaGlobe
} from "react-icons/fa";
import { FiTrendingUp, FiBookmark } from "react-icons/fi";
import { MdVerified, MdRssFeed } from "react-icons/md";

export default function Footer() {
  const user = useSelector((state) => state.auth.user);
  const currentYear = new Date().getFullYear();

  // Dynamic social links based on user profile
  const getSocialLinks = () => {
    if (!user?.socialLinks) return [];

    const links = [];

    if (user.socialLinks.twitter) {
      links.push({
        icon: FaTwitter,
        href: user.socialLinks.twitter.startsWith('http') ? user.socialLinks.twitter : `https://twitter.com/${user.socialLinks.twitter}`,
        color: "hover:text-blue-400",
        bg: "hover:bg-blue-500/20"
      });
    }

    if (user.socialLinks.linkedin) {
      links.push({
        icon: FaLinkedin,
        href: user.socialLinks.linkedin.startsWith('http') ? user.socialLinks.linkedin : `https://linkedin.com/in/${user.socialLinks.linkedin}`,
        color: "hover:text-blue-500",
        bg: "hover:bg-blue-600/20"
      });
    }

    if (user.socialLinks.github) {
      links.push({
        icon: FaGithub,
        href: user.socialLinks.github.startsWith('http') ? user.socialLinks.github : `https://github.com/${user.socialLinks.github}`,
        color: "hover:text-gray-300",
        bg: "hover:bg-gray-500/20"
      });
    }

    if (user.socialLinks.instagram) {
      links.push({
        icon: FaInstagram,
        href: user.socialLinks.instagram.startsWith('http') ? user.socialLinks.instagram : `https://instagram.com/${user.socialLinks.instagram.replace('@', '')}`,
        color: "hover:text-pink-400",
        bg: "hover:bg-pink-500/20"
      });
    }

    if (user.socialLinks.website) {
      links.push({
        icon: FaRss,
        href: user.socialLinks.website.startsWith('http') ? user.socialLinks.website : `https://${user.socialLinks.website}`,
        color: "hover:text-green-400",
        bg: "hover:bg-green-500/20"
      });
    }

    if (user.socialLinks.whatsapp) {
      links.push({
        icon: FaWhatsapp,
        href: user.socialLinks.whatsapp.startsWith('http') ? user.socialLinks.whatsapp : `https://wa.me/${user.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`,
        color: "hover:text-green-500",
        bg: "hover:bg-green-600/20"
      });
    }

    if (user.socialLinks.youtube) {
      links.push({
        icon: FaYoutube,
        href: user.socialLinks.youtube.startsWith('http') ? user.socialLinks.youtube : `https://youtube.com/@${user.socialLinks.youtube}`,
        color: "hover:text-red-500",
        bg: "hover:bg-red-500/20"
      });
    }

    if (user.socialLinks.discord) {
      links.push({
        icon: FaDiscord,
        href: user.socialLinks.discord,
        color: "hover:text-indigo-400",
        bg: "hover:bg-indigo-500/20"
      });
    }

    if (user.socialLinks.telegram) {
      links.push({
        icon: FaTelegram,
        href: user.socialLinks.telegram.startsWith('http') ? user.socialLinks.telegram : `https://t.me/${user.socialLinks.telegram}`,
        color: "hover:text-blue-400",
        bg: "hover:bg-blue-500/20"
      });
    }

    return links;
  };

  const socialLinks = getSocialLinks();

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8">
          
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
              {socialLinks.length > 0 ? socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.icon.name}
                  className={`w-12 h-12 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center text-gray-300 ${social.color} ${social.bg} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
                >
                  <social.icon className="text-xl" />
                </a>
              )) : (
                // Default social links if user has no social links set
                [
                  { icon: FaTwitter, href: "https://twitter.com/insighthub", color: "hover:text-blue-400", bg: "hover:bg-blue-500/20", label: "Follow us on Twitter" },
                  { icon: FaLinkedin, href: "https://linkedin.com/company/insighthub", color: "hover:text-blue-500", bg: "hover:bg-blue-600/20", label: "Connect on LinkedIn" },
                  { icon: FaInstagram, href: "https://instagram.com/insighthub", color: "hover:text-pink-400", bg: "hover:bg-pink-500/20", label: "Follow on Instagram" },
                  { icon: FaGithub, href: "https://github.com/insighthub", color: "hover:text-gray-300", bg: "hover:bg-gray-500/20", label: "View our GitHub" },
                  { icon: FaYoutube, href: "https://youtube.com/@insighthub", color: "hover:text-red-500", bg: "hover:bg-red-500/20", label: "Subscribe on YouTube" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-12 h-12 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center text-gray-300 ${social.color} ${social.bg} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <social.icon className="text-xl" />
                  </a>
                ))
              )}
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
                { label: "Home", href: "/", icon: FaGlobe },
                { label: "All Articles", href: "/posts", icon: FaBookOpen },
                { label: "Create Post", href: "/posts/create", icon: FaLightbulb },
                { label: "My Posts", href: "/my-posts", icon: FiBookmark },
                { label: "Trending", href: "/trending", icon: FiTrendingUp },
                { label: "Categories", href: "/categories", icon: FaTags }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white group flex items-center transition-all duration-300"
                  >
                    <link.icon className="mr-3 text-amber-400 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
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
                { label: "Help Center", href: "/help", icon: FaQuestionCircle },
                { label: "Writing Guidelines", href: "/guidelines", icon: FaBookOpen },
                { label: "Community Rules", href: "/community", icon: FaUsers },
                { label: "Privacy Policy", href: "/privacy", icon: FaShieldAlt },
                { label: "Terms of Service", href: "/terms", icon: FaRegCopyright },
                { label: "API Documentation", href: "/api-docs", icon: MdRssFeed }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white group flex items-center transition-all duration-300"
                  >
                    <link.icon className="mr-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

        {/* Bottom bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          <div className="text-gray-400 text-sm">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0">
              <div className="flex items-center">
                <FaRegCopyright className="mr-2" />
                <span>{currentYear} InsightHub. All rights reserved.</span>
              </div>
              <span className="hidden sm:inline mx-3">•</span>
              <div className="flex items-center">
                <span>Crafted with</span>
                <FaHeart className="mx-2 text-red-400 animate-pulse" />
                <span>by developers, for developers</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors hover:underline">
              Sitemap
            </Link>
            <Link href="/rss" className="text-gray-400 hover:text-white transition-colors hover:underline flex items-center">
              <FaRss className="mr-1" />
              RSS Feed
            </Link>
            <Link href="/status" className="text-gray-400 hover:text-white transition-colors hover:underline flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Status
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors hover:underline">
              Contact
            </Link>
          </div>
        </div>

        {/* Back to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-indigo-500/40 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6 transform group-hover:-translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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