"use client";

export default function FilterBar({ author, setAuthor, tag, setTag, sort, setSort }) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
      
      {/* Author Filter */}
      <input
        type="text"
        placeholder="Filter by author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full sm:w-auto"
      />

      {/* Tag Filter */}
      <input
        type="text"
        placeholder="Filter by tag"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full sm:w-auto"
      />

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full sm:w-auto"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
 