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
  X,
  Upload,
  Star,
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

  const [activeTab, setActiveTab] = useState<"dashboards" | "templates" | "market">("dashboards");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProjectFilter, setActiveProjectFilter] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      // 模拟解析模板文件
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const templateData = JSON.parse(content);
          setImportPreview(templateData);
        } catch (error) {
          alert('无效的模板文件');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportTemplate = () => {
    // 模拟导入模板
    setShowImportModal(false);
    setImportFile(null);
    setImportPreview(null);
    alert('模板导入成功');
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-800">我的模板</h2>
        <p className="text-[14px] text-slate-500 mt-1">
          管理个人模板，可使用模板和导入其他模板
        </p>
      </div>

      {/* Search and import button */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索模板..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
          />
        </div>
        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-blue-300 text-blue-500 text-[13px] hover:bg-blue-50 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          导入模板
        </button>
      </div>

      {/* Template grid */}
      <div className="flex-1 overflow-y-auto">
        {(() => {
          const filteredTemplates = templates.filter((template) =>
            searchQuery ? template.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
          );
          
          if (filteredTemplates.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <LayoutTemplate className="w-16 h-16 text-slate-200 mb-4" />
                <p className="text-[14px]">暂无模板</p>
                <p className="text-[13px] mt-1">您可以从模板集市下载模板或导入其他模板</p>
              </div>
            );
          }
          
          return (
            <div className="grid grid-cols-[repeat(auto-fill,280px)] gap-5">
              {filteredTemplates.map((template) => {
                const dateStr = new Date(template.createdAt).toLocaleDateString("zh-CN");
                return (
                  <div key={template.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    {/* Header */}
                    <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2">
                      <h4 className="truncate flex-1 text-[14px] text-slate-800" title={template.name}>
                        {template.name}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[11px] bg-blue-50 text-blue-600 shrink-0">
                        模板
                      </span>
                    </div>

                    {/* Thumbnail */}
                    <div className="h-[120px] overflow-hidden flex-shrink-0">
                      <ThumbnailPreview type={template.thumbnail} />
                    </div>

                    {/* Footer */}
                    <div className="px-3 py-2.5 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] text-slate-400">{template.category}</span>
                        <span className="text-[11px] text-slate-400">{dateStr}</span>
                      </div>
                      <button
                        onClick={() => alert('模板使用功能开发中')}
                        className="px-3 py-1 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
                      >
                        使用模板
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl w-[500px] max-w-[90vw] max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-800">导入模板</h3>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportPreview(null);
                }}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">上传模板文件</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                     onClick={() => document.getElementById('template-upload')?.click()}>
                  <LayoutTemplate className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">点击或拖拽文件到此处上传</p>
                  <p className="text-sm text-slate-400">支持 .json 格式的模板文件</p>
                  <input
                    id="template-upload"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              {importPreview && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">模板预览</label>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">模板名称</p>
                        <p className="text-sm font-medium text-slate-800">{importPreview.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">分类</p>
                        <p className="text-sm font-medium text-slate-800">{importPreview.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">创建时间</p>
                        <p className="text-sm font-medium text-slate-800">{new Date(importPreview.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">组件数量</p>
                        <p className="text-sm font-medium text-slate-800">{importPreview.config?.components?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                    setImportPreview(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleImportTemplate}
                  disabled={!importFile}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  导入模板
                </button>
              </div>
            </div>
          </div>
        </div>
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
  onImportClick,
}: {
  templates: { id: string; name: string; description: string; thumbnail: "chart" | "table" | "kpi" | "mixed"; category: string; createdAt: string; fromDashboardId?: string; published?: boolean }[];
  dashboards: Dashboard[];
  toggleTemplatePublish: (id: string) => void;
  removeTemplate: (id: string) => void;
  onImportClick: () => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const userTemplates = templates.filter((t) => t.fromDashboardId);

  const getDashboardName = (dashboardId?: string) => {
    if (!dashboardId) return "未知";
    return dashboards.find((d) => d.id === dashboardId)?.name || "已删除的仪表盘";
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-medium text-slate-800">我的模板</h3>
        <button
          onClick={onImportClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-blue-300 text-blue-500 text-[13px] hover:bg-blue-50 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          导入模板
        </button>
      </div>

      {userTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <LayoutTemplate className="w-16 h-16 text-slate-200 mb-4" />
          <p className="text-[14px]">暂无自定义模板</p>
          <p className="text-[13px] mt-1">在「仪表盘列表」中将仪表盘设为模板后，即可在此管理</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[repeat(auto-fill,300px)] gap-5">
            {userTemplates.map((tpl) => {
              const dateStr = new Date(tpl.createdAt).toLocaleDateString("zh-CN");
              return (
                <div key={tpl.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  {/* Thumbnail */}
                  <div className="h-[140px] overflow-hidden flex-shrink-0">
                    <ThumbnailPreview type={tpl.thumbnail} />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-[14px] font-medium text-slate-800 mb-1">{tpl.name}</h4>
                    <p className="text-[12px] text-slate-500 mb-3 line-clamp-2">{tpl.description}</p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600">
                        {tpl.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        tpl.published
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {tpl.published ? "已上架" : "未上架"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-4">
                      <span>来源: {getDashboardName(tpl.fromDashboardId)}</span>
                      <span>{dateStr}</span>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => alert('模板使用功能开发中')}
                        className="flex-1 py-2 rounded-lg bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
                      >
                        使用模板
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
                        className="flex-1 py-2 rounded-lg border border-blue-300 text-blue-500 text-[13px] hover:bg-blue-50 transition-colors"
                      >
                        下载模板
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => toggleTemplatePublish(tpl.id)}
                        className={`text-[12px] px-2 py-1 rounded transition-colors ${
                          tpl.published
                            ? "hover:bg-amber-50 text-amber-600"
                            : "hover:bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {tpl.published ? "下架" : "上架"}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(tpl.id)}
                        className="text-[12px] px-2 py-1 rounded hover:bg-red-50 text-red-500 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

/* ===== Template Market Tab ===== */
function TemplateMarketTab() {
  // 模拟模板市场数据
  const marketTemplates = [
    {
      id: "market-1",
      name: "销售分析仪表盘",
      description: "全面分析销售数据，包括销售额、订单量、客户分析等",
      category: "通用",
      thumbnail: "chart" as const,
      rating: 4.8,
      downloads: 1250,
      author: "系统管理员",
      createdAt: "2026-01-15",
    },
    {
      id: "market-2",
      name: "财务报表模板",
      description: "财务数据可视化，包括收入、支出、利润分析",
      category: "通用",
      thumbnail: "table" as const,
      rating: 4.6,
      downloads: 980,
      author: "财务部门",
      createdAt: "2026-01-20",
    },
    {
      id: "market-3",
      name: "生产监控面板",
      description: "生产设备状态监控，实时数据展示",
      category: "智慧工厂",
      thumbnail: "kpi" as const,
      rating: 4.9,
      downloads: 750,
      author: "生产部门",
      createdAt: "2026-01-25",
    },
    {
      id: "market-4",
      name: "能源消耗分析",
      description: "能源使用情况分析，节能优化建议",
      category: "能源管理",
      thumbnail: "mixed" as const,
      rating: 4.7,
      downloads: 620,
      author: "能源管理部",
      createdAt: "2026-01-30",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-[14px] font-medium text-slate-800">模板集市</h3>
        <p className="text-[13px] text-slate-500 mt-1">
          浏览和下载官方及社区共享的仪表盘模板，一键使用模板快速创建仪表盘
        </p>
      </div>

      {/* Search */}
      <div className="relative w-[300px] mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          placeholder="搜索模板..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
        />
      </div>

      {/* Template grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[repeat(auto-fill,300px)] gap-5">
          {marketTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {/* Thumbnail */}
              <div className="h-[140px] overflow-hidden flex-shrink-0">
                <ThumbnailPreview type={template.thumbnail} />
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h4 className="text-[14px] font-medium text-slate-800 mb-1">{template.name}</h4>
                <p className="text-[12px] text-slate-500 mb-3 line-clamp-2">{template.description}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600">
                    {template.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[12px] text-slate-600">{template.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-4">
                  <span>作者: {template.author}</span>
                  <span>下载: {template.downloads}</span>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => alert('模板使用功能开发中')}
                    className="flex-1 py-2 rounded-lg bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
                  >
                    使用模板
                  </button>
                  <button
                    onClick={() => alert('模板下载功能开发中')}
                    className="flex-1 py-2 rounded-lg border border-blue-300 text-blue-500 text-[13px] hover:bg-blue-50 transition-colors"
                  >
                    下载模板
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
