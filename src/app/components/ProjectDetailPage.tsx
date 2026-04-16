import React from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useDashboards } from "./DashboardContext";

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, getDashboardsByProject, addDashboard } = useDashboards();

  const project = projects.find((p) => p.id === projectId);
  const dashboards = projectId ? getDashboardsByProject(projectId) : [];

  if (!project) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400">
        <p className="text-[18px] mb-4">项目不存在</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          返回全部仪表盘
        </button>
      </div>
    );
  }

  const handleNewDashboard = () => {
    const id = addDashboard(project.id, "未命名仪表盘");
    navigate(`/editor/${id}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate("/")}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-slate-800">{project.name}</h2>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-500">
            {dashboards.length} 个仪表盘
          </span>
        </div>
        <p className="text-[14px] text-slate-500 ml-9">
          管理该项目下的所有仪表盘
        </p>
      </div>

      {/* Dashboard grid */}
      <div className="grid grid-cols-[repeat(auto-fill,260px)] gap-5 items-stretch">
        {/* New Dashboard card */}
        <button
          onClick={handleNewDashboard}
          className="rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-500 group min-h-[260px]"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-[14px]">新建仪表盘</span>
        </button>

        {/* Existing dashboards */}
        {dashboards.map((db) => (
          <DashboardCard key={db.id} dashboard={db} />
        ))}
      </div>
    </div>
  );
}