"use client";

export default function FilterBar({ author, setAuthor, tag, setTag, sort, setSort }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Author Filter */}
      <input
        type="text"
        placeholder="Filter by author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="border px-2 py-1 rounded"
      />

      {/* Tag Filter */}
      <input
        type="text"
        placeholder="Filter by tag"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="border px-2 py-1 rounded"
      />

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
