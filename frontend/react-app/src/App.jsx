import React, { useState, useEffect } from "react";
import CandidateList from "./components/CandidateList";

const API_BASE = "/api";

export default function App() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSample();
  }, []);

  async function loadSample() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/sample-data`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCandidates(data || []);
    } catch (e) {
      setError("Could not load applicants. Ensure backend is running.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleRank() {
    if (!candidates || candidates.length === 0) {
      setError("No applicants to rank. Load sample data first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/rank`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicants: candidates }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setCandidates(data.ranked || []);
    } catch (e) {
      setError("Ranking failed. Ensure backend is running.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                AI Applicant Selection Tool
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                LSETF Program - Analyze applicants and generate ranked recommendations
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadSample}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:shadow transition"
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh Data"}
              </button>

              <button
                onClick={handleRank}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                disabled={loading || candidates.length === 0}
              >
                {loading ? "Ranking..." : "Rank Applicants"}
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <CandidateList candidates={candidates} loading={loading} />
      </div>
    </div>
  );
}
