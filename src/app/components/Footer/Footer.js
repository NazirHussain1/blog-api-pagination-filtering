"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email");
    }
    toast.success("Subscribed successfully!");
    e.target.reset();
  };

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">

        {/* About / Logo */}
        <div>
          <h2 className="text-2xl font-bold mb-3">My Blog</h2>
          <p className="text-gray-400 text-sm">
            Sharing knowledge, tutorials, and tips about web development, cloud,
            AI, and more. Stay updated with the latest insights.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/" className="hover:text-white transition">Home</Link>
            </li>
            <li>
              <Link href="/posts/create" className="hover:text-white transition">Create Post</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">About</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter / Subscribe */}
        <div>
          <h3 className="font-semibold mb-3">Subscribe</h3>
          <p className="text-gray-400 text-sm mb-3">
            Get the latest posts delivered to your inbox.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <Button type="submit" size="sm">
              Subscribe
            </Button>
          </form>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-6 text-gray-400 text-lg">
            <a href="#" aria-label="Twitter" className="hover:text-white transition">
              <FaTwitter />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition">
              <FaLinkedin />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white transition">
              <FaInstagram />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 text-gray-400 text-sm py-3 text-center">
        &copy; {new Date().getFullYear()} My Blog. All rights reserved.
      </div>
    </footer>
  );
}
