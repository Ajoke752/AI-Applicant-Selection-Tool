import React from "react";

export default function CandidateModal({ candidate, onClose }) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-auto max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="text-lg font-semibold">{candidate.name}</div>
            <div className="text-sm text-gray-500">{candidate.email}</div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-sm text-blue-600 font-bold">{(candidate.score || 0).toFixed(3)}</div>
            <button onClick={onClose} className="px-3 py-1 bg-gray-100 rounded">Close</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <div className="font-medium text-gray-700">Skills</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(candidate.skills || []).map((s) => <span key={s} className="text-xs bg-gray-100 px-2 py-1 rounded-full">{s}</span>)}
            </div>
          </div>

          <div>
            <div className="font-medium text-gray-700">Experience</div>
            <div className="text-sm text-gray-600">{candidate.years_experience || 0} years</div>
          </div>

          <div>
            <div className="font-medium text-gray-700">Education</div>
            <div className="text-sm text-gray-600">{candidate.education || "N/A"}</div>
          </div>

          <div>
            <div className="font-medium text-gray-700">Notes / Summary</div>
            <div className="text-sm text-gray-600 whitespace-pre-line">{candidate.notes || "—"}</div>
          </div>

          {candidate.resume && (
            <div>
              <div className="font-medium text-gray-700">Resume</div>
              <div className="text-sm text-gray-600">
                <a href={candidate.resume} className="text-indigo-600 underline" target="_blank" rel="noreferrer">Open resume</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}