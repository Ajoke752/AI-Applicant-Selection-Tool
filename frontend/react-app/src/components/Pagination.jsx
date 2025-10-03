import React from "react";

export default function Pagination({ page, setPage, pageCount, total }) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <div>{total} candidates</div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          className="px-3 py-1 bg-white border rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Prev
        </button>
        <div className="px-3 py-1 bg-white border rounded">
          Page {page} / {pageCount}
        </div>
        <button
          onClick={() => setPage(Math.min(pageCount, page + 1))}
          className="px-3 py-1 bg-white border rounded disabled:opacity-50"
          disabled={page === pageCount}
        >
          Next
        </button>
      </div>
    </div>
  );
}
