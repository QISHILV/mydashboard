import React, { useState, useCallback } from "react";
import { Plus, X, ChevronRight, ChevronLeft } from "lucide-react";

interface TabItem {
  id: string;
  name: string;
  active: boolean;
}

interface TabComponentProps {
  tabs: TabItem[];
  onTabChange: (tabId: string) => void;
  onAddTab: () => void;
  onRemoveTab: (tabId: string) => void;
  onRenameTab: (tabId: string, name: string) => void;
}

export function TabComponent({ tabs, onTabChange, onAddTab, onRemoveTab, onRenameTab }: TabComponentProps) {
  const [draggingTab, setDraggingTab] = useState<string | null>(null);
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleDragStart = useCallback((e: React.DragEvent, tabId: string) => {
    setDraggingTab(tabId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetTabId: string) => {
    e.preventDefault();
    if (draggingTab && draggingTab !== targetTabId) {
      // 这里可以实现标签重新排序的逻辑
      console.log(`Move tab ${draggingTab} to ${targetTabId}`);
    }
    setDraggingTab(null);
  }, [draggingTab]);

  const handleStartEdit = useCallback((tabId: string, name: string) => {
    setEditingTab(tabId);
    setEditValue(name);
  }, []);

  const handleConfirmEdit = useCallback((tabId: string) => {
    if (editValue.trim()) {
      onRenameTab(tabId, editValue.trim());
    }
    setEditingTab(null);
    setEditValue("");
  }, [editValue, onRenameTab]);

  const handleCancelEdit = useCallback(() => {
    setEditingTab(null);
    setEditValue("");
  }, []);

  return (
    <div className="flex items-center gap-1 p-2 bg-white border-b border-slate-200">
      <div className="flex items-center gap-1 flex-1 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            draggable
            onDragStart={(e) => handleDragStart(e, tab.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer transition-all ${tab.active ? "bg-white border border-b-0 border-slate-200 shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
            onClick={() => onTabChange(tab.id)}
          >
            {editingTab === tab.id ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleConfirmEdit(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConfirmEdit(tab.id);
                  if (e.key === "Escape") handleCancelEdit();
                }}
                className="text-sm font-medium outline-none"
              />
            ) : (
              <span className="text-sm font-medium" onClick={(e) => {
                e.stopPropagation();
                handleStartEdit(tab.id, tab.name);
              }}>
                {tab.name}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTab(tab.id);
              }}
              className="w-4 h-4 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onAddTab}
        className="flex items-center gap-1 px-3 py-1.5 rounded-t-lg text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm">添加标签</span>
      </button>
    </div>
  );
}
