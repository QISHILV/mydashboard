import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  MoreHorizontal,
  ArrowUpCircle,
  ArrowDownCircle,
  Download,
  Trash2,
  LayoutTemplate,
  FileBarChart,
  Eye,
  Pencil,
} from "lucide-react";
import { ThumbnailPreview } from "./ThumbnailPreview";
import { useDashboards, type Dashboard } from "./DashboardContext";

export function TemplateConfigPage() {
  const {
    dashboards,
    projects,
    templates,
    setAsTemplate,
    removeTemplate,
    toggleTemplatePublish,
  } = useDashboards();

  const [activeTab, setActiveTab] = useState<"dashboards" | "templates">("dashboards");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProjectFilter, setActiveProjectFilter] = useState<string | null>(null);

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-slate-800">模板配置</h2>
        <p className="text-[14px] text-slate-500 mt-1">
          管理仪表盘模板，设置模板上架与下架
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5 w-fit mb-5">
        <button
          onClick={() => setActiveTab("dashboards")}
          className={`px-4 py-2 rounded-md text-[13px] transition-all ${
            activeTab === "dashboards"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          仪表盘列表
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2 rounded-md text-[13px] transition-all ${
            activeTab === "templates"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          模板设置
        </button>
      </div>

      {activeTab === "dashboards" ? (
        <DashboardListTab
          dashboards={dashboards}
          projects={projects}
          templates={templates}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeProjectFilter={activeProjectFilter}
          setActiveProjectFilter={setActiveProjectFilter}
          setAsTemplate={setAsTemplate}
        />
      ) : (
        <TemplateSettingsTab
          templates={templates}
          dashboards={dashboards}
          toggleTemplatePublish={toggleTemplatePublish}
          removeTemplate={removeTemplate}
        />
      )}
    </div>
  );
}

/* ===== Dashboard List Tab ===== */
function DashboardListTab({
  dashboards,
  projects,
  templates,
  searchQuery,
  setSearchQuery,
  activeProjectFilter,
  setActiveProjectFilter,
  setAsTemplate,
}: {
  dashboards: Dashboard[];
  projects: { id: string; name: string; createdAt: string }[];
  templates: { id: string; fromDashboardId?: string }[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeProjectFilter: string | null;
  setActiveProjectFilter: (id: string | null) => void;
  setAsTemplate: (dashboardId: string) => void;
}) {
  const filtered = dashboards
    .filter((d) => {
      if (activeProjectFilter === "__none__") return d.projectId === null;
      if (activeProjectFilter) return d.projectId === activeProjectFilter;
      return true;
    })
    .filter((d) =>
      searchQuery ? d.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return "未归属项目";
    return projects.find((p) => p.id === projectId)?.name || "未知项目";
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Project filter tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setActiveProjectFilter(null)}
          className={`px-3 py-1.5 rounded-full text-[13px] transition-all ${
            activeProjectFilter === null
              ? "bg-blue-500 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
          }`}
        >
          全部
          <span className={`ml-1 text-[11px] ${activeProjectFilter === null ? "text-blue-100" : "text-slate-400"}`}>
            {dashboards.length}
          </span>
        </button>
        {projects.map((proj) => {
          const count = dashboards.filter((d) => d.projectId === proj.id).length;
          return (
            <button
              key={proj.id}
              onClick={() => setActiveProjectFilter(proj.id)}
              className={`px-3 py-1.5 rounded-full text-[13px] transition-all ${
                activeProjectFilter === proj.id
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
              }`}
            >
              {proj.name}
              <span className={`ml-1 text-[11px] ${activeProjectFilter === proj.id ? "text-blue-100" : "text-slate-400"}`}>
                {count}
              </span>
            </button>
          );
        })}
        {(() => {
          const noProjectCount = dashboards.filter((d) => d.projectId === null).length;
          return noProjectCount > 0 ? (
            <button
              onClick={() => setActiveProjectFilter("__none__")}
              className={`px-3 py-1.5 rounded-full text-[13px] transition-all ${
                activeProjectFilter === "__none__"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
              }`}
            >
              未归属
              <span className={`ml-1 text-[11px] ${activeProjectFilter === "__none__" ? "text-blue-100" : "text-slate-400"}`}>
                {noProjectCount}
              </span>
            </button>
          ) : null;
        })()}
      </div>

      {/* Search */}
      <div className="relative w-[300px] mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索仪表盘..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
        />
      </div>

      {/* Dashboard grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <FileBarChart className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-[14px]">暂无匹配的仪表盘</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[repeat(auto-fill,280px)] gap-5">
            {filtered.map((db) => {
              const isTemplate = templates.some((t) => t.fromDashboardId === db.id);
              const dateStr = new Date(db.createdAt).toLocaleDateString("zh-CN");
              return (
                <DashboardItemCard
                  key={db.id}
                  dashboard={db}
                  projectName={getProjectName(db.projectId)}
                  isTemplate={isTemplate}
                  onSetAsTemplate={() => setAsTemplate(db.id)}
                  dateStr={dateStr}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardItemCard({
  dashboard,
  projectName,
  isTemplate,
  onSetAsTemplate,
  dateStr,
}: {
  dashboard: Dashboard;
  projectName: string;
  isTemplate: boolean;
  onSetAsTemplate: () => void;
  dateStr: string;
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2">
        <h4 className="truncate flex-1 text-[14px] text-slate-800" title={dashboard.name}>
          {dashboard.name}
        </h4>
        {isTemplate && (
          <span className="px-1.5 py-0.5 rounded text-[11px] bg-blue-50 text-blue-600 shrink-0">
            已设为模板
          </span>
        )}
      </div>

      {/* Thumbnail */}
      <div className="h-[120px] overflow-hidden flex-shrink-0">
        <ThumbnailPreview type={dashboard.thumbnail} />
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-slate-400">{projectName}</span>
          <span className="text-[11px] text-slate-400">{dateStr}</span>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-md hover:bg-slate-100 transition-colors text-slate-500"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
              <button
                onClick={() => {
                  window.open(`${import.meta.env.BASE_URL}preview/${dashboard.id}`, "_blank");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[13px]">预览</span>
              </button>
              <button
                onClick={() => {
                  navigate(`/editor/${dashboard.id}`);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span className="text-[13px]">编辑</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  onSetAsTemplate();
                  setMenuOpen(false);
                }}
                disabled={isTemplate}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span className="text-[13px]">{isTemplate ? "已设为模板" : "设为模板"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== Template Settings Tab ===== */
function TemplateSettingsTab({
  templates,
  dashboards,
  toggleTemplatePublish,
  removeTemplate,
}: {
  templates: { id: string; name: string; description: string; thumbnail: "chart" | "table" | "kpi" | "mixed"; category: string; createdAt: string; fromDashboardId?: string; published?: boolean }[];
  dashboards: Dashboard[];
  toggleTemplatePublish: (id: string) => void;
  removeTemplate: (id: string) => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const userTemplates = templates.filter((t) => t.fromDashboardId);

  const getDashboardName = (dashboardId?: string) => {
    if (!dashboardId) return "未知";
    return dashboards.find((d) => d.id === dashboardId)?.name || "已删除的仪表盘";
  };

  if (userTemplates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <LayoutTemplate className="w-16 h-16 text-slate-200 mb-4" />
        <p className="text-[14px]">暂无自定义模板</p>
        <p className="text-[13px] mt-1">在「仪表盘列表」中将仪表盘设为模板后，即可在此管理</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-[13px] font-medium text-slate-600">模板名称</th>
              <th className="text-left px-4 py-3 text-[13px] font-medium text-slate-600">来源仪表盘</th>
              <th className="text-left px-4 py-3 text-[13px] font-medium text-slate-600">分类</th>
              <th className="text-left px-4 py-3 text-[13px] font-medium text-slate-600">创建时间</th>
              <th className="text-center px-4 py-3 text-[13px] font-medium text-slate-600">状态</th>
              <th className="text-center px-4 py-3 text-[13px] font-medium text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {userTemplates.map((tpl) => {
              const dateStr = new Date(tpl.createdAt).toLocaleDateString("zh-CN");
              return (
                <tr key={tpl.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <LayoutTemplate className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-[13px] text-slate-800 truncate max-w-[200px]">{tpl.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-slate-500">{getDashboardName(tpl.fromDashboardId)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-slate-500">{tpl.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-slate-400">{dateStr}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] ${
                      tpl.published
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${tpl.published ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {tpl.published ? "已上架" : "未上架"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => toggleTemplatePublish(tpl.id)}
                        className={`p-1.5 rounded-md transition-colors ${
                          tpl.published
                            ? "hover:bg-amber-50 text-amber-600"
                            : "hover:bg-emerald-50 text-emerald-600"
                        }`}
                        title={tpl.published ? "下架" : "上架"}
                      >
                        {tpl.published ? (
                          <ArrowDownCircle className="w-4 h-4" />
                        ) : (
                          <ArrowUpCircle className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(tpl, null, 2)], { type: "application/json" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${tpl.name}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors"
                        title="导出"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(tpl.id)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors"
                        title="删除模板"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[400px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-slate-800 mb-2">确认删除</h3>
            <p className="text-slate-500 text-[14px] mb-6">
              确定要删除此模板吗？删除后将无法恢复。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  removeTemplate(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
