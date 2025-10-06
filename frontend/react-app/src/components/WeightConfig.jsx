import React, { useState } from "react";

export default function WeightConfig({ onApply, onClose }) {
  const [weights, setWeights] = useState({
    skills: 0.25,
    experience: 0.2,
    education: 0.15,
    assessment: 0.25,
    portfolio: 0.1,
    cover_letter: 0.05,
  });

  function handleChange(key, value) {
    setWeights((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  }

  function handleApply() {
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (Math.abs(total - 1.0) > 0.01) {
      alert("Weights must sum to 1.0");
      return;
    }
    onApply(weights);
    onClose();
  }

  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Configure Ranking Weights</h2>
        <p className="text-sm text-gray-600 mb-4">
          Adjust the importance of each criterion. Total must equal 1.0.
        </p>

        <div className="space-y-3">
          {Object.entries(weights).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium capitalize flex-1">
                {key.replace("_", " ")}
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-20 px-2 py-1 border rounded-md text-sm"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Total:</span>
            <span
              className={
                Math.abs(total - 1.0) < 0.01
                  ? "text-green-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={Math.abs(total - 1.0) > 0.01}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
