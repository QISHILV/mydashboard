import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Pencil,
  MoreHorizontal,
  Eye,
  XCircle,
  Trash2,
  Upload,
  Type,
  FolderInput,
  Folder,
  FileBarChart,
  Check,
  LayoutTemplate,
  Copy,
} from "lucide-react";
import { ThumbnailPreview } from "./ThumbnailPreview";
import { useDashboards, type Dashboard } from "./DashboardContext";

interface DashboardCardProps {
  dashboard: Dashboard;
  projectLabel?: string | null;
}

export function DashboardCard({ dashboard, projectLabel }: DashboardCardProps) {
  const navigate = useNavigate();
  const {
    projects,
    templates,
    deleteDashboard,
    togglePublish,
    renameDashboard,
    moveDashboard,
    setAsTemplate,
    duplicateDashboard,
  } = useDashboards();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveTargetProjectId, setMoveTargetProjectId] = useState<
    string | null
  >(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyName, setCopyName] = useState("");
  const [copyTargetProjectId, setCopyTargetProjectId] = useState<
    string | null
  >(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (showRenameModal) {
      setTimeout(() => renameInputRef.current?.select(), 50);
    }
  }, [showRenameModal]);

  const handleEdit = () => {
    navigate(`/editor/${dashboard.id}`);
  };

  const handlePreview = () => {
    if (dashboard.published && dashboard.publishUrl) {
      window.open(dashboard.publishUrl, "_blank");
    }
    setMenuOpen(false);
  };

  const handleDeleteClick = () => {
    setMenuOpen(false);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteDashboard(dashboard.id);
    setShowDeleteConfirm(false);
  };

  const handleTogglePublish = () => {
    if (dashboard.published) {
      togglePublish(dashboard.id);
      setMenuOpen(false);
    } else {
      setMenuOpen(false);
      setShowPublishConfirm(true);
    }
  };

  const handleConfirmPublish = () => {
    togglePublish(dashboard.id);
    setShowPublishConfirm(false);
  };

  const handleRenameClick = () => {
    setMenuOpen(false);
    setRenameValue(dashboard.name);
    setShowRenameModal(true);
  };

  const handleConfirmRename = () => {
    const name = renameValue.trim();
    if (name && name !== dashboard.name) {
      renameDashboard(dashboard.id, name);
    }
    setShowRenameModal(false);
  };

  const handleMoveClick = () => {
    setMenuOpen(false);
    setMoveTargetProjectId(dashboard.projectId);
    setShowMoveModal(true);
  };

  const handleConfirmMove = () => {
    moveDashboard(dashboard.id, moveTargetProjectId);
    setShowMoveModal(false);
  };

  const handleCopyClick = () => {
    setMenuOpen(false);
    setCopyName(`${dashboard.name} 副本`);
    setCopyTargetProjectId(dashboard.projectId);
    setShowCopyModal(true);
  };

  const handleConfirmCopy = () => {
    const name = copyName.trim();
    if (!name) return;
    duplicateDashboard(dashboard.id, name, copyTargetProjectId);
    setShowCopyModal(false);
  };

  const sortedProjects = [...projects].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const createdDate = new Date(dashboard.createdAt);
  const dateStr = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, "0")}-${String(createdDate.getDate()).padStart(2, "0")}`;

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
        {/* Header - name */}
        <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2">
          <h4
            className="truncate flex-1 text-slate-800"
            title={dashboard.name}
          >
            {dashboard.name}
          </h4>
          {projectLabel && (
            <span
              className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-500 shrink-0 max-w-[80px] truncate"
              title={projectLabel}
            >
              {projectLabel}
            </span>
          )}
        </div>

        {/* Thumbnail */}
        <div
          className="h-[150px] cursor-pointer overflow-hidden flex-shrink-0"
          onClick={handleEdit}
        >
          <ThumbnailPreview type={dashboard.thumbnail} />
        </div>

        {/* Footer - actions + status */}
        <div className="px-3 py-2.5 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span className="text-[13px]">编辑</span>
            </button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-md hover:bg-slate-100 transition-colors text-slate-500"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute left-0 bottom-full mb-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <button
                    onClick={handleRenameClick}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700"
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span className="text-[13px]">修改名称</span>
                  </button>
                  <button
                    onClick={handleMoveClick}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700"
                  >
                    <FolderInput className="w-3.5 h-3.5" />
                    <span className="text-[13px]">移动至项目</span>
                  </button>
                  <button
                    onClick={handleCopyClick}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[13px]">复制</span>
                  </button>
                  <button
                    onClick={() => {
                      setAsTemplate(dashboard.id);
                      setMenuOpen(false);
                    }}
                    disabled={templates.some((t) => t.fromDashboardId === dashboard.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <LayoutTemplate className="w-3.5 h-3.5" />
                    <span className="text-[13px]">
                      {templates.some((t) => t.fromDashboardId === dashboard.id) ? "已设为模板" : "设为模板"}
                    </span>
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={handlePreview}
                    disabled={!dashboard.published}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[13px]">预览</span>
                  </button>
                  <button
                    onClick={handleTogglePublish}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700"
                  >
                    {dashboard.published ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span className="text-[13px]">取消发布</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span className="text-[13px]">发布</span>
                      </>
                    )}
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={handleDeleteClick}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[13px]">删除</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${dashboard.published ? "bg-emerald-500" : "bg-slate-300"}`}
            />
            <span
              className={`text-[12px] ${dashboard.published ? "text-emerald-600" : "text-slate-400"}`}
            >
              {dashboard.published ? "已发布" : "未发布"}
            </span>
          </div>
        </div>
        {/* Date */}
        <div className="px-3 pb-2 text-[11px] text-slate-400">
          创建于 {dateStr}
        </div>
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
          onClick={() => setShowRenameModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[400px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-slate-800 mb-4">修改名称</h3>
            <input
              ref={renameInputRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirmRename();
                if (e.key === "Escape") setShowRenameModal(false);
              }}
              placeholder="请输入仪表盘名称"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 transition-colors mb-5"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmRename}
                disabled={!renameValue.trim()}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move to Project Modal */}
      {showMoveModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
          onClick={() => setShowMoveModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[420px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-slate-800 mb-1">移动至项目</h3>
            <p className="text-[13px] text-slate-500 mb-4">
              选择要将「{dashboard.name}」移动到的目标项目
            </p>
            <div className="flex flex-col gap-1 max-h-[280px] overflow-y-auto mb-5">
              {/* No project option */}
              <button
                onClick={() => setMoveTargetProjectId(null)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all text-left ${
                  moveTargetProjectId === null
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <FileBarChart
                  className={`w-4 h-4 shrink-0 ${moveTargetProjectId === null ? "text-blue-600" : "text-slate-400"}`}
                />
                <span
                  className={`text-[13px] flex-1 ${moveTargetProjectId === null ? "text-blue-600" : "text-slate-700"}`}
                >
                  不归属项目
                </span>
                {moveTargetProjectId === null && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </button>
              {sortedProjects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => setMoveTargetProjectId(proj.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all text-left ${
                    moveTargetProjectId === proj.id
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Folder
                    className={`w-4 h-4 shrink-0 ${moveTargetProjectId === proj.id ? "text-blue-600" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[13px] flex-1 truncate ${moveTargetProjectId === proj.id ? "text-blue-600" : "text-slate-700"}`}
                  >
                    {proj.name}
                  </span>
                  {moveTargetProjectId === proj.id && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowMoveModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmMove}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                确定移动
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[400px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-slate-800 mb-2">确认删除</h3>
            <p className="text-slate-500 text-[14px] mb-6">
              确定要删除仪表盘「{dashboard.name}」吗？删除后将无法恢复。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Confirm Modal */}
      {showPublishConfirm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
          onClick={() => setShowPublishConfirm(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[400px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-slate-800 mb-2">发布确认</h3>
            <p className="text-slate-500 text-[14px] mb-2">
              确定要发布仪表盘「{dashboard.name}」吗？
            </p>
            <p className="text-slate-400 text-[13px] mb-6">
              发布后将生成一个可访问的链接，其他人可通过该链接查看数据看板。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPublishConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmPublish}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                确定发布
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Dashboard Modal */}
      {showCopyModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
          onClick={() => setShowCopyModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[420px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-slate-800 mb-1">复制仪表盘</h3>
            <p className="text-[13px] text-slate-500 mb-4">
              设置副本名称并选择归属项目
            </p>
            <label className="block text-[13px] text-slate-600 mb-1.5">名称</label>
            <input
              value={copyName}
              onChange={(e) => setCopyName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirmCopy();
                if (e.key === "Escape") setShowCopyModal(false);
              }}
              placeholder="请输入仪表盘名称"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 transition-colors mb-4"
              autoFocus
            />
            <label className="block text-[13px] text-slate-600 mb-1.5">归属项目</label>
            <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto mb-5">
              <button
                onClick={() => setCopyTargetProjectId(null)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all text-left ${
                  copyTargetProjectId === null
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <FileBarChart
                  className={`w-4 h-4 shrink-0 ${copyTargetProjectId === null ? "text-blue-600" : "text-slate-400"}`}
                />
                <span
                  className={`text-[13px] flex-1 ${copyTargetProjectId === null ? "text-blue-600" : "text-slate-700"}`}
                >
                  不归属项目
                </span>
                {copyTargetProjectId === null && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </button>
              {sortedProjects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => setCopyTargetProjectId(proj.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all text-left ${
                    copyTargetProjectId === proj.id
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Folder
                    className={`w-4 h-4 shrink-0 ${copyTargetProjectId === proj.id ? "text-blue-600" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[13px] flex-1 truncate ${copyTargetProjectId === proj.id ? "text-blue-600" : "text-slate-700"}`}
                  >
                    {proj.name}
                  </span>
                  {copyTargetProjectId === proj.id && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCopyModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmCopy}
                disabled={!copyName.trim()}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                确定复制
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}