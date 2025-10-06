import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export default function CandidateModal({ candidate, onClose }) {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (candidate) {
      setLoading(true);
      fetch(`${API_BASE}/ai-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate,
          job_description: "Frontend Developer with React, Tailwind, and API experience"
        }),
      })
        .then((res) => res.json())
        .then((data) => setAiData(data))
        .catch(() => setAiData({ error: "AI failed" }))
        .finally(() => setLoading(false));
    }
  }, [candidate]);

  if (!candidate) return null;

  const scoreBreakdown = candidate.score_breakdown || {};
  const assessmentScores = candidate.assessment_scores || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold">{candidate.name}</h2>
        <p className="text-sm text-gray-500">{candidate.email}</p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Overall Score</p>
            <p className="text-2xl font-bold text-blue-600">
              {(candidate.score || 0).toFixed(3)}
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Experience</p>
            <p className="text-xl font-semibold">
              {candidate.years_experience || 0} years
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Education</p>
            <p className="text-xl font-semibold capitalize">
              {candidate.education || "N/A"}
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Portfolio</p>
            <p className="text-xl font-semibold">
              {candidate.portfolio_present ? "✓ Yes" : "✗ No"}
            </p>
          </div>
        </div>

        {Object.keys(scoreBreakdown).length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Score Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(scoreBreakdown).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key.replace("_", " ")}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {(value * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.keys(assessmentScores).length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Assessment Scores</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(assessmentScores).map(([key, value]) => (
                <div key={key} className="p-2 bg-blue-50 rounded text-center">
                  <p className="text-xs text-gray-600 capitalize">{key.replace("_", " ")}</p>
                  <p className="text-lg font-bold text-blue-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <h3 className="font-bold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {(candidate.skills || []).map((s) => (
              <span
                key={s}
                className="text-sm bg-green-100 px-3 py-1 rounded-full text-green-700 border border-green-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {candidate.notes && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Notes</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {candidate.notes}
            </p>
          </div>
        )}

        {candidate.cover_letter && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Cover Letter</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {candidate.cover_letter}
            </p>
          </div>
        )}

        {loading && (
          <div className="mt-4 p-3 bg-blue-50 rounded animate-pulse">
            <p className="text-sm text-blue-600">Loading AI analysis...</p>
          </div>
        )}

        {aiData && !aiData.error && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <h3 className="font-bold mb-2 text-blue-900">AI Analysis</h3>
            <p className="text-lg font-bold text-blue-700">Score: {aiData.score}/100</p>
            <p className="text-sm text-gray-700 mt-2">{aiData.summary}</p>
          </div>
        )}

        {aiData?.error && (
          <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
            <p className="text-red-600 text-sm">⚠ {aiData.error}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
