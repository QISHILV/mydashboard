import React from "react";
import { useParams, useNavigate } from "react-router";
import { useDashboards } from "./DashboardContext";

export function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dashboards } = useDashboards();
  const dashboard = dashboards.find((d) => d.id === id);

  if (!dashboard || !dashboard.published) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <svg className="w-20 h-20 text-slate-200 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <p className="text-[18px] mb-2">暂不可查看</p>
        <p className="text-[14px] text-slate-400">请联系管理员</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
        <h4 className="text-slate-800">{dashboard.name}</h4>
        <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-100 text-emerald-700">
          已发布
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <p className="text-[16px] mb-2">仪表盘预览</p>
          <p className="text-[13px]">这是「{dashboard.name}」的发布预览页面</p>
        </div>
      </div>
    </div>
  );
}
