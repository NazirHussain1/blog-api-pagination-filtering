"use client";

export default function Pagination({ page, setPage, hasNext }) {
  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-3 py-1 border rounded">{page}</span>
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={!hasNext}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
