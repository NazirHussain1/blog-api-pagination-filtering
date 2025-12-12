"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Subscribed successfully!");
  };

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        {/* About / Logo */}
        <div>
          <h2 className="text-2xl font-bold mb-2">My Blog</h2>
          <p className="text-gray-400 text-sm">
            Sharing knowledge, tutorials, and tips about web development, cloud,
            AI, and more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-gray-400">
            <li>
              <Link href="/" className="hover:text-white">Home</Link>
            </li>
            <li>
              <Link href="/posts/create" className="hover:text-white">Create Post</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">About</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter / Subscribe */}
        <div>
          <h3 className="font-semibold mb-2">Subscribe</h3>
          <p className="text-gray-400 text-sm mb-2">
            Get the latest posts delivered to your inbox.
          </p>
          <form className="flex space-x-2" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter email"
              required
              className="w-full px-3 py-2 rounded-md text-gray-900"
            />
            <Button type="submit" size="sm">
              Subscribe
            </Button>
          </form>

          {/* Social Icons */}
          <div className="flex space-x-3 mt-4 text-gray-400">
            <a href="#" className="hover:text-white">🐦</a>
            <a href="#" className="hover:text-white">💼</a>
            <a href="#" className="hover:text-white">📸</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-800 text-gray-400 text-sm py-3 text-center">
        &copy; {new Date().getFullYear()} My Blog. All rights reserved.
      </div>
    </footer>
  );
}
