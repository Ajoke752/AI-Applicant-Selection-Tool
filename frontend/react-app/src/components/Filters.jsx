import React, { useState } from "react";

export default function Filters({ query, onQuery, requiredSkills, onRequiredSkills, minExp, onMinExp, sortBy, onSortBy }) {
  const [skillsInput, setSkillsInput] = useState("");

  function addSkills() {
    const parts = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    onRequiredSkills(Array.from(new Set([...(requiredSkills || []), ...parts])));
    setSkillsInput("");
  }

  function removeSkill(s) {
    onRequiredSkills((requiredSkills || []).filter((k) => k !== s));
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex-1">
          <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search name, email, notes..." className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div className="flex gap-2 items-center">
          <select value={sortBy} onChange={(e) => onSortBy(e.target.value)} className="px-2 py-2 border rounded-md">
            <option value="score">Sort: Score (desc)</option>
            <option value="experience">Sort: Experience (desc)</option>
            <option value="name">Sort: Name (A→Z)</option>
          </select>

          <div className="flex items-center gap-2">
            <input type="number" min="0" value={minExp} onChange={(e) => onMinExp(Number(e.target.value || 0))} placeholder="Min years" className="w-24 px-2 py-2 border rounded-md" />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex gap-2">
          <input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="Add required skills, comma separated" className="flex-1 px-3 py-2 border rounded-md" />
          <button onClick={addSkills} className="px-3 py-2 bg-blue-600 text-white rounded-md">Add</button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {(requiredSkills || []).map((s) => (
            <div key={s} className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full text-sm">
              <span>{s}</span>
              <button onClick={() => removeSkill(s)} className="text-xs text-red-500">x</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}