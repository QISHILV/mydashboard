import React, { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { Home, BarChart3, Table2, Download, Undo2, Redo2, LayoutGrid, Eye, Play, Zap, Palette, Settings, Trash2, Copy, MoreHorizontal } from "lucide-react";
import { useDashboards } from "./DashboardContext";
import { LeftPanel } from "./editor/LeftPanel";
import { RightPanel } from "./editor/RightPanel";
import { CanvasChart } from "./editor/CanvasChart";

interface FieldItem {
  name: string;
  aggregation: string;
  sort: string;
}

interface CanvasItem {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  datasetId: string;
  dimensions: FieldItem[];
  metrics: FieldItem[];
  filters: any[];
}

export function DashboardEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, dashboards, renameDashboard, togglePublish, addDownload, updateDownload } = useDashboards();
  const dashboard = dashboards.find((d) => d.id === id);

  const project = dashboard && dashboard.projectId ? projects.find((p) => p.id === dashboard.projectId) : null;

  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [dragInfo, setDragInfo] = useState<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [resizeInfo, setResizeInfo] = useState<{ id: string; startX: number; startY: number; origW: number; origH: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedItem = canvasItems.find((item) => item.id === selectedItemId);

  const handleAddChart = useCallback((chartType: string) => {
    const newItem: CanvasItem = {
      id: `item-${Date.now()}`,
      type: chartType,
      x: 40 + Math.random() * 100,
      y: 40 + Math.random() * 60,
      width: 420,
      height: 280,
      datasetId: "school",
      dimensions: [],
      metrics: [],
      filters: [],
    };
    setCanvasItems((prev) => [...prev, newItem]);
    setSelectedItemId(newItem.id);
  }, []);

 const handleDeleteSelected = useCallback(() => {
    if (selectedItemId) {
      setCanvasItems((prev) => prev.filter((item) => item.id !== selectedItemId));
      setSelectedItemId(null);
    }
  }, [selectedItemId]);

  const handleCopySelected = useCallback(() => {
    if (selectedItem) {
      const newItem: CanvasItem = {
        ...selectedItem,
        id: `item-${Date.now()}`,
        x: selectedItem.x + 20,
        y: selectedItem.y + 20,
      };
      setCanvasItems((prev) => [...prev, newItem]);
      setSelectedItemId(newItem.id);
    }
  }, [selectedItem]);

  const handleExportSelected = useCallback(() => {
    if (selectedItem) {
      // 模拟导出操作
      const newDownload = {
        fileName: `图表数据-${selectedItem.type}`,
        format: 'Excel',
        downloadTime: new Date().toLocaleString(),
        operator: '管理员',
        status: '下载中',
      };
      
      // 添加到下载中心
      const downloadId = addDownload(newDownload);
      
      // 模拟下载完成
      setTimeout(() => {
        updateDownload(downloadId, { status: '已完成' });
      }, 2000);
      
      // 生成模拟数据并下载
      const dimensions = selectedItem.dimensions || [];
      const metrics = selectedItem.metrics || [];
      
      const mockData = [
        { name: "1月", value1: 4000, value2: 2400, value3: 1800 },
        { name: "2月", value1: 3000, value2: 1398, value3: 2200 },
        { name: "3月", value1: 2000, value2: 4800, value3: 2800 },
        { name: "4月", value1: 2780, value2: 3908, value3: 1900 },
        { name: "5月", value1: 1890, value2: 4800, value3: 3200 },
        { name: "6月", value1: 2390, value2: 3800, value3: 2500 },
      ];
      
      const headers = dimensions.map(d => d.name).concat(metrics.map(m => m.name));
      const rows = mockData.map(item => {
        const row = dimensions.map(d => item.name);
        metrics.forEach((metric, index) => {
          row.push(item[`value${index + 1}`] || 0);
        });
        return row;
      });
      
      const csvContent = [headers, ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `图表数据-${Date.now()}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [selectedItem]);

  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setSelectedItemId(itemId);
    const item = canvasItems.find((i) => i.id === itemId);
    if (!item) return;
    setDragInfo({ id: itemId, startX: e.clientX, startY: e.clientY, origX: item.x, origY: item.y });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    const item = canvasItems.find((i) => i.id === itemId);
    if (!item) return;
    setResizeInfo({ id: itemId, startX: e.clientX, startY: e.clientY, origW: item.width, origH: item.height });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragInfo) {
      const dx = e.clientX - dragInfo.startX;
      const dy = e.clientY - dragInfo.startY;
      setCanvasItems((prev) => prev.map((item) =>
        item.id === dragInfo.id
          ? { ...item, x: dragInfo.origX + dx, y: dragInfo.origY + dy }
          : item
      ));
    }
    if (resizeInfo) {
      const dx = e.clientX - resizeInfo.startX;
      const dy = e.clientY - resizeInfo.startY;
      setCanvasItems((prev) => prev.map((item) =>
        item.id === resizeInfo.id
          ? {
              ...item,
              width: Math.max(200, resizeInfo.origW + dx),
              height: Math.max(150, resizeInfo.origH + dy),
            }
          : item
      ));
    }
  }, [dragInfo, resizeInfo]);

  const handleMouseUp = useCallback(() => {
    setDragInfo(null);
    setResizeInfo(null);
  }, []);

  if (!dashboard) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400">
        <p className="text-[18px] mb-4">仪表盘不存在</p>
        <button onClick={() => navigate("/")} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          返回首页
        </button>
      </div>
    );
  }

  const handlePublish = () => {
    if (dashboard.published) {
      togglePublish(dashboard.id);
    } else {
      setShowPublishConfirm(true);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f5f5f5] select-none">
      {/* Top toolbar */}
      <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-10">
        {/* Left tools */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => navigate("/")} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors" title="首页">
            <Home className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1.5" />
          <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center" title="图表">
            <BarChart3 className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" title="表格">
            <Table2 className="w-4 h-4" />
          </button>
          <button 
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" 
            title="导出为Excel"
            onClick={() => {
              if (selectedItem) {
                // 导出图表数据为Excel
                const dimensions = selectedItem.dimensions || [];
                const metrics = selectedItem.metrics || [];
                
                if (dimensions.length === 0 && metrics.length === 0) {
                  alert("请先为图表添加维度和指标");
                  return;
                }
                
                // 生成模拟数据
                const mockData = [
                  { name: "1月", value1: 4000, value2: 2400, value3: 1800 },
                  { name: "2月", value1: 3000, value2: 1398, value3: 2200 },
                  { name: "3月", value1: 2000, value2: 4800, value3: 2800 },
                  { name: "4月", value1: 2780, value2: 3908, value3: 1900 },
                  { name: "5月", value1: 1890, value2: 4800, value3: 3200 },
                  { name: "6月", value1: 2390, value2: 3800, value3: 2500 },
                ];
                
                // 生成CSV内容（Excel兼容）
                const headers = dimensions.map(d => d.name).concat(metrics.map(m => m.name));
                const rows = mockData.map(item => {
                  const row = dimensions.map(d => item.name); // 使用name作为维度值
                  metrics.forEach((metric, index) => {
                    row.push(item[`value${index + 1}`] || 0);
                  });
                  return row;
                });
                
                const csvContent = [headers, ...rows].join("\n");
                const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `图表数据-${Date.now()}.xls`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } else {
                alert("请先选择一个图表组件");
              }
            }}
          >
            <Download className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1.5" />
          <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" title="撤销">
            <Undo2 className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" title="重做">
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1.5" />
          <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" title="网格">
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        {/* Center - title */}
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </span>
          {project ? (
            <button
              onClick={() => navigate(`/project/${project.id}`)}
              className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
            >
              {project.name}
            </button>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
            >
              全部仪表盘
            </button>
          )}
          <span className="text-[13px] text-slate-300">/</span>
          <input
            className="text-[13px] text-slate-800 bg-transparent border-none outline-none hover:bg-slate-50 focus:bg-slate-50 px-1 py-0.5 rounded transition-colors max-w-[160px]"
            value={dashboard.name}
            onChange={(e) => renameDashboard(dashboard.id, e.target.value)}
          />
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-1 pr-2">
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[12px]">预览</span>
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span className="text-[12px]">{dashboard.published ? "取消发布" : "发布"}</span>
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1.5" />
          <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        <LeftPanel onAddChart={handleAddChart} />

          {/* Canvas */}
          <div
            ref={canvasRef}
            className="flex-1 overflow-auto relative"
            style={{
              backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              cursor: dragInfo ? "grabbing" : "default",
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => setSelectedItemId(null)}
          >
          {/* Canvas items */}
          {canvasItems.map((item) => {
            const isSelected = item.id === selectedItemId;
            return (
              <div
                key={item.id}
                className={`absolute bg-white rounded-xl shadow-md ${isSelected ? "ring-2 ring-blue-400" : "ring-1 ring-slate-200 hover:ring-blue-300"}`}
                style={{
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  height: item.height,
                  zIndex: isSelected ? 10 : 1,
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id); }}
                onMouseDown={(e) => handleMouseDown(e, item.id)}
              >
                {/* Selection border dashes */}
                {isSelected && (
                  <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-xl pointer-events-none z-20" />
                )}

                {/* Chart content */}
                <div className="w-full h-full p-1 overflow-hidden">
                  <CanvasChart 
                    type={item.type} 
                    width={item.width} 
                    height={item.height} 
                    datasetId={item.datasetId}
                    dimensions={item.dimensions}
                    metrics={item.metrics}
                    selectedChartConfig={item}
                  />
                </div>

                {/* Resize handle */}
                {isSelected && (
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-30"
                    onMouseDown={(e) => handleResizeMouseDown(e, item.id)}
                  >
                    <svg className="w-full h-full text-blue-400" viewBox="0 0 16 16">
                      <path d="M14 2v12H2" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M14 6v8H6" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                    </svg>
                  </div>
                )}

                {/* Hanging bubble window with quick actions */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 z-30">
                    <div className="flex flex-col gap-1">
                      <button
                        className="w-8 h-8 rounded-md bg-blue-500 text-white flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleCopySelected(); }}
                        title="复制"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        className="w-8 h-8 rounded-md bg-green-500 text-white flex items-center justify-center shadow-md hover:bg-green-600 transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleExportSelected(); }}
                        title="导出"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="w-8 h-8 rounded-md bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleDeleteSelected(); }}
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty state */}
          {canvasItems.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-slate-400">
                <div className="w-20 h-20 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-10 h-10 text-slate-200" />
                </div>
                <p className="text-[15px]">从左侧面板选择组件添加到画布</p>
                <p className="text-[12px] text-slate-300 mt-1">点击图表缩略图即可添加</p>
              </div>
            </div>
          )}

        </div>

        {/* Right panel */}
        <RightPanel
          selectedChartId={selectedItemId}
          selectedChartType={selectedItem?.type ?? null}
          selectedChartConfig={selectedItem}
          onUpdateChart={(updates) => {
            setCanvasItems((prev) => prev.map((item) =>
              item.id === selectedItemId ? { ...item, ...updates } : item
            ));
          }}
        />        
      </div>

      {/* Publish Confirm Modal */}
      {showPublishConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowPublishConfirm(false)}>
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-slate-800 mb-2">发布确认</h3>
            <p className="text-slate-500 text-[14px] mb-2">
              确定要发布仪表盘「{dashboard.name}」吗？
            </p>
            <p className="text-slate-400 text-[13px] mb-6">
              发布后将生成一个可访问的链接，其他人可通过该链接查看数据看板。
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowPublishConfirm(false)} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                取消
              </button>
              <button
                onClick={() => { togglePublish(dashboard.id); setShowPublishConfirm(false); }}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                确定发布
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}