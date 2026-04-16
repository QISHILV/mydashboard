import React from "react";

export interface ChartTypeInfo {
  id: string;
  name: string;
  category: string;
  type: "bar" | "horizontal-bar" | "bar-line" | "capsule-bar" | "line" | "area" | "pie" | "donut" | "scatter" | "radar" | "map";
}

export const chartTypes: ChartTypeInfo[] = [
  { id: "bar", name: "柱状图", category: "柱状图", type: "bar" },
  { id: "horizontal-bar", name: "横向柱状图", category: "柱状图", type: "horizontal-bar" },
  { id: "bar-line", name: "柱状图 & 折线图", category: "柱状图", type: "bar-line" },
  { id: "capsule-bar", name: "胶囊柱图", category: "柱状图", type: "capsule-bar" },
  { id: "line", name: "折线图", category: "折线图", type: "line" },
  { id: "area", name: "面积图", category: "折线图", type: "area" },
  { id: "pie", name: "饼图", category: "饼图", type: "pie" },
  { id: "donut", name: "环形图", category: "饼图", type: "donut" },
  { id: "scatter", name: "散点图", category: "散点图", type: "scatter" },
  { id: "radar", name: "雷达图", category: "散点图", type: "radar" },
];

interface ChartMiniPreviewProps {
  type: ChartTypeInfo["type"];
}

export function ChartMiniPreview({ type }: ChartMiniPreviewProps) {
  return (
    <div className="w-full aspect-[16/10] bg-[#1a1a2e] rounded-lg p-2 flex items-end justify-center overflow-hidden relative">
      {/* Traffic light dots */}
      <div className="absolute top-1.5 left-2 flex gap-1">
        <span className="w-[5px] h-[5px] rounded-full bg-red-400" />
        <span className="w-[5px] h-[5px] rounded-full bg-yellow-400" />
        <span className="w-[5px] h-[5px] rounded-full bg-green-400" />
      </div>

      {type === "bar" && <BarPreview />}
      {type === "horizontal-bar" && <HorizontalBarPreview />}
      {type === "bar-line" && <BarLinePreview />}
      {type === "capsule-bar" && <CapsuleBarPreview />}
      {type === "line" && <LinePreview />}
      {type === "area" && <AreaPreview />}
      {type === "pie" && <PiePreview />}
      {type === "donut" && <DonutPreview />}
      {type === "scatter" && <ScatterPreview />}
      {type === "radar" && <RadarPreview />}
    </div>
  );
}

function BarPreview() {
  const colors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6"];
  const heights = [55, 75, 45, 85, 60, 70];
  return (
    <div className="flex items-end gap-[3px] h-[70%] w-full px-1">
      {heights.map((h, i) => (
        <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: colors[i % colors.length] }} />
      ))}
    </div>
  );
}

function HorizontalBarPreview() {
  const widths = [80, 60, 90, 50, 70];
  const colors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6"];
  return (
    <div className="flex flex-col gap-[3px] w-full h-[75%] px-1 justify-center">
      {widths.map((w, i) => (
        <div key={i} className="h-[14%] rounded-r-sm" style={{ width: `${w}%`, backgroundColor: colors[i] }} />
      ))}
    </div>
  );
}

function BarLinePreview() {
  const heights = [50, 70, 40, 80, 55, 65];
  return (
    <div className="relative flex items-end gap-[3px] h-[70%] w-full px-1">
      {heights.map((h, i) => (
        <div key={i} className="flex-1 bg-indigo-500 rounded-t-sm" style={{ height: `${h}%` }} />
      ))}
      <svg className="absolute inset-0" viewBox="0 0 100 60" preserveAspectRatio="none">
        <polyline
          points="8,35 25,20 42,40 58,15 75,30 92,22"
          fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function CapsuleBarPreview() {
  const heights = [45, 65, 55, 80, 50, 70, 60];
  const colors = ["#6366f1", "#8b5cf6", "#a78bfa", "#6366f1", "#8b5cf6", "#a78bfa", "#6366f1"];
  return (
    <div className="flex items-end gap-[2px] h-[70%] w-full px-1">
      {heights.map((h, i) => (
        <div key={i} className="flex-1 rounded-full" style={{ height: `${h}%`, backgroundColor: colors[i] }} />
      ))}
    </div>
  );
}

function LinePreview() {
  return (
    <div className="w-full h-[75%] flex items-center justify-center px-1">
      <svg viewBox="0 0 100 50" className="w-full h-full">
        <polyline points="5,40 20,25 35,35 50,15 65,28 80,10 95,20" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
        <polyline points="5,35 20,30 35,22 50,30 65,18 80,25 95,15" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function AreaPreview() {
  return (
    <div className="w-full h-[75%] flex items-center justify-center px-1">
      <svg viewBox="0 0 100 50" className="w-full h-full">
        <defs>
          <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <polygon points="5,40 20,25 35,30 50,15 65,22 80,10 95,18 95,48 5,48" fill="url(#areaGrad)" />
        <polyline points="5,40 20,25 35,30 50,15 65,22 80,10 95,18" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function PiePreview() {
  return (
    <div className="w-full h-[75%] flex items-center justify-center">
      <svg viewBox="0 0 40 40" className="w-[60%] h-[60%]">
        <circle cx="20" cy="20" r="18" fill="#6366f1" />
        <path d="M20,20 L20,2 A18,18 0 0,1 37,25 Z" fill="#f59e0b" />
        <path d="M20,20 L37,25 A18,18 0 0,1 10,35 Z" fill="#10b981" />
      </svg>
    </div>
  );
}

function DonutPreview() {
  return (
    <div className="w-full h-[75%] flex items-center justify-center">
      <svg viewBox="0 0 40 40" className="w-[60%] h-[60%]">
        <circle cx="20" cy="20" r="15" fill="none" stroke="#6366f1" strokeWidth="6" strokeDasharray="60 34.27" strokeDashoffset="0" />
        <circle cx="20" cy="20" r="15" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="20 74.27" strokeDashoffset="-60" />
        <circle cx="20" cy="20" r="15" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray="14.27 80" strokeDashoffset="-80" />
      </svg>
    </div>
  );
}

function ScatterPreview() {
  const points = [[15,35],[25,20],[35,30],[45,15],[55,25],[65,10],[75,20],[85,30],[30,40],[50,35],[70,15]];
  return (
    <div className="w-full h-[75%] flex items-center justify-center px-1">
      <svg viewBox="0 0 100 50" className="w-full h-full">
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={i % 2 === 0 ? "#6366f1" : "#f59e0b"} opacity="0.8" />
        ))}
      </svg>
    </div>
  );
}

function RadarPreview() {
  return (
    <div className="w-full h-[75%] flex items-center justify-center">
      <svg viewBox="0 0 60 60" className="w-[65%] h-[65%]">
        <polygon points="30,5 55,22 48,50 12,50 5,22" fill="none" stroke="#334155" strokeWidth="0.5" />
        <polygon points="30,15 45,25 40,42 20,42 15,25" fill="none" stroke="#334155" strokeWidth="0.5" />
        <polygon points="30,10 50,23 44,46 16,46 10,23" fill="#6366f1" fillOpacity="0.3" stroke="#6366f1" strokeWidth="1" />
        <polygon points="30,18 42,26 38,40 22,40 18,26" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="1" />
      </svg>
    </div>
  );
}
