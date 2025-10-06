import React from "react";
import { Award } from "lucide-react";

export default function CandidateCard({ candidate, rank, onOpen }) {
  const skills = (candidate.skills || []).slice(0, 6);
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between hover:shadow-lg transition">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center text-blue-700 font-semibold">
          #{rank}
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-800">
            {candidate.name || "Unnamed"}
          </div>
          <div className="text-sm text-gray-500">
            {candidate.email || candidate.notes || ""}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((s) => (
              <span
                key={s}
                className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 border"
              >
                {s}
              </span>
            ))}
            {(candidate.skills || []).length > skills.length && (
              <span className="text-xs text-gray-400">
                +{(candidate.skills || []).length - skills.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-xl font-bold text-blue-600">
            {(candidate.score || 0).toFixed(3)}
          </div>
          <div className="text-sm text-gray-500">
            Exp: {candidate.years_experience || 0} yrs
          </div>
        </div>
        <button
          onClick={onOpen}
          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
        >
          View
        </button>
      </div>
    </div>
  );
}
