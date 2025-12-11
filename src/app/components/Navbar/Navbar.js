"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/">
          <h1 className="text-xl font-bold">My Blog</h1>
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/posts/create" className="hover:underline">Create Post</Link>
        </div>
      </div>
    </nav>
  );
}
