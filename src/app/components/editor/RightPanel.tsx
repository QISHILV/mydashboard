import React, { useState, useRef, useEffect } from "react";
import { Trash2, ChevronDown, ChevronRight, Filter, Palette, Sparkles, BarChart3, Zap, Pencil, ArrowUpDown, Sigma, RotateCcw, Search } from "lucide-react";
import { FilterDialog } from "./FilterDialog";

const tabs = [
  { id: "customize", label: "定制", Icon: Palette },
  { id: "animation", label: "动画", Icon: Sparkles },
  { id: "data", label: "数据", Icon: BarChart3 },
  { id: "event", label: "事件", Icon: Zap },
];

interface RightPanelProps {
  selectedChartId: string | null;
  selectedChartType: string | null;
}

export function RightPanel({ selectedChartId, selectedChartType }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState("customize");

  if (!selectedChartId) {
    return (
      <div className="w-[380px] bg-white border-l border-slate-200 flex items-center justify-center text-slate-400 text-[13px] shrink-0">
        <div className="text-center px-6">
          <p>请选中画布上的组件</p>
          <p className="text-[11px] mt-1 text-slate-300">选中后可在此配置属性</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[380px] bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-2 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-[13px] border-b-2 transition-colors ${activeTab === tab.id
              ? "border-blue-500 text-blue-600 font-medium"
              : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "customize" && <div className="h-full overflow-y-auto p-3"><CustomizePanel /></div>}
        {activeTab === "animation" && <div className="h-full overflow-y-auto p-3"><PlaceholderPanel label="动画" /></div>}
        {activeTab === "data" && <DataPanel />}
        {activeTab === "event" && <div className="h-full overflow-y-auto p-3"><PlaceholderPanel label="事件" /></div>}
      </div>
    </div>
  );
}

function CustomizePanel() {
  return (
    <div className="flex flex-col gap-4">
      {/* Color */}
      <div>
        <label className="text-[12px] text-slate-600 mb-1.5 block">主色调</label>
        <div className="flex gap-2">
          {["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"].map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200 hover:ring-blue-400 transition-all"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Border radius */}
      <div>
        <label className="text-[12px] text-slate-600 mb-1.5 block">圆角</label>
        <input type="range" min="0" max="20" defaultValue="4" className="w-full h-1 bg-slate-200 rounded-full appearance-none accent-blue-500" />
      </div>

      {/* Show legend */}
      <div className="flex items-center justify-between">
        <label className="text-[12px] text-slate-600">显示图例</label>
        <button className="w-8 h-[18px] rounded-full bg-blue-500 relative transition-colors">
          <span className="absolute right-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform" />
        </button>
      </div>

      {/* Show grid */}
      <div className="flex items-center justify-between">
        <label className="text-[12px] text-slate-600">显示网格线</label>
        <button className="w-8 h-[18px] rounded-full bg-blue-500 relative transition-colors">
          <span className="absolute right-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform" />
        </button>
      </div>

      {/* Background */}
      <div>
        <label className="text-[12px] text-slate-600 mb-1.5 block">背景色</label>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded border border-slate-200 bg-white" />
          <input
            type="text"
            defaultValue="#FFFFFF"
            className="flex-1 h-7 px-2 text-[12px] bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  );
}

interface FieldItem {
  name: string;
  aggregation: string;
  sort: string;
}

function FieldTag({
  field,
  isMetric,
  showSort = true,
  onDelete,
  onUpdate,
}: {
  field: FieldItem;
  isMetric: boolean;
  showSort?: boolean;
  onDelete: () => void;
  onUpdate: (updates: Partial<FieldItem>) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSortSub, setShowSortSub] = useState(false);
  const [showAggSub, setShowAggSub] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setShowSortSub(false);
        setShowAggSub(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setShowSortSub(false);
    setShowAggSub(false);
  };

  return (
    <div
      className={`relative flex items-center justify-between px-2 py-1.5 rounded border text-[12px] ${
        isMetric
          ? "bg-white border-green-200 text-green-700"
          : "bg-white border-blue-200 text-blue-700"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { if (!menuOpen) setHovered(false); }}
    >
      <span className="flex items-center gap-1 truncate">
        <span className={isMetric ? "text-green-500" : "text-blue-500"}>{isMetric ? "#" : "T"}</span>
        <span className="truncate">{field.name}{isMetric ? ` (${field.aggregation})` : ""}</span>
      </span>

      {(hovered || menuOpen) && (
        <div className="flex items-center gap-0.5 shrink-0 ml-1">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-100 text-slate-400 hover:text-red-500"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      )}

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 mt-1 w-[190px] bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1"
          onMouseEnter={() => setHovered(true)}
        >
          {isMetric && (
            <>
              <button
                onClick={() => { setShowAggSub(!showAggSub); setShowSortSub(false); }}
                className="w-full px-3 py-2 text-left text-[12px] hover:bg-slate-50 flex items-center justify-between text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <Sigma className="w-3.5 h-3.5 text-slate-400" />
                  汇总方式（{field.aggregation}）
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
              {showAggSub && (
                <div className="bg-slate-50 border-y border-slate-100">
                  {["求和", "去重计数"].map(opt => (
                    <button key={opt}
                      onClick={() => { onUpdate({ aggregation: opt }); closeMenu(); }}
                      className={`w-full px-6 py-1.5 text-left text-[12px] hover:bg-blue-50 ${field.aggregation === opt ? "text-blue-600 font-medium" : "text-slate-600"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              <div className="my-1 border-t border-slate-100" />
            </>
          )}
          {showSort && (
            <>
              <button
                onClick={() => { setShowSortSub(!showSortSub); setShowAggSub(false); }}
                className="w-full px-3 py-2 text-left text-[12px] hover:bg-slate-50 flex items-center justify-between text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  排序（{field.sort}）
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
              {showSortSub && (
                <div className="bg-slate-50 border-y border-slate-100">
                  {["无", "顺序", "倒叙"].map(opt => (
                    <button key={opt}
                      onClick={() => { onUpdate({ sort: opt }); closeMenu(); }}
                      className={`w-full px-6 py-1.5 text-left text-[12px] hover:bg-blue-50 ${field.sort === opt ? "text-blue-600 font-medium" : "text-slate-600"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          <div className="my-1 border-t border-slate-100" />
          <button className="w-full px-3 py-2 text-left text-[12px] hover:bg-slate-50 flex items-center gap-2 text-slate-700">
            <Pencil className="w-3.5 h-3.5 text-slate-400" />
            编辑显示名称
          </button>
          <button
            onClick={() => { onDelete(); closeMenu(); }}
            className="w-full px-3 py-2 text-left text-[12px] hover:bg-red-50 flex items-center gap-2 text-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
            删除
          </button>
        </div>
      )}
    </div>
  );
}

function DropZone({
  children,
  onDrop,
  dashed,
}: {
  children: React.ReactNode;
  onDrop: (field: string) => void;
  dashed?: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const field = e.dataTransfer.getData("field");
        if (field) onDrop(field);
      }}
      className={`min-h-[36px] rounded transition-colors ${
        dragOver
          ? "bg-blue-50 border-2 border-blue-400"
          : dashed
          ? "border-2 border-dashed border-slate-200"
          : "border border-slate-200 bg-slate-50"
      }`}
    >
      {children}
    </div>
  );
}

function DataPanel() {
  const [selectedDataset, setSelectedDataset] = useState<string>("school");
  const [showDatasetMenu, setShowDatasetMenu] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [refreshEnabled, setRefreshEnabled] = useState(true);
  const [refreshSeconds, setRefreshSeconds] = useState("5");
  const [fieldSearch, setFieldSearch] = useState("");

  const [dimensionFields, setDimensionFields] = useState<FieldItem[]>([
    { name: "店铺", aggregation: "求和", sort: "无" },
  ]);
  const [metricFields, setMetricFields] = useState<FieldItem[]>([
    { name: "金额", aggregation: "求和", sort: "无" },
  ]);
  const [drillFields, setDrillFields] = useState<FieldItem[]>([]);

  const datasets = [
    { id: "school", name: "茶饮原料费用", dimensions: ["店铺", "日期", "用途"], metrics: ["金额", "记录数"] },
    { id: "sales", name: "销售数据", dimensions: ["地区", "时间", "产品"], metrics: ["销售额", "数量"] }
  ];

  const currentDataset = datasets.find(d => d.id === selectedDataset);

  const addField = (name: string, target: "dimension" | "metric" | "drill") => {
    const item: FieldItem = { name, aggregation: "求和", sort: "无" };
    if (target === "dimension") setDimensionFields(prev => [...prev, item]);
    else if (target === "metric") setMetricFields(prev => [...prev, item]);
    else setDrillFields(prev => [...prev, item]);
  };

  const filteredDimensions = currentDataset?.dimensions.filter(d =>
    d.includes(fieldSearch)
  ) ?? [];
  const filteredMetrics = currentDataset?.metrics.filter(m =>
    m.includes(fieldSearch)
  ) ?? [];

  return (
    <div className="flex h-full">
      {/* Left side - Configuration */}
      <div className="w-[220px] border-r border-slate-200 overflow-y-auto">
        <div className="p-2 flex flex-col gap-2">

          {/* Chart type selector */}
          <div>
            <label className="text-[11px] text-slate-500 mb-1 block">切换图表</label>
            <div className="h-7 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between cursor-pointer hover:border-blue-400">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[12px] text-slate-700">基础柱状图</span>
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          {/* Dimension zone */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-slate-600 font-medium">
                类别轴 / 维度 <span className="text-red-400">*</span>
              </label>
              <button onClick={() => setDimensionFields([])} className="text-slate-300 hover:text-slate-500">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <DropZone dashed onDrop={(f) => addField(f, "dimension")}>
              {dimensionFields.length > 0 ? (
                <div className="p-1 flex flex-col gap-1">
                  {dimensionFields.map((f, i) => (
                    <FieldTag key={i} field={f} isMetric={false}
                      onDelete={() => setDimensionFields(prev => prev.filter((_, idx) => idx !== i))}
                      onUpdate={(u) => setDimensionFields(prev => prev.map((x, idx) => idx === i ? { ...x, ...u } : x))} />
                  ))}
                </div>
              ) : (
                <div className="p-1.5"><span className="text-[11px] text-slate-400">拖拽字段至此处</span></div>
              )}
            </DropZone>
          </div>

          {/* Metric zone */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-slate-600 font-medium">
                值轴 / 指标 <span className="text-red-400">*</span>
              </label>
              <button onClick={() => setMetricFields([])} className="text-slate-300 hover:text-slate-500">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <DropZone dashed onDrop={(f) => addField(f, "metric")}>
              {metricFields.length > 0 ? (
                <div className="p-1 flex flex-col gap-1">
                  {metricFields.map((f, i) => (
                    <FieldTag key={i} field={f} isMetric={true}
                      onDelete={() => setMetricFields(prev => prev.filter((_, idx) => idx !== i))}
                      onUpdate={(u) => setMetricFields(prev => prev.map((x, idx) => idx === i ? { ...x, ...u } : x))} />
                  ))}
                </div>
              ) : (
                <div className="p-1.5"><span className="text-[11px] text-slate-400">拖拽字段至此处</span></div>
              )}
            </DropZone>
          </div>

          {/* Drill zone */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-slate-600 font-medium">
                钻取 / 尺寸 <span className="text-slate-400 text-[10px]">ⓘ</span>
              </label>
              <button onClick={() => setDrillFields([])} className="text-slate-300 hover:text-slate-500">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <DropZone onDrop={(f) => addField(f, "drill")}>
              {drillFields.length > 0 ? (
                <div className="p-1 flex flex-col gap-1">
                  {drillFields.map((f, i) => (
                    <FieldTag key={i} field={f} isMetric={false} showSort={false}
                      onDelete={() => setDrillFields(prev => prev.filter((_, idx) => idx !== i))}
                      onUpdate={(u) => setDrillFields(prev => prev.map((x, idx) => idx === i ? { ...x, ...u } : x))} />
                  ))}
                </div>
              ) : (
                <div className="p-1.5"><span className="text-[11px] text-slate-400">拖动字段至此处</span></div>
              )}
            </DropZone>
          </div>

          {/* Filter */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-slate-600 font-medium">过滤器</label>
              <button className="text-slate-300 hover:text-slate-500"><Trash2 className="w-3 h-3" /></button>
            </div>
            <button
              onClick={() => setShowFilterDialog(true)}
              className="w-full h-7 px-2 bg-white border border-slate-200 rounded flex items-center justify-center gap-1.5 hover:border-blue-400 transition-colors text-[12px] text-slate-600"
            >
              <Filter className="w-3.5 h-3.5" />
              过滤
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* Refresh rate */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="refresh-cb" checked={refreshEnabled}
              onChange={e => setRefreshEnabled(e.target.checked)} className="w-3.5 h-3.5 accent-blue-500" />
            <label htmlFor="refresh-cb" className="text-[12px] text-slate-600 cursor-pointer">刷新频率</label>
          </div>
          {refreshEnabled && (
            <div className="flex items-center gap-1.5 ml-5">
              <input type="number" value={refreshSeconds} onChange={e => setRefreshSeconds(e.target.value)}
                className="w-14 h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400 text-center" />
              <div className="h-7 px-2 border border-slate-200 rounded flex items-center gap-1 text-[12px] text-slate-600 bg-white cursor-pointer hover:border-blue-400">
                秒 <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          )}

          <button className="w-full h-8 bg-blue-500 text-white rounded text-[13px] font-medium hover:bg-blue-600 transition-colors">
            更新图表数据
          </button>
        </div>
      </div>

      {/* Right side - Dataset fields */}
      <div className="w-[160px] flex flex-col bg-slate-50 overflow-hidden">
        <div className="p-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] text-slate-500 font-medium">数据集</label>
            <RotateCcw className="w-3 h-3 text-slate-400 cursor-pointer hover:text-blue-500" />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDatasetMenu(!showDatasetMenu)}
              className="w-full h-8 px-2 bg-white border border-slate-200 rounded flex items-center justify-between text-[11px] hover:border-blue-400"
            >
              <span className="text-slate-700 truncate">{currentDataset?.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
            </button>
            {showDatasetMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded shadow-lg z-10">
                {datasets.map(ds => (
                  <button
                    key={ds.id}
                    onClick={() => { setSelectedDataset(ds.id); setShowDatasetMenu(false); }}
                    className="w-full px-2 py-1.5 text-left text-[11px] hover:bg-slate-50"
                  >
                    {ds.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] text-slate-600 font-medium">字段</label>
            <RotateCcw className="w-3 h-3 text-slate-400 cursor-pointer hover:text-blue-500" />
          </div>
          <div className="relative mb-2">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="搜索字段"
              value={fieldSearch}
              onChange={e => setFieldSearch(e.target.value)}
              className="w-full h-7 pl-6 pr-2 text-[11px] bg-white border border-slate-200 rounded outline-none focus:border-blue-400"
            />
          </div>

          {filteredDimensions.length > 0 && (
            <div className="mb-3">
              <div className="text-[11px] text-slate-500 mb-1.5">维度</div>
              <div className="space-y-1">
                {filteredDimensions.map(dim => (
                  <div
                    key={dim}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("field", dim)}
                    className="flex items-center gap-1 px-2 py-1.5 bg-white rounded text-[11px] cursor-move hover:bg-blue-50 border border-slate-200"
                  >
                    <span className="text-blue-500 shrink-0">T</span>
                    <span className="text-slate-700 truncate">{dim}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredMetrics.length > 0 && (
            <div>
              <div className="text-[11px] text-slate-500 mb-1.5">指标</div>
              <div className="space-y-1">
                {filteredMetrics.map(metric => (
                  <div
                    key={metric}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("field", metric)}
                    className="flex items-center gap-1 px-2 py-1.5 bg-white rounded text-[11px] cursor-move hover:bg-green-50 border border-slate-200"
                  >
                    <span className="text-green-600 shrink-0">#</span>
                    <span className="text-slate-700 truncate">{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <FilterDialog
        open={showFilterDialog}
        onClose={() => setShowFilterDialog(false)}
        fields={currentDataset ? [
          ...currentDataset.dimensions.map(d => ({ name: d, type: "dimension" })),
          ...currentDataset.metrics.map(m => ({ name: m, type: "metric" }))
        ] : []}
        onConfirm={(conditions, logic) => {
          console.log("Filter conditions:", conditions, logic);
        }}
      />
    </div>
  );
}

function PlaceholderPanel({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-full text-slate-400 text-[13px]">
      {label}配置（即将上线）
    </div>
  );
}