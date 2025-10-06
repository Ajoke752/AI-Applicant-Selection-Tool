// ...existing code...
import React, { useState } from "react";
import CandidateList from "./components/CandidateList";

export default function App() {
  const [candidates, setCandidates] = useState([]); // start empty
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadSample() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/sample-data");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCandidates(data || []); // since /sample-data just returns raw list
    } catch (e) {
      setError(
        "Could not load sample candidates. Ensure backend is running at http://localhost:8000"
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleRank() {
    if (!candidates || candidates.length === 0) {
      setError(
        "No applicants to rank. Load sample data or provide applicants first."
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("http://127.0.0.1:8000/rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicants: candidates }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setCandidates(data.ranked || []);
    } catch (e) {
      setError(
        "Ranking failed. Ensure backend is running and CORS is enabled."
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              AI Applicant Selection Tool
            </h1>
            <p className="text-sm text-gray-600">
              Prototype: analyze applicants and generate ranked recommendations
              for your organization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadSample}
              className="px-4 py-2 bg-white border rounded-md hover:shadow"
              disabled={loading}
            >
              {loading ? "Loading..." : "Load Sample"}
            </button>

            <button
              onClick={handleRank}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              disabled={loading || candidates.length === 0}
            >
              {loading ? "Working..." : "Rank Applicants"}
            </button>
          </div>
        </header>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <CandidateList candidates={candidates} />
      </div>
    </div>
  );
}
