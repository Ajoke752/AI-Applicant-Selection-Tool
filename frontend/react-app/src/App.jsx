import React, { useState } from "react";
import CandidateList from "./components/CandidateList";

// Use environment variable for API base; fallback to /api
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export default function App() {
  const [candidates, setCandidates] = useState([]); // start empty
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load sample applicants from backend
  async function loadSample() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/sample-data`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCandidates(data || []);
    } catch (e) {
      setError(
        "Could not load sample candidates. Check that backend is running or API URL is correct."
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Rank applicants via backend
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
      setError(
        "Ranking failed. Ensure backend is running and API URL is correct."
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              AI Applicant Selection Tool
            </h1>
            <p className="text-sm text-gray-600">
              Analyze applicants and generate ranked recommendations for your
              organization.
            </p>
          </div>

          {/* Buttons */}
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

        {/* Error message */}
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        {/* Candidate list */}
        <CandidateList candidates={candidates} />
      </div>
    </div>
  );
}
