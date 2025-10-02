import React, { useMemo, useState } from "react";
import CandidateCard from "./CandidateCard";
import Filters from "./Filters";
import Pagination from "./Pagination";
import CandidateModal from "./CandidateModal";
import ExportCSV from "./ExportCSV";

export default function CandidateList({ candidates = [] }) {
  const [query, setQuery] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [minExp, setMinExp] = useState(0);
  const [sortBy, setSortBy] = useState("score");
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = candidates.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q) ||
          (c.notes || "").toLowerCase().includes(q)
      );
    }

    if (requiredSkills.length) {
      list = list.filter((c) =>
        requiredSkills.every((s) => (c.skills || []).includes(s))
      );
    }

    if (minExp > 0) {
      list = list.filter((c) => (c.years_experience || 0) >= minExp);
    }

    list.sort((a, b) => {
      if (sortBy === "score") return (b.score || 0) - (a.score || 0);
      if (sortBy === "experience")
        return (b.years_experience || 0) - (a.years_experience || 0);
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      return 0;
    });

    return list;
  }, [candidates, query, requiredSkills, minExp, sortBy]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  function resetFilters() {
    setQuery("");
    setRequiredSkills([]);
    setMinExp(0);
    setSortBy("score");
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Top Candidates</h2>
          <div className="flex items-center gap-3">
            <ExportCSV filename="candidates.csv" data={filtered} />
            <button
              onClick={resetFilters}
              className="text-sm px-3 py-2 bg-white border rounded-md hover:shadow"
            >
              Reset
            </button>
          </div>
        </div>

        <Filters
          query={query}
          onQuery={setQuery}
          requiredSkills={requiredSkills}
          onRequiredSkills={setRequiredSkills}
          minExp={minExp}
          onMinExp={setMinExp}
          sortBy={sortBy}
          onSortBy={setSortBy}
        />

        <div className="grid gap-6 mt-6">
          {visible.length === 0 ? (
            <div className="text-center text-gray-500 py-20 bg-white rounded shadow">
              No candidates match your filters.
            </div>
          ) : (
            visible.map((c, idx) => (
              <CandidateCard
                key={c.id || idx}
                candidate={c}
                rank={(page - 1) * perPage + idx + 1}
                onOpen={() => setSelected(c)}
              />
            ))
          )}
        </div>

        <div className="mt-6">
          <Pagination
            page={page}
            setPage={setPage}
            pageCount={pageCount}
            total={total}
          />
        </div>
      </div>

      <CandidateModal candidate={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
