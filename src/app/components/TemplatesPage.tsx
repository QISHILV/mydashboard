import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Folder, Search } from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import { useDashboards, type Template, type TemplateCategory } from "./DashboardContext";

export function TemplatesPage() {
  const { templates, templateCategories, projects, addDashboard } = useDashboards();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("全部");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = templates
    .filter((tpl) => activeCategory === "全部" || tpl.category === activeCategory)
    .filter((tpl) =>
      searchQuery
        ? tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tpl.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const sortedProjects = [...projects].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const categoryCounts = templateCategories.reduce(
    (acc, cat) => {
      acc[cat] =
        cat === "全部"
          ? templates.length
          : templates.filter((t) => t.category === cat).length;
      return acc;
    },
    {} as Record<TemplateCategory, number>
  );

  const handleUseTemplate = (template: Template) => {
    if (projects.length === 0) {
      const id = addDashboard(null, `${template.name} - 副本`, template.thumbnail);
      navigate(`/editor/${id}`);
    } else if (projects.length === 1) {
      const id = addDashboard(projects[0].id, `${template.name} - 副本`, template.thumbnail);
      navigate(`/editor/${id}`);
    } else {
      setSelectedTemplate(template);
    }
  };

  const handlePickProject = (projectId: string) => {
    if (!selectedTemplate) return;
    const id = addDashboard(projectId, `${selectedTemplate.name} - 副本`, selectedTemplate.thumbnail);
    setSelectedTemplate(null);
    navigate(`/editor/${id}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-slate-800">模板市场</h2>
        <p className="text-[14px] text-slate-500 mt-1">
          选择预设模板快速创建仪表盘，按行业场景分类浏览
        </p>
      </div>

      {/* Search + Category bar */}
      <div className="mb-6 flex flex-col gap-4">
        {/* Search */}
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索模板..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {templateCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] transition-all ${
                activeCategory === cat
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
              }`}
            >
              {cat}
              <span
                className={`ml-1.5 text-[11px] ${
                  activeCategory === cat ? "text-blue-100" : "text-slate-400"
                }`}
              >
                {categoryCounts[cat]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Template grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Search className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-[14px]">未找到匹配的模板</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-5">
          {filtered.map((tpl) => (
            <TemplateCard key={tpl.id} template={tpl} onUse={handleUseTemplate} />
          ))}
        </div>
      )}

      {/* Pick project modal */}
      {selectedTemplate && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
          onClick={() => setSelectedTemplate(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[400px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-slate-800 mb-2">选择目标项目</h3>
            <p className="text-slate-500 text-[14px] mb-4">
              将模板「{selectedTemplate.name}」创建到哪个项目中？
            </p>
            <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
              {sortedProjects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => handlePickProject(proj.id)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-left"
                >
                  <Folder className="w-4 h-4 text-slate-400" />
                  <span className="text-[14px] text-slate-700">{proj.name}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}