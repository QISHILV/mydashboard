import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import {
  ChevronDown,
  Database,
  FileText,
} from "lucide-react";

export function DataIntegrationLayout() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Top Navigation */}
      <div className="h-14 px-6 flex items-center justify-between border-b border-slate-200 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Database className="w-4 h-4 text-white" />
          </div>
          <span className="text-[15px] text-slate-800 tracking-tight">
            数据集成平台
          </span>
        </div>

        {/* Back Button and User Profile */}
        <div className="flex items-center gap-4">
          {/* Back to myview Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <span>返回myview</span>
          </button>

          {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[12px]">
              U
            </div>
            <span className="text-[13px] text-slate-600">用户</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
          </button>
          
          {/* User Menu */}
          {userMenuOpen && (
            <div ref={userMenuRef} className="absolute right-0 top-[calc(100%+4px)] bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 min-w-[180px]">
              <button
                onClick={() => navigate("/data-config/data-models")}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <Database className="w-3.5 h-3.5" />
                <span>数据集成平台</span>
              </button>
              <button
                onClick={() => {
                  // 退出登录逻辑
                  navigate("/");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>退出登录</span>
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
