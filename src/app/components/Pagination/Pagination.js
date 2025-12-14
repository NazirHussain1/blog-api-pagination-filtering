"use client";

export default function Pagination({ page, setPage, hasNext }) {
  return (
    <nav
      className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        aria-label="Previous page"
      >
        Prev
      </button>

      {/* Current Page */}
      <span
        className="px-4 py-2 border rounded bg-blue-600 text-white font-medium"
        aria-current="page"
      >
        {page}
      </span>

      {/* Next Button */}
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={!hasNext}
        className="px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
