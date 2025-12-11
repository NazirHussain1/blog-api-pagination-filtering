"use client";

export default function Pagination({ page, setPage, hasNext }) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>
      <span className="px-2 py-1">{page}</span>
      <button
        className="bg-gray-300 px-3 py-1 rounded"
        disabled={!hasNext}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
