import React, { useState, useMemo } from "react";
import { DataSet, DataSource } from "../DashboardContext";
import { Search, Plus, MoreHorizontal, Edit3, Trash2, Eye, Copy, PlayCircle, ChevronRight, Database, FileText, BarChart3, Download } from "lucide-react";

interface DataSetListProps {
  dataSets: DataSet[];
  dataSources: DataSource[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function DataSetList({ dataSets, dataSources, onAdd, onEdit, onDelete, onPreview, onDuplicate }: DataSetListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const dataSourceMap = useMemo(() => {
    return dataSources.reduce((map, ds) => {
      map[ds.id] = ds;
      return map;
    }, {} as Record<string, DataSource>);
  }, [dataSources]);

  const filteredDataSets = useMemo(() => {
    let filtered = dataSets;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ds => 
        ds.name.toLowerCase().includes(query) ||
        (ds.description && ds.description.toLowerCase().includes(query))
      );
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(ds => ds.type === filterType);
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(ds => ds.category === selectedCategory);
    }

    return filtered;
  }, [dataSets, searchQuery, filterType, selectedCategory]);

  const categories = useMemo(() => {
    const cats = dataSets.map(ds => ds.category).filter(Boolean) as string[];
    return [...new Set(cats)];
  }, [dataSets]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[18px] text-slate-800 font-medium">数据集管理</h1>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500 text-white text-[14px] hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新建数据集
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索数据集"
              className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 outline-none focus:border-blue-300 transition-all"
          >
            <option value="all">全部类型</option>
            <option value="table">表</option>
            <option value="sql">SQL</option>
            <option value="api">API</option>
            <option value="file">文件</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 outline-none focus:border-blue-300 transition-all"
          >
            <option value="all">全部分类</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* DataSet Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDataSets.map((dataSet) => {
            const dataSource = dataSourceMap[dataSet.sourceId];
            return (
              <div key={dataSet.id} className="bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {dataSet.type === "table" && <Database className="w-4 h-4" />}
                      {dataSet.type === "sql" && <FileText className="w-4 h-4" />}
                      {dataSet.type === "api" && <PlayCircle className="w-4 h-4" />}
                      {dataSet.type === "file" && <FileText className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-[14px] text-slate-800 font-medium">{dataSet.name}</h3>
                      <p className="text-[12px] text-slate-400">
                        {dataSource ? `${dataSource.name} (${dataSource.type})` : "未知数据源"}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-[120px]">
                      <button
                        onClick={() => onEdit(dataSet.id)}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        编辑
                      </button>
                      <button
                        onClick={() => onPreview(dataSet.id)}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        预览
                      </button>
                      <button
                        onClick={() => onDuplicate(dataSet.id)}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        复制
                      </button>
                      <button
                        onClick={() => {
                          // 导出Excel功能
                          const headers = dataSet.fields.map(f => f.name);
                          const rows = [
                            [1, "测试数据1", 100, "2026-01-01"],
                            [2, "测试数据2", 200, "2026-01-02"],
                            [3, "测试数据3", 300, "2026-01-03"],
                            [4, "测试数据4", 400, "2026-01-04"],
                            [5, "测试数据5", 500, "2026-01-05"],
                          ];
                          
                          const csvContent = [headers, ...rows].join("\n");
                          const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute("download", `${dataSet.name}-${Date.now()}.xls`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        导出Excel
                      </button>
                      <button
                        onClick={() => onDelete(dataSet.id)}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        删除
                      </button>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] text-slate-500">字段数</span>
                    <span className="text-[12px] text-slate-800 font-medium">{dataSet.fields.length}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] text-slate-500">创建时间</span>
                    <span className="text-[12px] text-slate-800">
                      {new Date(dataSet.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {dataSet.description && (
                    <div className="mb-3">
                      <p className="text-[12px] text-slate-500 mb-1">描述</p>
                      <p className="text-[12px] text-slate-700 line-clamp-2">{dataSet.description}</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[12px] text-slate-400">创建人: {dataSet.creator || "管理员"}</span>
                  <button
                    onClick={() => onPreview(dataSet.id)}
                    className="flex items-center gap-1 text-[12px] text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    查看详情
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDataSets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <BarChart3 className="w-16 h-16 text-slate-200 mb-4" />
            <p className="text-[14px]">暂无数据集</p>
            <button
              onClick={onAdd}
              className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-blue-300 text-blue-500 text-[13px] hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              新建数据集
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
