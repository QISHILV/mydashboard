import React from "react";
import { ThumbnailPreview } from "./ThumbnailPreview";
import type { Template } from "./DashboardContext";

const categoryColors: Record<string, string> = {
  "3C场景": "bg-violet-100 text-violet-700",
  "医疗设备": "bg-rose-100 text-rose-700",
  "智慧工厂": "bg-amber-100 text-amber-700",
  "能源管理": "bg-emerald-100 text-emerald-700",
  "通用": "bg-slate-100 text-slate-600",
};

interface TemplateCardProps {
  template: Template;
  onUse: (template: Template) => void;
}

export function TemplateCard({ template, onUse }: TemplateCardProps) {
  const createdDate = new Date(template.createdAt);
  const dateStr = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, "0")}-${String(createdDate.getDate()).padStart(2, "0")}`;

  const colorClass = categoryColors[template.category] || "bg-slate-100 text-slate-600";

  return (
    <div className="w-[260px] bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2">
        <h4 className="truncate text-slate-800 flex-1" title={template.name}>
          {template.name}
        </h4>
        <span className={`px-2 py-0.5 rounded-full text-[11px] shrink-0 ${colorClass}`}>
          {template.category}
        </span>
      </div>

      {/* Thumbnail */}
      <div className="h-[150px]">
        <ThumbnailPreview type={template.thumbnail} />
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-slate-100">
        <p className="text-[12px] text-slate-500 mb-2 line-clamp-2">{template.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">创建于 {dateStr}</span>
          <button
            onClick={() => onUse(template)}
            className="px-3 py-1 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
          >
            使用模板
          </button>
        </div>
      </div>
    </div>
  );
}
