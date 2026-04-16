import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { FileBarChart, Plus, Search, Settings, Upload, X } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useDashboards } from "./DashboardContext";

export function ProjectsPage() {
  const { dashboards, projects, addDashboard } = useDashboards();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");

  const sorted = [...dashboards]
    .filter((d) => {
      if (filterStatus === "published") return d.published;
      if (filterStatus === "draft") return !d.published;
      return true;
    })
    .filter((d) =>
      searchQuery
        ? d.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const publishedCount = dashboards.filter((d) => d.published).length;
  const draftCount = dashboards.filter((d) => !d.published).length;

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return null;
    return projects.find((p) => p.id === projectId)?.name || null;
  };

  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewDashboard = () => {
    const id = addDashboard(null, "未命名仪表盘");
    navigate(`/editor/${id}`);
  };

  const handleImportTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: handle template import
    }
    e.target.value = "";
  };

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-slate-800">全部仪表盘</h2>
          <p className="text-[14px] text-slate-500 mt-1">
            共 {dashboards.length} 个仪表盘，{publishedCount} 个已发布，{draftCount} 个草稿
          </p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          title="系统设置"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {showSettings && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[420px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800">系统设置</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="text-[13px] text-slate-600 mb-3">模板管理</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.zip"
                className="hidden"
                onChange={handleImportTemplate}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition-colors text-[13px]"
              >
                <Upload className="w-4 h-4 text-blue-500" />
                模板导入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar: search + filter */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索仪表盘..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
            />
          </div>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
            {([
              { key: "all", label: "全部" },
              { key: "published", label: "已发布" },
              { key: "draft", label: "草稿" },
            ] as const).map((item) => (
              <button
                key={item.key}
                onClick={() => setFilterStatus(item.key)}
                className={`px-3 py-1.5 rounded-md text-[12px] transition-all ${filterStatus === item.key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sorted.length === 0 && dashboards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <FileBarChart className="w-16 h-16 mb-4 text-slate-200" />
          <p className="text-[14px]">暂无仪表盘，点击左上角「新建仪表盘」开始创建</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Search className="w-12 h-12 mb-4 text-slate-200" />
          <p className="text-[14px]">未找到匹配的仪表盘</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,300px)] gap-6">
          {/* New Dashboard card */}
          <button
            onClick={handleNewDashboard}
            className="rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-500 group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[14px]">新建仪表盘</span>
          </button>

          {sorted.map((db) => {
            const projName = getProjectName(db.projectId);
            return (
              <DashboardCard
                key={db.id}
                dashboard={db}
                projectLabel={projName}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}