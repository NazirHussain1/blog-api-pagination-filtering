"use client";

export default function FilterBar({ author, setAuthor, tag, setTag, sort, setSort }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        placeholder="Filter by Author"
        className="border p-2 rounded"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Filter by Tag"
        className="border p-2 rounded"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />
      <select
        className="border p-2 rounded"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
