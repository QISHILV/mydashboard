import React, { useState } from "react";
import {
  BarChart3,
  Info,
  Table2,
  Puzzle,
  Image,
  Zap,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import { ChartMiniPreview, chartTypes, type ChartTypeInfo } from "./ChartThumbnails";

const categories = [
  { id: "chart", label: "图表", icon: BarChart3 },
  { id: "info", label: "信息", icon: Info },
  { id: "table", label: "列表", icon: Table2 },
  { id: "widget", label: "小组件", icon: Puzzle },
  { id: "image", label: "图片", icon: Image },
  { id: "icon", label: "图标", icon: Zap },
];

const chartSubCategories = ["所有", "柱状图", "折线图", "饼图", "散点图", "地图", "更多"];

interface LeftPanelProps {
  onAddChart: (chartType: string) => void;
}

export function LeftPanel({ onAddChart }: LeftPanelProps) {
  const [activeCategory, setActiveCategory] = useState("chart");
  const [activeSubCategory, setActiveSubCategory] = useState("所有");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCharts = chartTypes.filter((c) => {
    if (activeSubCategory !== "所有" && c.category !== activeSubCategory) return false;
    if (searchQuery && !c.name.includes(searchQuery)) return false;
    return true;
  });

  return (
    <div className="flex h-full">
      {/* Icon sidebar */}
      <div className="w-[52px] bg-white border-r border-slate-100 flex flex-col items-center py-4 gap-[calc(var(--spacing)*1.5)] shrink-0">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${isActive ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"
                }`}
              title={cat.label}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] leading-none">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Component list panel */}
      <div className="w-[208px] bg-white border-r border-slate-200 flex flex-col overflow-hidden">
        {activeCategory === "chart" ? (
          <>
            {/* Header */}
            <div className="px-3 pt-3 pb-2 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-slate-800">组件</span>
                <div className="flex items-center gap-1">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索组件"
                      className="w-[90px] h-6 pl-5 pr-1.5 text-[11px] bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                  {/* View toggle */}
                  <button
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50"
                      }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50"
                      }`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sub-categories */}
              <div className="flex flex-wrap gap-1">
                {chartSubCategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubCategory(sub)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${activeSubCategory === sub
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50"
                      }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart list */}
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              <div className="flex flex-col gap-3">
                {filteredCharts.map((chart) => (
                  <div key={chart.id}>
                    <p className="text-[11px] text-slate-400 mb-1.5">{chart.name}</p>
                    <button
                      onClick={() => onAddChart(chart.type)}
                      className="w-full hover:ring-2 hover:ring-blue-300 rounded-lg transition-all active:scale-[0.98]"
                    >
                      <ChartMiniPreview type={chart.type} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-[13px]">
            <div className="text-center">
              <p>{categories.find((c) => c.id === activeCategory)?.label}组件</p>
              <p className="text-[11px] mt-1 text-slate-300">即将上线</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
