import { useEffect, useState } from "react";

export default function CandidateModal({ candidate, onClose }) {
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    if (candidate) {
      fetch("http://127.0.0.1:8000/ai-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate,
          job_description: "Frontend Developer with React, Tailwind, and API experience"
        }),
      })
        .then((res) => res.json())
        .then((data) => setAiData(data))
        .catch(() => setAiData({ error: "AI failed" }));
    }
  }, [candidate]);

  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold">{candidate.name}</h2>
        <p className="text-sm text-gray-500">{candidate.email}</p>

        {/* AI Section */}
        {aiData && !aiData.error && (
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="font-bold">AI Score: {aiData.score}/100</p>
            <p className="text-sm text-gray-600">{aiData.summary}</p>
          </div>
        )}
        {aiData?.error && (
          <p className="text-red-600 text-sm">⚠ {aiData.error}</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
