"use client";

import { X } from "lucide-react";

export default function FilterBar({ author, setAuthor, tag, setTag, sort, setSort }) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 items-center">

      {/* Author Filter */}
      <div className="relative w-full sm:w-auto">
        <input
          type="text"
          placeholder="Filter by author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full sm:w-auto"
          aria-label="Filter posts by author"
        />
        {author && (
          <button
            onClick={() => setAuthor("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            aria-label="Clear author filter"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Tag Filter */}
      <div className="relative w-full sm:w-auto">
        <input
          type="text"
          placeholder="Filter by tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full sm:w-auto"
          aria-label="Filter posts by tag"
        />
        {tag && (
          <button
            onClick={() => setTag("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            aria-label="Clear tag filter"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Sort Filter */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full sm:w-auto"
        aria-label="Sort posts"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>

    </div>
  );
}
