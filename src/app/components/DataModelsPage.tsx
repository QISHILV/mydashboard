import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useDashboards, DataModel } from "./DashboardContext";
import { Table2, Plus, Search, ChevronRight, ChevronLeft, MoreHorizontal, Pencil, Trash2, Eye, Info, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router";

export function DataModelsPage() {
  const { dataModels, dataSources, dataSets, deleteDataModel, renameDataModel, publishDataModel, unpublishDataModel } = useDashboards();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"config" | "fields">();
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [detailModal, setDetailModal] = useState<DataModel | null>(null);
  // More menu / rename / delete states
  const [moreMenuId, setMoreMenuId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [inUseWarning, setInUseWarning] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewLogs, setPreviewLogs] = useState<string[]>([]);
  const moreMenuRef = React.useRef<HTMLDivElement | null>(null);

  // Default select first data model
  useEffect(() => {
    if (dataModels.length > 0 && !selectedModelId) {
      setSelectedModelId(dataModels[0].id);
      setActiveTab("config");
    }
  }, [dataModels, selectedModelId]);

  const selectedModel = useMemo(
    () => dataModels.find((model) => model.id === selectedModelId) || null,
    [dataModels, selectedModelId]
  );

  const filteredModels = useMemo(
    () => dataModels.filter((model) => model.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [dataModels, searchQuery]
  );

  // Check if model is in use (has datasets referencing it)
  const isModelInUse = useCallback((modelId: string) => {
    return dataSets.some((d) => d.sourceId === modelId);
  }, [dataSets]);

  // Close more menu on outside click
  useEffect(() => {
    if (!moreMenuId) return;
    const handler = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreMenuId]);

  const handleStartRename = (model: { id: string; name: string }) => {
    setRenameId(model.id);
    setRenameValue(model.name);
    setMoreMenuId(null);
  };

  const handleConfirmRename = () => {
    if (renameId && renameValue.trim()) {
      renameDataModel(renameId, renameValue.trim());
    }
    setRenameId(null);
    setRenameValue("");
  };

  const handleDeleteClick = (modelId: string) => {
    setMoreMenuId(null);
    // Check if data model is in use (has datasets referencing it)
    const isUsed = isModelInUse(modelId);
    if (isUsed) {
      setInUseWarning(true);
    } else {
      setDeleteConfirmId(modelId);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteDataModel(deleteConfirmId);
      if (selectedModelId === deleteConfirmId) {
        setSelectedModelId(null);
        setActiveTab(undefined);
      }
    }
    setDeleteConfirmId(null);
  };

  const handlePublish = (modelId: string) => {
    const model = dataModels.find(m => m.id === modelId);
    if (!model) return;

    // 1. 命名规范校验
    if (!model.code.startsWith('dwd_')) {
      alert('模型编码必须以 dwd_ 开头');
      return;
    }
    if (!/^dwd_[a-z0-9_]+$/.test(model.code)) {
      alert('模型编码仅支持小写字母、数字和下划线');
      return;
    }

    // 2. 主键约束校验
    if (model.modelType === '事实表') {
      const primaryKeyFields = model.fields.filter(f => f.isPrimaryKey);
      if (primaryKeyFields.length === 0) {
        alert('事实表必须配置主键');
        return;
      }
      if (primaryKeyFields.length > 1) {
        alert('事实表仅支持单个主键');
        return;
      }
      if (!primaryKeyFields[0].isNotNull) {
        alert('主键字段必须设置为非空');
        return;
      }
    }

    // 3. 依赖校验
    const dataSource = dataSources.find(ds => ds.id === model.dataSourceId);
    if (!dataSource) {
      alert('关联的数据源不存在，请检查');
      return;
    }
    if (dataSource.status !== 'connected') {
      alert('关联的数据源未连接，请检查');
      return;
    }

    // 4. 规则冲突校验
    for (const field of model.fields) {
      // 检查非空与默认值的冲突
      if (field.isNotNull && field.defaultValue) {
        alert(`字段 ${field.dwdFieldName} 同时设置了非空和默认值，可能存在冲突`);
        return;
      }
      
      // 检查ETL规则冲突
      if (field.etlRules.includes('空值填充') && field.etlRules.includes('丢弃数据')) {
        alert(`字段 ${field.dwdFieldName} 的ETL规则存在冲突：同时包含空值填充和丢弃数据`);
        return;
      }
    }

    // 5. 字段长度校验
    for (const field of model.fields) {
      if ((field.fieldType === '字符串' || field.fieldType === '整数' || field.fieldType === '浮点数') && field.fieldLength <= 0) {
        alert(`字段 ${field.dwdFieldName} 的长度必须大于0`);
        return;
      }
    }

    // 校验通过，发布模型
    publishDataModel(modelId);
    alert('模型发布成功');
  };

  const handleUnpublish = (modelId: string) => {
    unpublishDataModel(modelId);
  };

  const handlePreviewData = () => {
    // 模拟生成预览数据
    const mockData = [];
    const mockLogs = [];
    
    // 根据模型字段生成模拟数据
    if (selectedModel) {
      for (let i = 1; i <= 10; i++) {
        const row: any = {};
        selectedModel.fields.forEach((field) => {
          switch (field.fieldType) {
            case "字符串":
              row[field.dwdFieldName] = `${field.dwdFieldName}${i}`;
              break;
            case "整数":
              row[field.dwdFieldName] = i * 10;
              break;
            case "浮点数":
              row[field.dwdFieldName] = (i * 10.5).toFixed(2);
              break;
            case "日期":
              row[field.dwdFieldName] = new Date().toISOString().split('T')[0];
              break;
            case "布尔":
              row[field.dwdFieldName] = i % 2 === 0;
              break;
          }
        });
        mockData.push(row);
      }
      
      // 生成模拟清洗日志
      mockLogs.push("开始执行ETL清洗规则...");
      mockLogs.push("处理空值: 填充默认值0");
      mockLogs.push("处理异常值: 过滤超出范围的数据");
      mockLogs.push("类型转换: 字符串转日期成功");
      mockLogs.push("清洗完成: 共处理10条数据，过滤0条");
    }
    
    setPreviewData(mockData);
    setPreviewLogs(mockLogs);
    setPreviewModal(true);
  };

  return (
    <div className="flex h-full bg-white">
      {/* Left Sidebar - DataModel List */}
      <div className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-200 ${leftCollapsed ? "w-0 overflow-hidden" : "w-[220px]"}`}>
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[15px] text-slate-800 font-medium">数据模型</span>
            <button
              onClick={() => navigate("/data-config/data-models/create")}
              className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
              title="新增数据模型"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索"
              className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all mb-0.5 ${selectedModelId === model.id ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"}`}
              onClick={() => {
                setSelectedModelId(model.id);
                setActiveTab("config");
              }}
            >
              <Table2 className="w-4 h-4 shrink-0 text-blue-500" />
              {renameId === model.id ? (
                <input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={handleConfirmRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConfirmRename();
                    if (e.key === "Escape") { setRenameId(null); setRenameValue(""); }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 min-w-0 text-[13px] px-1.5 py-0.5 rounded border border-blue-300 outline-none bg-white text-slate-800"
                />
              ) : (
                <span className="text-[13px] truncate flex-1 min-w-0">{model.name}</span>
              )}
              {renameId !== model.id && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMoreMenuId(moreMenuId === model.id ? null : model.id);
                    }}
                    className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-200/60 transition-all shrink-0"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {moreMenuId === model.id && (
                    <div
                      ref={moreMenuRef}
                      className="absolute right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-[120px]"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStartRename(model); }}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        更改名称
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(model.id); }}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        删除
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedModel ? (
          <>
            {/* Top Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                {leftCollapsed && (
                  <button onClick={() => setLeftCollapsed(false)} className="p-1 rounded hover:bg-slate-100 text-slate-400">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {!leftCollapsed && (
                  <button onClick={() => setLeftCollapsed(true)} className="p-1 rounded hover:bg-slate-100 text-slate-400">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <Table2 className="w-5 h-5 text-blue-500" />
                <span className="text-[15px] text-slate-800 font-medium">{selectedModel.name}</span>
                <span className="text-[13px] text-slate-400">创建人:{selectedModel.creator || "管理员"}</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePreviewData}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  预览数据
                </button>
                {selectedModel.status === "草稿" && (
                  <button 
                    onClick={() => handlePublish(selectedModel.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-500 text-white text-[13px] hover:bg-green-600 transition-colors"
                  >
                    发布
                  </button>
                )}
                {selectedModel.status === "已发布" && (
                  <button 
                    onClick={() => handleUnpublish(selectedModel.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500 text-white text-[13px] hover:bg-amber-600 transition-colors"
                  >
                    取消发布
                  </button>
                )}
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors">
                  <Table2 className="w-3.5 h-3.5" />
                  新建数据集
                </button>
                <button 
                  onClick={() => navigate(`/data-config/data-models/edit/${selectedModel.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  编辑
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 border-b border-slate-200">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("config")}
                  className={`px-4 py-2.5 text-[14px] transition-all border-b-2 ${activeTab === "config" ? "border-blue-500 text-blue-600 font-medium" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                  模型配置
                </button>
                <button
                  onClick={() => setActiveTab("fields")}
                  className={`px-4 py-2.5 text-[14px] transition-all border-b-2 ${activeTab === "fields" ? "border-blue-500 text-blue-600 font-medium" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                  字段配置
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === "config" && (
                <div className="p-6">
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    {/* 基础信息 */}
                    <div className="flex items-center gap-2 mb-6">
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                      <span className="text-[15px] text-slate-800 font-medium">基础信息</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-16 gap-y-5 pl-6">
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">模型名称</p>
                        <p className="text-[14px] text-slate-800">{selectedModel.name}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">模型编码</p>
                        <p className="text-[14px] text-slate-800">{selectedModel.code}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">模型类型</p>
                        <p className="text-[14px] text-slate-800">{selectedModel.modelType}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">模型状态</p>
                        <p className={`text-[14px] ${selectedModel.status === "已发布" ? "text-green-600" : "text-slate-800"}`}>{selectedModel.status}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">关联数据源</p>
                        <p className="text-[14px] text-slate-800">{selectedModel.dataSourceName}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">引用次数</p>
                        <p className="text-[14px] text-slate-800">{selectedModel.referenceCount}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">创建时间</p>
                        <p className="text-[14px] text-slate-800">{new Date(selectedModel.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">更新时间</p>
                        <p className="text-[14px] text-slate-800">{new Date(selectedModel.updatedAt).toLocaleString()}</p>
                      </div>
                      {selectedModel.publishTime && (
                        <div className="col-span-2">
                          <p className="text-[13px] text-slate-400 mb-1">发布时间</p>
                          <p className="text-[14px] text-slate-800">{new Date(selectedModel.publishTime).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "fields" && (
                <div className="p-6">
                  {/* Fields Table */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr_1fr_120px_80px_80px_120px_100px_150px_120px] bg-slate-50 border-b border-slate-200">
                      <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">ODS源字段名</div>
                      <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">DWD业务字段名</div>
                      <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">字段类型</div>
                      <div className="px-4 py-3 text-[13px] text-slate-600 font-medium text-center">长度</div>
                      <div className="px-4 py-3 text-[13px] text-slate-600 font-medium text-center">是否主键</div>
                      <div className="px-4 py-3 text-[13px] text-slate-600 font-medium text-center">是否非空</div>
                      <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">默认值</div>
                      <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">ETL规则</div>
                      <div className="px-4 py-3 text-[13px] text-slate-600 font-medium text-center">排序</div>
                    </div>
                    {/* Rows */}
                    {selectedModel.fields.map((field, idx) => (
                      <div
                        key={field.id}
                        className={`grid grid-cols-[1fr_1fr_120px_80px_80px_120px_100px_150px_120px] border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${idx === selectedModel.fields.length - 1 ? "border-b-0" : ""}`}
                      >
                        <div className="px-4 py-3 text-[13px] text-slate-800">{field.odsFieldName}</div>
                        <div className="px-4 py-3 text-[13px] text-slate-800">{field.dwdFieldName}</div>
                        <div className="px-4 py-3 text-[13px] text-slate-800">{field.fieldType}</div>
                        <div className="px-4 py-3 text-[13px] text-slate-600 text-center">{field.fieldLength}</div>
                        <div className="px-4 py-3 text-center">
                          {field.isPrimaryKey ? (
                            <Check className="w-4 h-4 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 mx-auto" />
                          )}
                        </div>
                        <div className="px-4 py-3 text-center">
                          {field.isNotNull ? (
                            <Check className="w-4 h-4 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 mx-auto" />
                          )}
                        </div>
                        <div className="px-4 py-3 text-[13px] text-slate-600">{field.defaultValue || "-"}</div>
                        <div className="px-4 py-3 text-[13px] text-slate-600 truncate">{field.etlRules || "-"}</div>
                        <div className="px-4 py-3 text-[13px] text-slate-600 text-center">{field.sortOrder}</div>
                      </div>
                    ))}
                    {selectedModel.fields.length === 0 && (
                      <div className="px-4 py-8 text-center text-[13px] text-slate-400">暂无字段配置</div>
                    )}
                  </div>

                  {/* Add Field Button */}
                  <button className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    添加字段
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Table2 className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-slate-600 text-lg mb-2">选择数据模型</h3>
            <p className="text-[14px] text-center max-w-md">
              从左侧列表中选择一个数据模型，查看其详情和字段配置
            </p>
          </div>
        )}
      </div>

      {/* In-use warning modal */}
      {inUseWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-[360px] p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-amber-500" />
              <span className="text-[15px] text-slate-800 font-medium">提示</span>
            </div>
            <p className="text-[14px] text-slate-600 mb-5">正在被使用，暂不可删除</p>
            <div className="flex justify-end">
              <button
                onClick={() => setInUseWarning(false)}
                className="px-4 py-1.5 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-[360px] p-6">
            <div className="flex items-center gap-2 mb-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <span className="text-[15px] text-slate-800 font-medium">确认删除</span>
            </div>
            <p className="text-[14px] text-slate-600 mb-5">确定要删除该数据模型吗？删除后不可恢复。</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-md bg-red-500 text-white text-[13px] hover:bg-red-600 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data preview modal */}
      {previewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-[800px] max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                <span className="text-[15px] text-slate-800 font-medium">数据预览</span>
              </div>
              <button
                onClick={() => setPreviewModal(false)}
                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex h-[calc(80vh-80px)] overflow-hidden">
              {/* Preview Data */}
              <div className="flex-1 border-r border-slate-200 overflow-y-auto">
                <div className="px-6 py-4">
                  <h4 className="text-[14px] text-slate-700 font-medium mb-3">清洗后数据</h4>
                  {previewData.length > 0 ? (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 border-b border-slate-200 px-4 py-3">
                        {Object.keys(previewData[0]).map((key) => (
                          <div key={key} className="text-[13px] text-slate-600 font-medium">{key}</div>
                        ))}
                      </div>
                      {previewData.map((row, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4 border-b border-slate-100 px-4 py-3 hover:bg-slate-50/50 transition-colors">
                          {Object.values(row).map((value, idx) => (
                            <div key={idx} className="text-[13px] text-slate-800">{value}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-[13px] text-slate-400">暂无预览数据</div>
                  )}
                </div>
              </div>
              {/* Preview Logs */}
              <div className="w-[300px] overflow-y-auto">
                <div className="px-4 py-4">
                  <h4 className="text-[14px] text-slate-700 font-medium mb-3">清洗日志</h4>
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    {previewLogs.map((log, index) => (
                      <div key={index} className="text-[13px] text-slate-600 mb-2">{log}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => setPreviewModal(false)}
                className="px-4 py-1.5 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CreateDataModelPage() {
  const { addDataModel, dataSources, addDataModelField } = useDashboards();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    code: "",
    modelType: "事实表" as "事实表" | "维度表",
    dataSourceId: "",
    status: "草稿" as "草稿" | "已发布",
  });
  
  const [fields, setFields] = useState<Array<{
    odsFieldName: string;
    dwdFieldName: string;
    fieldType: "字符串" | "整数" | "浮点数" | "日期" | "布尔";
    fieldLength: number;
    isPrimaryKey: boolean;
    isNotNull: boolean;
    valueRange: string;
    defaultValue: string;
    etlRules: string;
    fieldComment: string;
    sortOrder: number;
  }>>([]);
  
  const [currentField, setCurrentField] = useState({
    odsFieldName: "",
    dwdFieldName: "",
    fieldType: "字符串" as "字符串" | "整数" | "浮点数" | "日期" | "布尔",
    fieldLength: 0,
    isPrimaryKey: false,
    isNotNull: false,
    valueRange: "",
    defaultValue: "",
    etlRules: "",
    fieldComment: "",
    sortOrder: 1,
  });
  
  const handleAddField = () => {
    if (currentField.odsFieldName && currentField.dwdFieldName) {
      setFields([...fields, { ...currentField, sortOrder: fields.length + 1 }]);
      setCurrentField({
        odsFieldName: "",
        dwdFieldName: "",
        fieldType: "字符串",
        fieldLength: 0,
        isPrimaryKey: false,
        isNotNull: false,
        valueRange: "",
        defaultValue: "",
        etlRules: "",
        fieldComment: "",
        sortOrder: fields.length + 2,
      });
    }
  };
  
  const handleSave = () => {
    if (!form.name || !form.code || !form.dataSourceId) {
      alert("请填写必填字段");
      return;
    }
    
    const dataSource = dataSources.find(ds => ds.id === form.dataSourceId);
    if (!dataSource) {
      alert("请选择有效的数据源");
      return;
    }
    
    const modelId = addDataModel({
      name: form.name,
      code: form.code,
      modelType: form.modelType,
      dataSourceId: form.dataSourceId,
      dataSourceName: dataSource.name,
      status: form.status
    });
    
    // Add fields to the model
    fields.forEach(field => {
      addDataModelField(modelId, field);
    });
    
    navigate("/data-config/data-models");
  };
  
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between h-14 px-6 border-b border-slate-200">
        <span className="text-[15px] text-slate-800 font-medium">创建数据模型</span>
        <button
          onClick={() => navigate("/data-config/data-models")}
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[800px]">
          {/* 基础信息 */}
          <div className="mb-8">
            <h3 className="text-[16px] text-slate-800 font-medium mb-5">基础信息</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  模型名称 <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="请输入模型名称"
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                />
              </div>
              
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  模型编码 <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="请输入模型编码"
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                />
              </div>
              
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  关联数据源 <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.dataSourceId}
                  onChange={(e) => setForm({ ...form, dataSourceId: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                >
                  <option value="">请选择数据源</option>
                  {dataSources.map(ds => (
                    <option key={ds.id} value={ds.id}>{ds.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  模型类型 <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.modelType}
                  onChange={(e) => setForm({ ...form, modelType: e.target.value as "事实表" | "维度表" })}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                >
                  <option value="事实表">事实表</option>
                  <option value="维度表">维度表</option>
                </select>
              </div>
              
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  模型状态
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "草稿" | "已发布" })}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                >
                  <option value="草稿">草稿</option>
                  <option value="已发布">已发布</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 字段配置 */}
          <div className="mb-8">
            <h3 className="text-[16px] text-slate-800 font-medium mb-5">字段配置</h3>
            
            {/* Current Field Form */}
            <div className="border border-slate-200 rounded-lg p-4 mb-4">
              <h4 className="text-[14px] text-slate-700 font-medium mb-3">添加字段</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    ODS源字段名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={currentField.odsFieldName}
                    onChange={(e) => setCurrentField({ ...currentField, odsFieldName: e.target.value })}
                    placeholder="请输入ODS源字段名"
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    DWD业务字段名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={currentField.dwdFieldName}
                    onChange={(e) => setCurrentField({ ...currentField, dwdFieldName: e.target.value })}
                    placeholder="请输入DWD业务字段名"
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    字段类型
                  </label>
                  <select
                    value={currentField.fieldType}
                    onChange={(e) => setCurrentField({ ...currentField, fieldType: e.target.value as "字符串" | "整数" | "浮点数" | "日期" | "布尔" })}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                  >
                    <option value="字符串">字符串</option>
                    <option value="整数">整数</option>
                    <option value="浮点数">浮点数</option>
                    <option value="日期">日期</option>
                    <option value="布尔">布尔</option>
                  </select>
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    字段长度
                  </label>
                  <input
                    type="number"
                    value={currentField.fieldLength}
                    onChange={(e) => setCurrentField({ ...currentField, fieldLength: parseInt(e.target.value) || 0 })}
                    placeholder="请输入字段长度"
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    取值范围
                  </label>
                  <input
                    value={currentField.valueRange}
                    onChange={(e) => setCurrentField({ ...currentField, valueRange: e.target.value })}
                    placeholder="请输入取值范围，如：0,1,2"
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    默认值
                  </label>
                  <input
                    value={currentField.defaultValue}
                    onChange={(e) => setCurrentField({ ...currentField, defaultValue: e.target.value })}
                    placeholder="请输入默认值"
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    ETL规则
                  </label>
                  <select
                    value={currentField.etlRules}
                    onChange={(e) => setCurrentField({ ...currentField, etlRules: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                  >
                    <option value="">请选择ETL规则</option>
                    <option value="空值填充为0">空值填充为0</option>
                    <option value="空值填充为null">空值填充为null</option>
                    <option value="空值丢弃数据">空值丢弃数据</option>
                    <option value="字符串转日期">字符串转日期</option>
                    <option value="字符串转数值">字符串转数值</option>
                    <option value="超出范围丢弃">超出范围丢弃</option>
                    <option value="超出范围替换为默认值">超出范围替换为默认值</option>
                    <option value="状态码转文本">状态码转文本</option>
                  </select>
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    字段备注
                  </label>
                  <input
                    value={currentField.fieldComment}
                    onChange={(e) => setCurrentField({ ...currentField, fieldComment: e.target.value })}
                    placeholder="请输入字段备注"
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-x-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentField.isPrimaryKey}
                      onChange={(e) => setCurrentField({ ...currentField, isPrimaryKey: e.target.checked, isNotNull: e.target.checked || currentField.isNotNull })}
                      className="w-4 h-4 text-blue-500 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-[13px] text-slate-700">是否主键</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentField.isNotNull}
                      onChange={(e) => setCurrentField({ ...currentField, isNotNull: e.target.checked })}
                      className="w-4 h-4 text-blue-500 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-[13px] text-slate-700">是否非空</label>
                  </div>
                </div>
              </div>
              <button
                onClick={handleAddField}
                className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                添加字段
              </button>
            </div>
            
            {/* Fields List */}
            {fields.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_1fr_120px_80px_80px_120px_100px_150px_120px] bg-slate-50 border-b border-slate-200">
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">ODS源字段名</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">DWD业务字段名</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">字段类型</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium text-center">长度</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium text-center">是否主键</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium text-center">是否非空</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">默认值</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">ETL规则</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium text-center">排序</div>
                </div>
                {fields.map((field, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-[1fr_1fr_120px_80px_80px_120px_100px_150px_120px] border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${idx === fields.length - 1 ? "border-b-0" : ""}`}
                  >
                    <div className="px-4 py-3 text-[13px] text-slate-800">{field.odsFieldName}</div>
                    <div className="px-4 py-3 text-[13px] text-slate-800">{field.dwdFieldName}</div>
                    <div className="px-4 py-3 text-[13px] text-slate-800">{field.fieldType}</div>
                    <div className="px-4 py-3 text-[13px] text-slate-600 text-center">{field.fieldLength}</div>
                    <div className="px-4 py-3 text-center">
                      {field.isPrimaryKey ? (
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </div>
                    <div className="px-4 py-3 text-center">
                      {field.isNotNull ? (
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </div>
                    <div className="px-4 py-3 text-[13px] text-slate-600">{field.defaultValue || "-"}</div>
                    <div className="px-4 py-3 text-[13px] text-slate-600 truncate">{field.etlRules || "-"}</div>
                    <div className="px-4 py-3 text-[13px] text-slate-600 text-center">{field.sortOrder}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => navigate("/data-config/data-models")}
              className="px-4 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditDataModelPage() {
  const { dataModels, dataSources, updateDataModel, addDataModelField, updateDataModelField, deleteDataModelField } = useDashboards();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const model = dataModels.find(m => m.id === id);
  
  if (!model) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">数据模型不存在</p>
          <button 
            onClick={() => navigate("/data-config/data-models")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }
  
  const [form, setForm] = useState({
    name: model.name,
    code: model.code,
    modelType: model.modelType,
    dataSourceId: model.dataSourceId,
    status: model.status,
  });
  
  const [fields, setFields] = useState(model.fields);
  
  const [currentField, setCurrentField] = useState({
    odsFieldName: "",
    dwdFieldName: "",
    fieldType: "字符串" as "字符串" | "整数" | "浮点数" | "日期" | "布尔",
    fieldLength: 0,
    isPrimaryKey: false,
    isNotNull: false,
    valueRange: "",
    defaultValue: "",
    etlRules: "",
    fieldComment: "",
    sortOrder: fields.length + 1,
  });
  
  const handleAddField = () => {
    if (currentField.odsFieldName && currentField.dwdFieldName) {
      const newField = {
        id: `field-${Date.now()}`,
        modelId: model.id,
        ...currentField,
        sortOrder: fields.length + 1
      };
      setFields([...fields, newField]);
      setCurrentField({
        odsFieldName: "",
        dwdFieldName: "",
        fieldType: "字符串",
        fieldLength: 0,
        isPrimaryKey: false,
        isNotNull: false,
        valueRange: "",
        defaultValue: "",
        etlRules: "",
        fieldComment: "",
        sortOrder: fields.length + 2,
      });
    }
  };
  
  const handleSave = () => {
    if (!form.name || !form.code || !form.dataSourceId) {
      alert("请填写必填字段");
      return;
    }
    
    const dataSource = dataSources.find(ds => ds.id === form.dataSourceId);
    if (!dataSource) {
      alert("请选择有效的数据源");
      return;
    }
    
    // 更新模型基础信息
    updateDataModel(model.id, {
      name: form.name,
      code: form.code,
      modelType: form.modelType,
      dataSourceId: form.dataSourceId,
      dataSourceName: dataSource.name,
      status: form.status
    });
    
    // 更新字段
    // 这里简化处理，实际应该比较差异并调用相应的方法
    
    navigate("/data-config/data-models");
  };
  
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between h-14 px-6 border-b border-slate-200">
        <span className="text-[15px] text-slate-800 font-medium">编辑数据模型</span>
        <button
          onClick={() => navigate("/data-config/data-models")}
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[800px]">
          {/* 基础信息 */}
          <div className="mb-8">
            <h3 className="text-[16px] text-slate-800 font-medium mb-5">基础信息</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  模型名称 <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="请输入模型名称"
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                />
              </div>
              
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  模型编码 <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="请输入模型编码"
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                />
              </div>
              
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  模型类型 <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.modelType}
                  onChange={(e) => setForm({ ...form, modelType: e.target.value as "事实表" | "维度表" })}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                >
                  <option value="事实表">事实表</option>
                  <option value="维度表">维度表</option>
                </select>
              </div>
              
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  关联数据源 <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.dataSourceId}
                  onChange={(e) => setForm({ ...form, dataSourceId: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                >
                  <option value="">请选择数据源</option>
                  {dataSources.map(ds => (
                    <option key={ds.id} value={ds.id}>{ds.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  模型状态
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "草稿" | "已发布" })}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                >
                  <option value="草稿">草稿</option>
                  <option value="已发布">已发布</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 字段配置 */}
          <div className="mb-8">
            <h3 className="text-[16px] text-slate-800 font-medium mb-5">字段配置</h3>
            
            {/* Current Field Form */}
            <div className="border border-slate-200 rounded-lg p-4 mb-4">
              <h4 className="text-[14px] text-slate-700 font-medium mb-3">添加字段</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    ODS源字段名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={currentField.odsFieldName}
                    onChange={(e) => setCurrentField({ ...currentField, odsFieldName: e.target.value })}
                    placeholder="请输入ODS源字段名"
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    DWD业务字段名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={currentField.dwdFieldName}
                    onChange={(e) => setCurrentField({ ...currentField, dwdFieldName: e.target.value })}
                    placeholder="请输入DWD业务字段名"
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    字段类型
                  </label>
                  <select
                    value={currentField.fieldType}
                    onChange={(e) => setCurrentField({ ...currentField, fieldType: e.target.value as "字符串" | "整数" | "浮点数" | "日期" | "布尔" })}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                  >
                    <option value="字符串">字符串</option>
                    <option value="整数">整数</option>
                    <option value="浮点数">浮点数</option>
                    <option value="日期">日期</option>
                    <option value="布尔">布尔</option>
                  </select>
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    字段长度
                  </label>
                  <input
                    type="number"
                    value={currentField.fieldLength}
                    onChange={(e) => setCurrentField({ ...currentField, fieldLength: parseInt(e.target.value) || 0 })}
                    placeholder="请输入字段长度"
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    取值范围
                  </label>
                  <input
                    value={currentField.valueRange}
                    onChange={(e) => setCurrentField({ ...currentField, valueRange: e.target.value })}
                    placeholder="请输入取值范围，如：0,1,2"
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    默认值
                  </label>
                  <input
                    value={currentField.defaultValue}
                    onChange={(e) => setCurrentField({ ...currentField, defaultValue: e.target.value })}
                    placeholder="请输入默认值"
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    ETL规则
                  </label>
                  <select
                    value={currentField.etlRules}
                    onChange={(e) => setCurrentField({ ...currentField, etlRules: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                  >
                    <option value="">请选择ETL规则</option>
                    <option value="空值填充为0">空值填充为0</option>
                    <option value="空值填充为null">空值填充为null</option>
                    <option value="空值丢弃数据">空值丢弃数据</option>
                    <option value="字符串转日期">字符串转日期</option>
                    <option value="字符串转数值">字符串转数值</option>
                    <option value="超出范围丢弃">超出范围丢弃</option>
                    <option value="超出范围替换为默认值">超出范围替换为默认值</option>
                    <option value="状态码转文本">状态码转文本</option>
                  </select>
                </div>
                <div>
                  <label className="text-[13px] text-slate-700 mb-1 block">
                    字段备注
                  </label>
                  <input
                    value={currentField.fieldComment}
                    onChange={(e) => setCurrentField({ ...currentField, fieldComment: e.target.value })}
                    placeholder="请输入字段备注"
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-x-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentField.isPrimaryKey}
                      onChange={(e) => setCurrentField({ ...currentField, isPrimaryKey: e.target.checked, isNotNull: e.target.checked || currentField.isNotNull })}
                      className="w-4 h-4 text-blue-500 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-[13px] text-slate-700">是否主键</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentField.isNotNull}
                      onChange={(e) => setCurrentField({ ...currentField, isNotNull: e.target.checked })}
                      className="w-4 h-4 text-blue-500 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-[13px] text-slate-700">是否非空</label>
                  </div>
                </div>
              </div>
              <button
                onClick={handleAddField}
                className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                添加字段
              </button>
            </div>
            
            {/* Fields List */}
            {fields.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_1fr_120px_80px_80px_120px_100px_150px_120px] bg-slate-50 border-b border-slate-200">
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">ODS源字段名</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">DWD业务字段名</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">字段类型</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium text-center">长度</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium text-center">是否主键</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium text-center">是否非空</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">默认值</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">ETL规则</div>
                  <div className="px-4 py-3 text-[13px] text-slate-600 font-medium text-center">排序</div>
                </div>
                {fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className={`grid grid-cols-[1fr_1fr_120px_80px_80px_120px_100px_150px_120px] border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${idx === fields.length - 1 ? "border-b-0" : ""}`}
                  >
                    <div className="px-4 py-3 text-[13px] text-slate-800">{field.odsFieldName}</div>
                    <div className="px-4 py-3 text-[13px] text-slate-800">{field.dwdFieldName}</div>
                    <div className="px-4 py-3 text-[13px] text-slate-800">{field.fieldType}</div>
                    <div className="px-4 py-3 text-[13px] text-slate-600 text-center">{field.fieldLength}</div>
                    <div className="px-4 py-3 text-center">
                      {field.isPrimaryKey ? (
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </div>
                    <div className="px-4 py-3 text-center">
                      {field.isNotNull ? (
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </div>
                    <div className="px-4 py-3 text-[13px] text-slate-600">{field.defaultValue || "-"}</div>
                    <div className="px-4 py-3 text-[13px] text-slate-600 truncate">{field.etlRules || "-"}</div>
                    <div className="px-4 py-3 text-[13px] text-slate-600 text-center">{field.sortOrder}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => navigate("/data-config/data-models")}
              className="px-4 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
