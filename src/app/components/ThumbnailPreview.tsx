import React from "react";

interface ThumbnailPreviewProps {
  type: "chart" | "table" | "kpi" | "mixed";
  className?: string;
}

export function ThumbnailPreview({ type, className = "" }: ThumbnailPreviewProps) {
  return (
    <div className={`w-full h-full bg-slate-50 p-3 flex items-center justify-center overflow-hidden ${className}`}>
      {type === "chart" && <ChartThumbnail />}
      {type === "table" && <TableThumbnail />}
      {type === "kpi" && <KPIThumbnail />}
      {type === "mixed" && <MixedThumbnail />}
    </div>
  );
}

function ChartThumbnail() {
  return (
    <div className="w-full h-full flex flex-col gap-1.5">
      <div className="flex gap-1.5 flex-1">
        <div className="flex-1 bg-blue-100 rounded flex items-end p-1.5 gap-0.5">
          {[40, 65, 50, 80, 55, 70, 90].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-blue-400 rounded-t-sm"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex-1 bg-emerald-50 rounded p-1.5 flex items-center justify-center">
          <svg viewBox="0 0 60 60" className="w-full h-full">
            <circle cx="30" cy="30" r="24" fill="none" stroke="#d1fae5" strokeWidth="8" />
            <circle
              cx="30" cy="30" r="24" fill="none" stroke="#34d399" strokeWidth="8"
              strokeDasharray="100 51" strokeLinecap="round"
              transform="rotate(-90 30 30)"
            />
            <circle
              cx="30" cy="30" r="24" fill="none" stroke="#6ee7b7" strokeWidth="8"
              strokeDasharray="40 111" strokeLinecap="round"
              transform="rotate(150 30 30)"
            />
          </svg>
        </div>
      </div>
      <div className="h-5 bg-gray-100 rounded flex items-center px-2 gap-2">
        <div className="w-6 h-2 bg-blue-300 rounded-full" />
        <div className="w-8 h-2 bg-emerald-300 rounded-full" />
        <div className="w-5 h-2 bg-amber-300 rounded-full" />
      </div>
    </div>
  );
}

function TableThumbnail() {
  return (
    <div className="w-full h-full flex flex-col gap-1">
      <div className="h-5 bg-slate-200 rounded flex items-center px-2 gap-2">
        {[20, 28, 22, 18].map((w, i) => (
          <div key={i} className="h-2 bg-slate-400 rounded-full" style={{ width: `${w}%` }} />
        ))}
      </div>
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} className="h-4 bg-white border border-slate-100 rounded flex items-center px-2 gap-2">
          {[18, 25, 20, 16].map((w, i) => (
            <div key={i} className="h-1.5 bg-slate-200 rounded-full" style={{ width: `${w}%` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function KPIThumbnail() {
  return (
    <div className="w-full h-full grid grid-cols-2 gap-1.5">
      {[
        { label: "bg-blue-100", value: "bg-blue-400", accent: "text-blue-500" },
        { label: "bg-emerald-100", value: "bg-emerald-400", accent: "text-emerald-500" },
        { label: "bg-amber-100", value: "bg-amber-400", accent: "text-amber-500" },
        { label: "bg-purple-100", value: "bg-purple-400", accent: "text-purple-500" },
      ].map((item, i) => (
        <div key={i} className={`${item.label} rounded p-2 flex flex-col justify-between`}>
          <div className={`w-8 h-1.5 ${item.value} rounded-full opacity-50`} />
          <div className={`w-12 h-3 ${item.value} rounded-full`} />
          <div className="flex items-center gap-0.5">
            <div className={`w-3 h-1 ${item.value} rounded-full opacity-70`} />
            <svg className={`w-2 h-2 ${item.accent}`} viewBox="0 0 12 12">
              <path d="M2 8L6 4L10 8" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

function MixedThumbnail() {
  return (
    <div className="w-full h-full flex flex-col gap-1.5">
      <div className="flex gap-1.5 h-8">
        {["bg-blue-100", "bg-emerald-100", "bg-amber-100"].map((bg, i) => (
          <div key={i} className={`flex-1 ${bg} rounded p-1 flex flex-col justify-center`}>
            <div className="w-6 h-1 bg-slate-300 rounded-full mb-0.5" />
            <div className="w-10 h-2 bg-slate-400 rounded-full" />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 flex-1">
        <div className="flex-[2] bg-blue-50 rounded p-1.5 flex items-end gap-0.5">
          {[35, 55, 45, 70, 50, 65, 80, 60].map((h, i) => (
            <div key={i} className="flex-1 bg-blue-300 rounded-t-sm" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="flex-1 bg-gray-50 rounded flex flex-col gap-0.5 p-1">
          {[0, 1, 2, 3].map((r) => (
            <div key={r} className="flex-1 bg-white border border-slate-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
