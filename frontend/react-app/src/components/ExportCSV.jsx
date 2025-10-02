import React from "react";
import { Download } from "lucide-react";

function toCsv(data = []) {
  if (!data.length) return "";
  const keys = Array.from(new Set(data.flatMap((d) => Object.keys(d))));
  const rows = [keys.join(",")].concat(
    data.map((d) => keys.map((k) => {
      const val = d[k];
      if (Array.isArray(val)) return `"${val.join(";")}"`;
      if (val === null || val === undefined) return "";
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(","))
  );
  return rows.join("\n");
}

export default function ExportCSV({ data = [], filename = "export.csv" }) {
  function download() {
    const csv = toCsv(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button onClick={download} className="flex items-center gap-2 bg-white border px-3 py-2 rounded-md hover:shadow">
      <Download className="w-4 h-4" /> Export CSV
    </button>
  );
}