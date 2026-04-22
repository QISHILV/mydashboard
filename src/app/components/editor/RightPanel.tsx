import React, { useState, useRef, useEffect } from "react";
import { Trash2, ChevronDown, ChevronRight, Filter, Palette, Sparkles, BarChart3, Zap, Pencil, ArrowUpDown, Sigma, RotateCcw, Search, Plus, X, Info } from "lucide-react";
import { FilterDialog } from "./FilterDialog";

const tabs = [
  { id: "customize", label: "定制", Icon: Palette },
  { id: "animation", label: "动画", Icon: Sparkles },
  { id: "data", label: "数据", Icon: BarChart3 },
  { id: "advanced", label: "高级", Icon: Zap },
];

interface RightPanelProps {
  selectedChartId: string | null;
  selectedChartType: string | null;
  selectedChartConfig: any;
  onUpdateChart: (updates: any) => void;
}

export function RightPanel({ selectedChartId, selectedChartType, selectedChartConfig, onUpdateChart }: RightPanelProps) {
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
        {selectedChartType === "batch-container" ? (
          <div className="h-full overflow-y-auto p-3">
            <BatchContainerPanel selectedChartConfig={selectedChartConfig} onUpdateChart={onUpdateChart} />
          </div>
        ) : (
          <>
            {activeTab === "customize" && <div className="h-full overflow-y-auto p-3"><CustomizePanel /></div>}
            {activeTab === "animation" && <div className="h-full overflow-y-auto p-3"><PlaceholderPanel label="动画" /></div>}
            {activeTab === "data" && <DataPanel selectedChartConfig={selectedChartConfig} onUpdateChart={onUpdateChart} />}
            {activeTab === "advanced" && <div className="h-full overflow-y-auto p-3"><AdvancedPanel /></div>}
          </>
        )}
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

function DataPanel({ selectedChartConfig, onUpdateChart }: { selectedChartConfig: any; onUpdateChart: (updates: any) => void }) {
  const [selectedDataset, setSelectedDataset] = useState<string>(selectedChartConfig?.datasetId || "school");
  const [showDatasetMenu, setShowDatasetMenu] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [refreshEnabled, setRefreshEnabled] = useState(true);
  const [refreshSeconds, setRefreshSeconds] = useState("5");
  const [fieldSearch, setFieldSearch] = useState("");

  const [dimensionFields, setDimensionFields] = useState<FieldItem[]>(selectedChartConfig?.dimensions || []);
  const [metricFields, setMetricFields] = useState<FieldItem[]>(selectedChartConfig?.metrics || []);
  const [drillFields, setDrillFields] = useState<FieldItem[]>([]);

  const datasets = [
    { id: "school", name: "茶饮原料费用", dimensions: ["店铺", "日期", "用途"], metrics: ["金额", "记录数"] },
    { id: "sales", name: "销售数据", dimensions: ["地区", "时间", "产品"], metrics: ["销售额", "数量"] }
  ];

  const currentDataset = datasets.find(d => d.id === selectedDataset);

  const addField = (name: string, target: "dimension" | "metric" | "drill") => {
    const item: FieldItem = { name, aggregation: "求和", sort: "无" };
    if (target === "dimension") {
      const newDimensions = [...dimensionFields, item];
      setDimensionFields(newDimensions);
      onUpdateChart({ dimensions: newDimensions });
    } else if (target === "metric") {
      const newMetrics = [...metricFields, item];
      setMetricFields(newMetrics);
      onUpdateChart({ metrics: newMetrics });
    } else {
      const newDrillFields = [...drillFields, item];
      setDrillFields(newDrillFields);
    }
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
                      onDelete={() => {
                        const newDimensions = dimensionFields.filter((_, idx) => idx !== i);
                        setDimensionFields(newDimensions);
                        onUpdateChart({ dimensions: newDimensions });
                      }}
                      onUpdate={(u) => {
                        const newDimensions = dimensionFields.map((x, idx) => idx === i ? { ...x, ...u } : x);
                        setDimensionFields(newDimensions);
                        onUpdateChart({ dimensions: newDimensions });
                      }} />
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
                      onDelete={() => {
                        const newMetrics = metricFields.filter((_, idx) => idx !== i);
                        setMetricFields(newMetrics);
                        onUpdateChart({ metrics: newMetrics });
                      }}
                      onUpdate={(u) => {
                        const newMetrics = metricFields.map((x, idx) => idx === i ? { ...x, ...u } : x);
                        setMetricFields(newMetrics);
                        onUpdateChart({ metrics: newMetrics });
                      }} />
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
                      onDelete={() => {
                        const newDrillFields = drillFields.filter((_, idx) => idx !== i);
                        setDrillFields(newDrillFields);
                      }}
                      onUpdate={(u) => {
                        const newDrillFields = drillFields.map((x, idx) => idx === i ? { ...x, ...u } : x);
                        setDrillFields(newDrillFields);
                      }} />
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
                  onClick={() => { 
                    setSelectedDataset(ds.id); 
                    setShowDatasetMenu(false);
                    onUpdateChart({ datasetId: ds.id });
                  }}
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

function ConditionalStylePanel() {
  const [rules, setRules] = useState([
    {
      id: 1,
      field: "金额",
      condition: "大于",
      value: "1000",
      styles: {
        textColor: "#ef4444",
        backgroundColor: "#fef2f2",
        borderColor: "#ef4444"
      }
    },
    {
      id: 2,
      field: "金额",
      condition: "小于",
      value: "500",
      styles: {
        textColor: "#10b981",
        backgroundColor: "#d1fae5",
        borderColor: "#10b981"
      }
    }
  ]);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({
    field: "金额",
    condition: "大于",
    value: "",
    styles: {
      textColor: "#ef4444",
      backgroundColor: "#fef2f2",
      borderColor: "#ef4444"
    }
  });

  const fields = ["金额", "数量", "记录数"];
  const conditions = ["大于", "小于", "等于", "包含"];

  const addRule = () => {
    if (newRule.value) {
      setRules([...rules, { ...newRule, id: Date.now() }]);
      setShowAddRule(false);
      setNewRule({
        field: "金额",
        condition: "大于",
        value: "",
        styles: {
          textColor: "#ef4444",
          backgroundColor: "#fef2f2",
          borderColor: "#ef4444"
        }
      });
    }
  };

  const deleteRule = (id: number) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[12px] text-slate-800 font-medium">条件样式规则</h3>
        <button
          onClick={() => setShowAddRule(!showAddRule)}
          className="text-[12px] text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <span>+ 添加规则</span>
        </button>
      </div>

      {showAddRule && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="text-[11px] text-slate-600 mb-1 block">字段</label>
              <select
                value={newRule.field}
                onChange={(e) => setNewRule({ ...newRule, field: e.target.value })}
                className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
              >
                {fields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-600 mb-1 block">条件</label>
              <select
                value={newRule.condition}
                onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
              >
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="text-[11px] text-slate-600 mb-1 block">阈值</label>
            <input
              type="text"
              value={newRule.value}
              onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
              placeholder="输入阈值"
              className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <label className="text-[11px] text-slate-600 mb-1 block">文字颜色</label>
              <input
                type="color"
                value={newRule.styles.textColor}
                onChange={(e) => setNewRule({ ...newRule, styles: { ...newRule.styles, textColor: e.target.value } })}
                className="w-full h-7 border border-slate-200 rounded"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 mb-1 block">背景颜色</label>
              <input
                type="color"
                value={newRule.styles.backgroundColor}
                onChange={(e) => setNewRule({ ...newRule, styles: { ...newRule.styles, backgroundColor: e.target.value } })}
                className="w-full h-7 border border-slate-200 rounded"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 mb-1 block">边框颜色</label>
              <input
                type="color"
                value={newRule.styles.borderColor}
                onChange={(e) => setNewRule({ ...newRule, styles: { ...newRule.styles, borderColor: e.target.value } })}
                className="w-full h-7 border border-slate-200 rounded"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAddRule(false)}
              className="px-3 py-1.5 text-[12px] border border-slate-200 rounded hover:bg-slate-50"
            >
              取消
            </button>
            <button
              onClick={addRule}
              className="px-3 py-1.5 text-[12px] bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              保存规则
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {rules.map((rule, index) => (
          <div key={rule.id} className="bg-white border border-slate-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-500">规则 {index + 1}</span>
              <button
                onClick={() => deleteRule(rule.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <div className="text-[12px] text-slate-700 mb-2">
              {rule.field} {rule.condition} {rule.value}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-slate-600 mb-1 block">文字颜色</label>
                <div className="w-full h-6 rounded border border-slate-200" style={{ backgroundColor: rule.styles.textColor }} />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 mb-1 block">背景颜色</label>
                <div className="w-full h-6 rounded border border-slate-200" style={{ backgroundColor: rule.styles.backgroundColor }} />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 mb-1 block">边框颜色</label>
                <div className="w-full h-6 rounded border border-slate-200" style={{ backgroundColor: rule.styles.borderColor }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-[12px]">
          暂无条件样式规则
          <p className="text-[11px] mt-1 text-slate-300">点击添加规则按钮创建第一条规则</p>
        </div>
      )}
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

function AdvancedPanel() {
  const [conditionalStyleEnabled, setConditionalStyleEnabled] = useState(false);
  const [showConditionalStyleDialog, setShowConditionalStyleDialog] = useState(false);
  const [conditions, setConditions] = useState([
    {
      id: 1,
      field: "金额",
      styles: [
        {
          id: 1,
          condition: "等于",
          value: "1",
          textColor: "#ef4444",
          backgroundColor: "#ef4444",
          text: ""
        },
        {
          id: 2,
          condition: "等于",
          value: "2",
          textColor: "#f59e0b",
          backgroundColor: "#f59e0b",
          text: ""
        },
        {
          id: 3,
          condition: "等于",
          value: "3",
          textColor: "#10b981",
          backgroundColor: "#10b981",
          text: ""
        }
      ]
    }
  ]);

  const addStyle = (conditionId: number) => {
    setConditions(conditions.map(condition => {
      if (condition.id === conditionId) {
        return {
          ...condition,
          styles: [
            ...condition.styles,
            {
              id: Date.now(),
              condition: "等于",
              value: "",
              textColor: "#ef4444",
              backgroundColor: "#ef4444",
              text: ""
            }
          ]
        };
      }
      return condition;
    }));
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: Date.now(),
        field: "金额",
        styles: []
      }
    ]);
  };

  const deleteStyle = (conditionId: number, styleId: number) => {
    setConditions(conditions.map(condition => {
      if (condition.id === conditionId) {
        return {
          ...condition,
          styles: condition.styles.filter(style => style.id !== styleId)
        };
      }
      return condition;
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 条件样式 */}
      <div className="border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-slate-500" />
            <span className="text-[12px] text-slate-700 font-medium">条件样式</span>
          </div>
          <button 
            onClick={() => setConditionalStyleEnabled(!conditionalStyleEnabled)}
            className={`w-8 h-[18px] rounded-full relative transition-colors ${conditionalStyleEnabled ? "bg-blue-500" : "bg-slate-300"}`}
          >
            <span className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${conditionalStyleEnabled ? "right-0.5" : "left-0.5"}`} />
          </button>
        </div>
        
        {conditionalStyleEnabled && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-slate-700">条件样式设置</span>
              <button 
                onClick={() => setShowConditionalStyleDialog(true)}
                className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {conditions.length > 0 && (
              <div className="space-y-4">
                {conditions.map((condition) => (
                  <div key={condition.id}>
                    <div className="text-[12px] text-slate-700 font-medium mb-1"># {condition.field}</div>
                    {condition.styles.map((style, index) => (
                      <div key={style.id} className="flex items-center gap-2 text-[12px] text-slate-700">
                        <span>{style.condition}</span>
                        <span className="text-slate-500">固定值</span>
                        <span>{style.value}</span>
                        <div className="flex items-center gap-1 ml-auto">
                          <div className="w-5 h-5 rounded border border-slate-200" style={{ backgroundColor: style.textColor }} />
                          <div className="w-5 h-5 rounded border border-slate-200" style={{ backgroundColor: style.backgroundColor }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 条件样式对话框 */}
      {showConditionalStyleDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-[600px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] text-slate-800 font-medium">条件样式</h3>
              <button 
                onClick={() => setShowConditionalStyleDialog(false)}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[13px] text-blue-700">
                  提示：请勿重复选择字段，若同一字段重复配置，则只有最后的字段配置生效
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {conditions.map((condition) => (
                <div key={condition.id} className="space-y-4">
                  {/* 字段选择 */}
                  <div className="flex items-center justify-between">
                    <select className="flex-1 h-8 px-3 border border-slate-200 rounded text-[13px] text-slate-700 outline-none focus:border-blue-300">
                      <option value="amount" selected={condition.field === "金额"}>金额</option>
                      <option value="quantity" selected={condition.field === "数量"}>数量</option>
                      <option value="records" selected={condition.field === "记录数"}>记录数</option>
                    </select>
                  </div>
                  
                  {/* 条件列表 */}
                  <div className="space-y-3">
                    {condition.styles.map((style) => (
                      <div key={style.id} className="flex items-center gap-2">
                        <select className="w-20 h-8 px-2 border border-slate-200 rounded text-[13px] text-slate-700 outline-none focus:border-blue-300">
                          <option value="equal" selected={style.condition === "等于"}>等于</option>
                          <option value="greater" selected={style.condition === "大于"}>大于</option>
                          <option value="less" selected={style.condition === "小于"}>小于</option>
                          <option value="contains" selected={style.condition === "包含"}>包含</option>
                        </select>
                        <input 
                          type="text" 
                          value={style.value} 
                          className="w-24 h-8 px-2 border border-slate-200 rounded text-[13px] text-slate-700 outline-none focus:border-blue-300"
                        />
                        <div className="flex items-center gap-1">
                          <ArrowUpDown className="w-4 h-4 text-slate-500" />
                        </div>
                        <select className="w-24 h-8 px-2 border border-slate-200 rounded text-[13px] text-slate-700 outline-none focus:border-blue-300">
                          <option value="self" selected>自己</option>
                          <option value="parent">父级</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[13px] text-slate-700">文字</span>
                            <div 
                              className="w-6 h-6 rounded border border-slate-200 cursor-pointer"
                              style={{ backgroundColor: style.textColor }}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[13px] text-slate-700">背景</span>
                            <div 
                              className="w-6 h-6 rounded border border-slate-200 cursor-pointer"
                              style={{ backgroundColor: style.backgroundColor }}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[13px] text-slate-700">文本</span>
                            <input 
                              type="text" 
                              value={style.text} 
                              className="w-24 h-8 px-2 border border-slate-200 rounded text-[13px] text-slate-700 outline-none focus:border-blue-300"
                              placeholder="输入文本"
                            />
                          </div>
                          <button 
                            onClick={() => deleteStyle(condition.id, style.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* 添加样式按钮 */}
                    <button 
                      onClick={() => addStyle(condition.id)}
                      className="flex items-center gap-1 text-[13px] text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>添加样式</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {/* 添加条件按钮 */}
              <button 
                onClick={addCondition}
                className="flex items-center gap-1 text-[13px] text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加条件</span>
              </button>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setShowConditionalStyleDialog(false)}
                className="px-4 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setShowConditionalStyleDialog(false);
                  // 保存条件样式
                }}
                className="px-4 py-1.5 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BatchContainerPanel({ selectedChartConfig, onUpdateChart }: { selectedChartConfig: any; onUpdateChart: (updates: any) => void }) {
  // 容器基础配置
  const [containerName, setContainerName] = useState(selectedChartConfig?.containerName || "批量容器");
  const [containerWidth, setContainerWidth] = useState(selectedChartConfig?.containerWidth || "420");
  const [containerHeight, setContainerHeight] = useState(selectedChartConfig?.containerHeight || "280");
  const [layoutMode, setLayoutMode] = useState(selectedChartConfig?.layoutMode || "grid");
  const [horizontalGap, setHorizontalGap] = useState(selectedChartConfig?.horizontalGap || "10");
  const [verticalGap, setVerticalGap] = useState(selectedChartConfig?.verticalGap || "10");
  const [marginTop, setMarginTop] = useState(selectedChartConfig?.marginTop || "0");
  const [marginBottom, setMarginBottom] = useState(selectedChartConfig?.marginBottom || "0");
  const [marginLeft, setMarginLeft] = useState(selectedChartConfig?.marginLeft || "0");
  const [marginRight, setMarginRight] = useState(selectedChartConfig?.marginRight || "0");

  // 元组件配置
  const [metaComponent, setMetaComponent] = useState(selectedChartConfig?.metaComponent || "indicator-card");
  const [metaWidth, setMetaWidth] = useState(selectedChartConfig?.metaWidth || "120");
  const [metaHeight, setMetaHeight] = useState(selectedChartConfig?.metaHeight || "100");
  const [countMode, setCountMode] = useState(selectedChartConfig?.countMode || "fixed");
  const [fixedCount, setFixedCount] = useState(selectedChartConfig?.fixedCount || "6");
  const [dataSource, setDataSource] = useState(selectedChartConfig?.dataSource || "device-data");

  // 样式配置
  const [containerBackground, setContainerBackground] = useState(selectedChartConfig?.containerBackground || "#ffffff");
  const [containerBorder, setContainerBorder] = useState(selectedChartConfig?.containerBorder || "#e2e8f0");
  const [containerRadius, setContainerRadius] = useState(selectedChartConfig?.containerRadius || "4");
  const [emptyText, setEmptyText] = useState(selectedChartConfig?.emptyText || "暂无数据");

  // 保存配置
  const handleSaveConfig = () => {
    const config = {
      containerName,
      containerWidth,
      containerHeight,
      layoutMode,
      horizontalGap,
      verticalGap,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      metaComponent,
      metaWidth,
      metaHeight,
      countMode,
      fixedCount,
      dataSource,
      containerBackground,
      containerBorder,
      containerRadius,
      emptyText
    };
    onUpdateChart(config);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 容器基础配置 */}
      <div className="border border-slate-200 rounded-lg p-3">
        <h3 className="text-[12px] text-slate-800 font-medium mb-3">容器基础配置</h3>
        
        <div className="space-y-3">
          {/* 容器名称 */}
          <div>
            <label className="text-[11px] text-slate-600 mb-1 block">容器名称</label>
            <input
              type="text"
              value={containerName}
              onChange={(e) => setContainerName(e.target.value)}
              className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
            />
          </div>

          {/* 容器尺寸 */}
          <div>
            <label className="text-[11px] text-slate-600 mb-1 block">容器尺寸</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={containerWidth}
                  onChange={(e) => setContainerWidth(e.target.value)}
                  className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
                  placeholder="宽度"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={containerHeight}
                  onChange={(e) => setContainerHeight(e.target.value)}
                  className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
                  placeholder="高度"
                />
              </div>
            </div>
          </div>

          {/* 布局模式 */}
          <div>
            <label className="text-[11px] text-slate-600 mb-1 block">布局模式</label>
            <select
              value={layoutMode}
              onChange={(e) => setLayoutMode(e.target.value)}
              className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
            >
              <option value="grid">网格布局</option>
              <option value="flow">流式布局</option>
            </select>
          </div>

          {/* 间距配置 */}
          <div>
            <label className="text-[11px] text-slate-600 mb-1 block">间距配置</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={horizontalGap}
                  onChange={(e) => setHorizontalGap(e.target.value)}
                  className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
                  placeholder="水平间距"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={verticalGap}
                  onChange={(e) => setVerticalGap(e.target.value)}
                  className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
                  placeholder="垂直间距"
                />
              </div>
            </div>
          </div>

          {/* 边距配置 */}
          <div>
            <label className="text-[11px] text-slate-600 mb-1 block">边距配置</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  value={marginTop}
                  onChange={(e) => setMarginTop(e.target.value)}
                  className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
                  placeholder="上边距"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={marginBottom}
                  onChange={(e) => setMarginBottom(e.target.value)}
                  className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
                  placeholder="下边距"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={marginLeft}
                  onChange={(e) => setMarginLeft(e.target.value)}
                  className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
                  placeholder="左边距"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={marginRight}
                  onChange={(e) => setMarginRight(e.target.value)}
                  className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
                  placeholder="右边距"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 元组件配置 */}
      <div className="border border-slate-200 rounded-lg p-3">
        <h3 className="text-[12px] text-slate-800 font-medium mb-3">元组件配置</h3>
        
        <div className="space-y-3">
          {/* 元组件选择 */}
          <div>
            <label className="text-[11px] text-slate-600 mb-1 block">元组件选择</label>
            <select
              value={metaComponent}
              onChange={(e) => setMetaComponent(e.target.value)}
              className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
            >
              <option value="indicator-card">指标卡</option>
              <option value="status-card">状态卡片</option>
              <option value="mini-chart">迷你图表</option>
            </select>
          </div>

          {/* 元组件尺寸 */}
          <div>
            <label className="text-[11px] text-slate-600 mb-1 block">元组件尺寸</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={metaWidth}
                  onChange={(e) => setMetaWidth(e.target.value)}
                  className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
                  placeholder="宽度"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={metaHeight}
                  onChange={(e) => setMetaHeight(e.target.value)}
                  className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
                  placeholder="高度"
                />
              </div>
            </div>
          </div>

          {/* 数量控制方式 */}
          <div>
            <label className="text-[11px] text-slate-600 mb-1 block">数量控制方式</label>
            <select
              value={countMode}
              onChange={(e) => setCountMode(e.target.value)}
              className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
            >
              <option value="fixed">固定数量</option>
              <option value="data-driven">数据源驱动</option>
            </select>
          </div>

          {/* 固定数量 */}
          {countMode === "fixed" && (
            <div>
              <label className="text-[11px] text-slate-600 mb-1 block">固定数量</label>
              <input
                type="number"
                value={fixedCount}
                onChange={(e) => setFixedCount(e.target.value)}
                className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
              />
            </div>
          )}

          {/* 数据源绑定 */}
          <div>
            <label className="text-[11px] text-slate-600 mb-1 block">数据源绑定</label>
            <select
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
              className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
            >
              <option value="device-data">设备数据</option>
              <option value="store-data">门店数据</option>
              <option value="sensor-data">传感器数据</option>
            </select>
          </div>
        </div>
      </div>

      {/* 样式配置 */}
      <div className="border border-slate-200 rounded-lg p-3">
        <h3 className="text-[12px] text-slate-800 font-medium mb-3">样式配置</h3>
        
        <div className="space-y-3">
          {/* 容器背景 */}
          <div>
            <label className="text-[11px] text-slate-600 mb-1 block">容器背景</label>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded border border-slate-200" style={{ backgroundColor: containerBackground }} />
              <input
                type="text"
                value={containerBackground}
                onChange={(e) => setContainerBackground(e.target.value)}
                className="flex-1 h-7 px-2 text-[12px] bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* 容器边框 */}
          <div>
            <label className="text-[11px] text-slate-600 mb-1 block">容器边框</label>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded border border-slate-200" style={{ borderColor: containerBorder, backgroundColor: '#ffffff' }} />
              <input
                type="text"
                value={containerBorder}
                onChange={(e) => setContainerBorder(e.target.value)}
                className="flex-1 h-7 px-2 text-[12px] bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* 容器圆角 */}
          <div>
            <label className="text-[11px] text-slate-600 mb-1 block">容器圆角</label>
            <input
              type="range"
              min="0"
              max="20"
              value={containerRadius}
              onChange={(e) => setContainerRadius(e.target.value)}
              className="w-full h-1 bg-slate-200 rounded-full appearance-none accent-blue-500"
            />
          </div>

          {/* 空数据展示 */}
          <div>
            <label className="text-[11px] text-slate-600 mb-1 block">空数据展示</label>
            <input
              type="text"
              value={emptyText}
              onChange={(e) => setEmptyText(e.target.value)}
              className="w-full h-7 px-2 text-[12px] border border-slate-200 rounded outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <button
        onClick={handleSaveConfig}
        className="w-full h-8 bg-blue-500 text-white rounded text-[13px] font-medium hover:bg-blue-600 transition-colors"
      >
        保存配置
      </button>
    </div>
  );
}
