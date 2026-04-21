import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useDashboards, DataSet, DataSource, DataSourceType } from "./DashboardContext";
import { Table2, Plus, Search, Database, X, ChevronRight, ChevronDown, ChevronUp, ChevronLeft, FileText, Copy, Trash2, Eye, Info, Edit3, Shield, FolderPlus, Check, PlayCircle, SlidersHorizontal, MoreHorizontal, Pencil, Download } from "lucide-react";
import { useNavigate } from "react-router";

export function DataConfigPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/data-config/data-sources", { replace: true });
  }, [navigate]);
  return null;
}

// ============ Data Source Type Display Map ============
const typeDisplayMap: Record<DataSourceType, string> = {
  mysql: "MySQL",
  postgresql: "PostgreSQL",
  mongodb: "MongoDB",
  api: "API",
  csv: "CSV",
  excel: "Excel",
  oracle: "Oracle",
  db2: "Db2",
  mariadb: "MariaDB",
  "mongodb-bi": "MongoDB-BI",
  jiaguwen: "甲骨文",
  sqlserver: "SQL Server",
  tidb: "TIDB",
  clickhouse: "ClickHouse",
  doris: "Doris",
  starrocks: "StarRocks",
  hive: "Hive",
  impala: "Impala",
  presto: "Presto",
  hbase: "HBase",
  elasticsearch: "Elasticsearch",
  kafka: "Kafka",
};

// ============ Data Source Icon Component ============
function DataSourceIcon({ type, className = "w-4 h-4" }: { type: DataSourceType; className?: string }) {
  const iconColors: Record<string, string> = {
    mysql: "text-blue-600",
    postgresql: "text-blue-700",
    mongodb: "text-green-600",
    db2: "text-gray-600",
    mariadb: "text-amber-700",
    "mongodb-bi": "text-green-500",
    jiaguwen: "text-red-600",
    sqlserver: "text-red-500",
    tidb: "text-blue-500",
    clickhouse: "text-yellow-500",
    doris: "text-purple-600",
    starrocks: "text-indigo-600",
    hive: "text-yellow-600",
    impala: "text-teal-600",
    presto: "text-blue-400",
    hbase: "text-red-400",
    elasticsearch: "text-yellow-400",
    kafka: "text-gray-700",
    api: "text-orange-500",
    csv: "text-green-500",
    excel: "text-green-600",
    oracle: "text-red-500",
  };
  return <Database className={`${className} ${iconColors[type] || "text-slate-500"}`} />;
}

// ============ Mock table data for data sources ============
const mockTablesForSources: Record<string, Array<{ name: string }>> = {
  "ds-1": [
    { name: "QRTZ_BLOB_TRIGGERS" },
    { name: "QRTZ_日历" },
    { name: "QRTZ_CRON_TRIGGERS" },
    { name: "QRTZ_FIRED_TRIGGERS" },
    { name: "QRTZ_JOB_DETAILS" },
    { name: "QRTZ_LOCKS" },
    { name: "QRTZ_PAUSED_TRIGGER_GRPS" },
    { name: "QRTZ_SCHEDULER_STATE" },
    { name: "QRTZ_SIMPLE_TRIGGERS" },
    { name: "QRTZ_SIMPROP_TRIGGERS" },
    { name: "act_evt_log" },
    { name: "act_ge_bytearray" },
    { name: "act_ge_property" },
    { name: "act_hi_actinst" },
    { name: "act_hi_attachment" },
    { name: "act_hi_comment" },
    { name: "act_hi_detail" },
    { name: "act_hi_identitylink" },
    { name: "act_hi_procinst" },
    { name: "act_hi_taskinst" },
    { name: "act_hi_varinst" },
    { name: "act_id_group" },
    { name: "act_id_info" },
    { name: "act_id_membership" },
    { name: "act_id_user" },
    { name: "act_procdef_info" },
    { name: "act_re_deployment" },
    { name: "act_re_model" },
    { name: "act_re_procdef" },
    { name: "act_ru_deadletter_job" },
    { name: "act_ru_event_subscr" },
    { name: "act_ru_execution" },
    { name: "act_ru_identitylink" },
    { name: "act_ru_integration" },
    { name: "act_ru_job" },
    { name: "act_ru_suspended_job" },
    { name: "act_ru_task" },
    { name: "act_ru_timer_job" },
    { name: "act_ru_variable" },
    { name: "area" },
    { name: "base_user" },
    { name: "chart_view" },
    { name: "core_chart_view" },
    { name: "core_dataset_group" },
    { name: "core_dataset_table" },
    { name: "core_dataset_table_field" },
    { name: "core_datasource" },
    { name: "core_driver" },
    { name: "data_fill_default" },
    { name: "dept" },
  ],
  "ds-9": [
    { name: "QRTZ_BLOB_TRIGGERS" },
    { name: "QRTZ_日历" },
    { name: "QRTZ_CRON_TRIGGERS" },
    { name: "QRTZ_FIRED_TRIGGERS" },
    { name: "QRTZ_JOB_DETAILS" },
    { name: "QRTZ_LOCKS" },
    { name: "QRTZ_PAUSED_TRIGGER_GRPS" },
    { name: "QRTZ_SCHEDULER_STATE" },
    { name: "QRTZ_SIMPLE_TRIGGERS" },
    { name: "QRTZ_SIMPROP_TRIGGERS" },
  ],
};

// Mock field data for table detail modal
interface TableFieldInfo {
  name: string;
  type: string;
  comment: string;
}

interface TableDetailInfo {
  name: string;
  comment: string;
  fields: TableFieldInfo[];
}

function getTableDetail(tableName: string): TableDetailInfo {
  const detailMap: Record<string, TableDetailInfo> = {
    "QRTZ_BLOB_TRIGGERS": {
      name: "QRTZ_BLOB_TRIGGERS",
      comment: "自定义触发器存储（开源作业调度框架Quartz）",
      fields: [
        { name: "SCHED_NAME", type: "文本", comment: "调度名称" },
        { name: "TRIGGER_NAME", type: "文本", comment: "触发器名称" },
        { name: "TRIGGER_GROUP", type: "文本", comment: "触发器组" },
        { name: "BLOB_DATA", type: "文本", comment: "二进制数据" },
      ],
    },
    "QRTZ_日历": {
      name: "QRTZ_日历",
      comment: "Quartz日历信息表",
      fields: [
        { name: "SCHED_NAME", type: "文本", comment: "调度名称" },
        { name: "CALENDAR_NAME", type: "文本", comment: "日历名称" },
        { name: "CALENDAR", type: "文本", comment: "日历数据" },
      ],
    },
    "QRTZ_CRON_TRIGGERS": {
      name: "QRTZ_CRON_TRIGGERS",
      comment: "CRON触发器详情表",
      fields: [
        { name: "SCHED_NAME", type: "文本", comment: "调度名称" },
        { name: "TRIGGER_NAME", type: "文本", comment: "触发器名称" },
        { name: "TRIGGER_GROUP", type: "文本", comment: "触发器组" },
        { name: "CRON_EXPRESSION", type: "文本", comment: "CRON表达式" },
        { name: "TIME_ZONE_ID", type: "文本", comment: "时区ID" },
      ],
    },
  };
  if (detailMap[tableName]) return detailMap[tableName];
  // Fallback
  return {
    name: tableName,
    comment: "",
    fields: [
      { name: "id", type: "数值", comment: "主键ID" },
      { name: "name", type: "文本", comment: "名称" },
      { name: "status", type: "文本", comment: "状态" },
      { name: "created_at", type: "时间", comment: "创建时间" },
    ],
  };
}

// Generate fallback tables for sources not in the map
function getTablesForSource(sourceId: string): Array<{ name: string }> {
  if (mockTablesForSources[sourceId]) return mockTablesForSources[sourceId];
  return [
    { name: "table_users" },
    { name: "table_orders" },
    { name: "table_products" },
    { name: "table_categories" },
    { name: "table_logs" },
  ];
}

// ============ DataSourcesPage ============
export function DataSourcesPage() {
  const { dataSources, dataSets, addDataSource, deleteDataSource, renameDataSource } = useDashboards();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDataSourceId, setSelectedDataSourceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"config" | "tables">("config");
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [tablePage, setTablePage] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [detailModal, setDetailModal] = useState<TableDetailInfo | null>(null);
  const [sshInfoOpen, setSshInfoOpen] = useState(false);
  // More menu / rename / delete states
  const [moreMenuId, setMoreMenuId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [inUseWarning, setInUseWarning] = useState(false);
  const moreMenuRef = React.useRef<HTMLDivElement | null>(null);

  // Default select first data source
  useEffect(() => {
    if (dataSources.length > 0 && !selectedDataSourceId) {
      setSelectedDataSourceId(dataSources[0].id);
    }
  }, [dataSources, selectedDataSourceId]);

  const selectedDS = useMemo(
    () => dataSources.find((ds) => ds.id === selectedDataSourceId) || null,
    [dataSources, selectedDataSourceId]
  );

  const filteredSources = useMemo(
    () => dataSources.filter((ds) => ds.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [dataSources, searchQuery]
  );

  // Tables for current source
  const allTables = useMemo(() => {
    if (!selectedDataSourceId) return [];
    return getTablesForSource(selectedDataSourceId);
  }, [selectedDataSourceId]);

  const filteredTables = useMemo(
    () => allTables.filter((t) => t.name.toLowerCase().includes(tableSearchQuery.toLowerCase())),
    [allTables, tableSearchQuery]
  );

  const totalTables = filteredTables.length;
  const totalPages = Math.ceil(totalTables / tablePageSize);
  const pagedTables = filteredTables.slice((tablePage - 1) * tablePageSize, tablePage * tablePageSize);

  // Reset page when switching source or search
  useEffect(() => {
    setTablePage(1);
  }, [selectedDataSourceId, tableSearchQuery]);

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

  const handleStartRename = (ds: { id: string; name: string }) => {
    setRenameId(ds.id);
    setRenameValue(ds.name);
    setMoreMenuId(null);
  };

  const handleConfirmRename = () => {
    if (renameId && renameValue.trim()) {
      renameDataSource(renameId, renameValue.trim());
    }
    setRenameId(null);
    setRenameValue("");
  };

  const handleDeleteClick = (dsId: string) => {
    setMoreMenuId(null);
    // Check if data source is in use (has datasets referencing it)
    const isUsed = dataSets.some((d) => d.sourceId === dsId);
    if (isUsed) {
      setInUseWarning(true);
    } else {
      setDeleteConfirmId(dsId);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteDataSource(deleteConfirmId);
      if (selectedDataSourceId === deleteConfirmId) {
        setSelectedDataSourceId(null);
      }
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="flex h-full bg-white">
      {/* Left Sidebar - DataSource List */}
      <div className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-200 ${leftCollapsed ? "w-0 overflow-hidden" : "w-[220px]"}`}>
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[15px] text-slate-800 font-medium">数据源</span>
            <button
              onClick={() => navigate("/data-config/data-sources/create")}
              className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
              title="新增数据源"
            >
              <FolderPlus className="w-4 h-4" />
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
          {filteredSources.map((ds) => (
            <div
              key={ds.id}
              className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all mb-0.5 ${selectedDataSourceId === ds.id ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"}`}
              onClick={() => {
                setSelectedDataSourceId(ds.id);
                setActiveTab("config");
              }}
            >
              <DataSourceIcon type={ds.type} className="w-4 h-4 shrink-0" />
              {renameId === ds.id ? (
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
                <span className="text-[13px] truncate flex-1 min-w-0">{ds.name}</span>
              )}
              {renameId !== ds.id && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMoreMenuId(moreMenuId === ds.id ? null : ds.id);
                    }}
                    className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-200/60 transition-all shrink-0"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {moreMenuId === ds.id && (
                    <div
                      ref={moreMenuRef}
                      className="absolute right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-[120px]"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStartRename(ds); }}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        更改名称
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(ds.id); }}
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
        {selectedDS ? (
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
                <DataSourceIcon type={selectedDS.type} className="w-5 h-5" />
                <span className="text-[15px] text-slate-800 font-medium">{selectedDS.name}</span>
                <span className="text-[13px] text-slate-400">创建人:{selectedDS.creator || "管理员"}</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors">
                  <Database className="w-3.5 h-3.5" />
                  新建数据集
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors">
                  <Shield className="w-3.5 h-3.5" />
                  验证
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
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
                  数据源配置
                </button>
                <button
                  onClick={() => setActiveTab("tables")}
                  className={`px-4 py-2.5 text-[14px] transition-all border-b-2 ${activeTab === "tables" ? "border-blue-500 text-blue-600 font-medium" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                  数据源表
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
                        <p className="text-[13px] text-slate-400 mb-1">数据源名称</p>
                        <p className="text-[14px] text-slate-800">{selectedDS.name}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">类型</p>
                        <p className="text-[14px] text-slate-800">{typeDisplayMap[selectedDS.type] || selectedDS.type}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[13px] text-slate-400 mb-1">描述</p>
                        <p className="text-[14px] text-slate-800">{selectedDS.description || "-"}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">主机名/IP地址</p>
                        <p className="text-[14px] text-slate-800">{selectedDS.host || "-"}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1" />
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">端口</p>
                        <p className="text-[14px] text-slate-800">{selectedDS.port || "-"}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">数据库名称</p>
                        <p className="text-[14px] text-slate-800">{selectedDS.database || "-"}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">用户名</p>
                        <p className="text-[14px] text-slate-800">{selectedDS.username || "-"}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-400 mb-1">额外的 JDBC 连接字符串</p>
                        <p className="text-[14px] text-slate-800">{selectedDS.jdbcExtra || "-"}</p>
                      </div>
                    </div>

                    {/* SSH设置 */}
                    <div className="mt-6">
                      <button
                        onClick={() => setSshInfoOpen(!sshInfoOpen)}
                        className="flex items-center gap-1.5 text-blue-500 text-[14px] hover:text-blue-600 transition-colors font-medium"
                      >
                        SSH 设置
                        {sshInfoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {sshInfoOpen && (
                        <div className="mt-4 pl-6 grid grid-cols-2 gap-x-16 gap-y-5">
                          <div>
                            <p className="text-[13px] text-slate-400 mb-1">启用SSH</p>
                            <p className="text-[14px] text-slate-800">未启用</p>
                          </div>
                          <div>
                            <p className="text-[13px] text-slate-400 mb-1">SSH主机</p>
                            <p className="text-[14px] text-slate-800">-</p>
                          </div>
                          <div>
                            <p className="text-[13px] text-slate-400 mb-1">SSH端口</p>
                            <p className="text-[14px] text-slate-800">-</p>
                          </div>
                          <div>
                            <p className="text-[13px] text-slate-400 mb-1">SSH用户名</p>
                            <p className="text-[14px] text-slate-800">-</p>
                          </div>
                          <div>
                            <p className="text-[13px] text-slate-400 mb-1">连接方式</p>
                            <p className="text-[14px] text-slate-800">-</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {activeTab === "tables" && (
                <div className="p-6">
                  {/* Search */}
                  <div className="mb-4">
                    <div className="relative w-[280px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        value={tableSearchQuery}
                        onChange={(e) => setTableSearchQuery(e.target.value)}
                        placeholder="搜索"
                        className="w-full pl-9 pr-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Table */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr_120px] bg-slate-50 border-b border-slate-200">
                      <div className="px-4 py-3 text-[13px] text-slate-600 font-medium">表名</div>
                      <div className="px-4 py-3 text-[13px] text-slate-600 font-medium text-right">操作</div>
                    </div>
                    {/* Rows */}
                    {pagedTables.map((table, idx) => (
                      <div
                        key={table.name}
                        className={`grid grid-cols-[1fr_120px] border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${idx === pagedTables.length - 1 ? "border-b-0" : ""}`}
                      >
                        <div className="px-4 py-3 text-[13px] text-slate-800">{table.name}</div>
                        <div className="px-4 py-3 flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDetailModal(getTableDetail(table.name))}
                            className="flex items-center gap-1 px-2.5 py-1 rounded text-[12px] text-blue-500 hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            查看详情
                          </button>
                        </div>
                      </div>
                    ))}
                    {pagedTables.length === 0 && (
                      <div className="px-4 py-8 text-center text-[13px] text-slate-400">暂无数据表</div>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalTables > 0 && (
                    <div className="flex items-center justify-end gap-3 mt-4 text-[13px] text-slate-600">
                      <span>共 {totalTables} 条</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setTablePage(Math.max(1, tablePage - 1))}
                          disabled={tablePage === 1}
                          className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let page: number;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (tablePage <= 3) {
                            page = i + 1;
                          } else if (tablePage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = tablePage - 2 + i;
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => setTablePage(page)}
                              className={`w-7 h-7 rounded border text-[13px] transition-colors ${page === tablePage ? "border-blue-500 text-blue-600 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        {totalPages > 5 && tablePage < totalPages - 2 && (
                          <>
                            <span className="px-1">...</span>
                            <button
                              onClick={() => setTablePage(totalPages)}
                              className={`w-7 h-7 rounded border text-[13px] border-slate-200 hover:bg-slate-50`}
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setTablePage(Math.min(totalPages, tablePage + 1))}
                          disabled={tablePage === totalPages}
                          className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <select
                          value={tablePageSize}
                          onChange={(e) => {
                            setTablePageSize(Number(e.target.value));
                            setTablePage(1);
                          }}
                          className="px-2 py-1 rounded border border-slate-200 text-[13px] outline-none"
                        >
                          <option value={10}>10条/页</option>
                          <option value={20}>20条/页</option>
                          <option value={50}>50条/页</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>前往</span>
                        <input
                          type="number"
                          min={1}
                          max={totalPages}
                          value={tablePage}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            if (v >= 1 && v <= totalPages) setTablePage(v);
                          }}
                          className="w-12 px-2 py-1 rounded border border-slate-200 text-[13px] text-center outline-none"
                        />
                        <span>页</span>
                      </div>
                    </div>
                  )}

                  {/* Table Detail Modal */}
                  {detailModal && (
                    <div
                      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
                      onClick={() => setDetailModal(null)}
                    >
                      <div
                        className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] flex flex-col shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-[16px] text-slate-800 font-medium">详情</h3>
                          <button
                            onClick={() => setDetailModal(null)}
                            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 mb-5">
                          <div>
                            <p className="text-[13px] text-slate-400 mb-0.5">表名</p>
                            <p className="text-[14px] text-slate-800">{detailModal.name}</p>
                          </div>
                          <div>
                            <p className="text-[13px] text-slate-400 mb-0.5">表备注</p>
                            <p className="text-[14px] text-slate-800">{detailModal.comment || "-"}</p>
                          </div>
                        </div>
                        <div className="border border-slate-200 rounded-lg overflow-hidden flex-1 overflow-y-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-left text-[13px] text-slate-600 font-medium">字段名</th>
                                <th className="px-4 py-3 text-left text-[13px] text-slate-600 font-medium">字段类型</th>
                                <th className="px-4 py-3 text-left text-[13px] text-slate-600 font-medium">字段备注</th>
                              </tr>
                            </thead>
                            <tbody>
                              {detailModal.fields.map((field, idx) => (
                                <tr key={idx} className="border-b border-slate-100 last:border-b-0">
                                  <td className="px-4 py-3 text-[13px] text-slate-800">{field.name}</td>
                                  <td className="px-4 py-3 text-[13px] text-slate-800">
                                    <span className="text-blue-500 mr-1">{field.type === "数值" ? "#" : field.type === "时间" ? "\u23F1" : "T"}</span>
                                    {field.type}
                                  </td>
                                  <td className="px-4 py-3 text-[13px] text-slate-600">{field.comment || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Database className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-slate-600 text-lg mb-2">选择数据源</h3>
            <p className="text-[14px] text-center max-w-md">
              从左侧列表中选择一个数据源，查看其详情和表结构
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
            <p className="text-[14px] text-slate-600 mb-5">确定要删除该数据源吗？删除后不可恢复。</p>
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
    </div>
  );
}
// Data source type categories
const dsTypeCategories = [
  {
    name: "OLTP",
    types: [
      { type: "db2" as DataSourceType, label: "Db2" },
      { type: "mysql" as DataSourceType, label: "MySQL" },
      { type: "mariadb" as DataSourceType, label: "MariaDB" },
      { type: "mongodb-bi" as DataSourceType, label: "MongoDB-BI" },
      { type: "jiaguwen" as DataSourceType, label: "甲骨文" },
      { type: "postgresql" as DataSourceType, label: "PostgreSQL" },
      { type: "sqlserver" as DataSourceType, label: "SQL Server" },
      { type: "tidb" as DataSourceType, label: "TIDB" },
    ],
  },
  {
    name: "OLAP",
    types: [
      { type: "clickhouse" as DataSourceType, label: "ClickHouse" },
      { type: "doris" as DataSourceType, label: "Doris" },
      { type: "starrocks" as DataSourceType, label: "StarRocks" },
    ],
  },
  {
    name: "数据湖",
    types: [
      { type: "hive" as DataSourceType, label: "Hive" },
      { type: "impala" as DataSourceType, label: "Impala" },
      { type: "presto" as DataSourceType, label: "Presto" },
    ],
  },
  {
    name: "API数据",
    types: [
      { type: "api" as DataSourceType, label: "API" },
    ],
  },
  {
    name: "文件",
    types: [
      { type: "csv" as DataSourceType, label: "CSV" },
      { type: "excel" as DataSourceType, label: "Excel" },
    ],
  },
];

export function CreateDataSourcePage() {
  const { addDataSource } = useDashboards();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<DataSourceType>("mysql");
  const [typeSearch, setTypeSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    OLTP: true,
    OLAP: false,
    "数据湖": false,
    "API数据": false,
    "文件": false,
  });
  const [form, setForm] = useState({
    name: "",
    description: "",
    connectionMethod: "hostname" as "hostname" | "jdbc",
    host: "",
    port: "0",
    database: "",
    username: "",
    password: "",
    jdbcExtra: "",
    file: null as File | null,
    apiUrl: "",
    apiMethod: "GET" as "GET" | "POST" | "PUT" | "DELETE",
    apiHeaders: "",
    apiBody: "",
  });
  const [sshOpen, setSshOpen] = useState(false);
  const [sshEnabled, setSshEnabled] = useState(false);
  const [sshForm, setSshForm] = useState({
    host: "",
    port: "",
    username: "",
    authMethod: "password" as "password" | "sshkey",
    password: "",
    sshKey: "",
    sshKeyPassword: "",
  });

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredCategories = useMemo(() => {
    if (!typeSearch) return dsTypeCategories;
    return dsTypeCategories
      .map((cat) => ({
        ...cat,
        types: cat.types.filter((t) => t.label.toLowerCase().includes(typeSearch.toLowerCase())),
      }))
      .filter((cat) => cat.types.length > 0);
  }, [typeSearch]);

  const handleSave = () => {
    if (!form.name) return;
    
    // 对于Excel和CSV类型，不需要连接信息
    if ((selectedType === "excel" || selectedType === "csv") && !form.file) {
      alert("请选择文件");
      return;
    }
    
    // 对于API类型，需要URL
    if (selectedType === "api" && !form.apiUrl) {
      alert("请输入API URL");
      return;
    }
    
    addDataSource({
      name: form.name,
      type: selectedType,
      description: form.description,
      host: (selectedType !== "excel" && selectedType !== "csv" && selectedType !== "api") ? form.host : undefined,
      port: (selectedType !== "excel" && selectedType !== "csv" && selectedType !== "api") ? (form.port ? parseInt(form.port) : undefined) : undefined,
      database: (selectedType !== "excel" && selectedType !== "csv" && selectedType !== "api") ? form.database : undefined,
      username: (selectedType !== "excel" && selectedType !== "csv" && selectedType !== "api") ? form.username : undefined,
      password: (selectedType !== "excel" && selectedType !== "csv" && selectedType !== "api") ? form.password : undefined,
      jdbcExtra: (selectedType !== "excel" && selectedType !== "csv" && selectedType !== "api") ? form.jdbcExtra : undefined,
      connectionMethod: (selectedType !== "excel" && selectedType !== "csv" && selectedType !== "api") ? form.connectionMethod : undefined,
      apiUrl: selectedType === "api" ? form.apiUrl : undefined,
      apiMethod: selectedType === "api" ? form.apiMethod : undefined,
      apiHeaders: selectedType === "api" ? form.apiHeaders : undefined,
      apiBody: selectedType === "api" ? form.apiBody : undefined,
      fileUrl: (selectedType === "excel" || selectedType === "csv") ? form.file?.name : undefined,
      creator: "管理员",
    });
    navigate("/data-config/data-sources");
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between h-14 px-6 border-b border-slate-200">
        <span className="text-[15px] text-slate-800 font-medium">创建数据源</span>

        {/* Steps */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] ${step >= 1 ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-500"}`}>
              {step > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
            </div>
            <span className={`text-[13px] ${step >= 1 ? "text-slate-800" : "text-slate-400"}`}>选择数据源</span>
          </div>
          <div className="w-16 h-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] ${step === 2 ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-500"}`}>
              2
            </div>
            <span className={`text-[13px] ${step === 2 ? "text-slate-800" : "text-slate-400"}`}>配置信息</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/data-config/data-sources")}
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left - Type Selection */}
        <div className="w-[220px] border-r border-slate-200 flex flex-col">
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={typeSearch}
                onChange={(e) => setTypeSearch(e.target.value)}
                placeholder="搜索"
                className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {filteredCategories.map((cat) => (
              <div key={cat.name} className="mb-1">
                <button
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full flex items-center gap-1.5 px-2 py-2 text-[13px] text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                >
                  {expandedCategories[cat.name] ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className="font-medium">{cat.name}</span>
                </button>
                {expandedCategories[cat.name] && (
                  <div className="ml-3">
                    {cat.types.map((t) => (
                      <button
                        key={t.type}
                        onClick={() => {
                          setSelectedType(t.type);
                          if (step === 1) setStep(2);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${selectedType === t.type && step === 2 ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"}`}
                      >
                        <DataSourceIcon type={t.type} className="w-4 h-4" />
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right - Config Form / Step 1 Prompt */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {step === 1 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Database className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                <p className="text-[14px]">请从左侧选择数据源类型</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-[16px] text-slate-800 font-medium mb-6">{typeDisplayMap[selectedType] || selectedType}</h3>

                <div className="max-w-[680px] space-y-5">
                  {/* 数据源名称 */}
                  <div>
                    <label className="text-[13px] text-slate-700 mb-1.5 block">
                      数据源名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="请输入名称"
                      className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                    />
                  </div>

                  {/* 描述 */}
                  <div>
                    <label className="text-[13px] text-slate-700 mb-1.5 block">描述</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="请输入"
                      maxLength={50}
                      rows={3}
                      className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all resize-none"
                    />
                    <div className="text-right text-[12px] text-slate-400 mt-0.5">{form.description.length}/50</div>
                  </div>

                  {/* 对于Excel和CSV类型，显示文件上传 */}
                  {(selectedType === "excel" || selectedType === "csv") && (
                    <div>
                      <label className="text-[13px] text-slate-700 mb-1.5 block">
                        上传文件 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept={selectedType === "excel" ? ".xlsx,.xls" : ".csv"}
                        onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] || null }))}
                        className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                      />
                      {form.file && (
                        <div className="mt-2 text-[13px] text-slate-600">
                          已选择文件: {form.file.name}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 对于API类型，显示API配置 */}
                  {selectedType === "api" && (
                    <>
                      {/* API URL */}
                      <div>
                        <label className="text-[13px] text-slate-700 mb-1.5 block">
                          API URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.apiUrl}
                          onChange={(e) => setForm((f) => ({ ...f, apiUrl: e.target.value }))}
                          placeholder="请输入API URL"
                          className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                        />
                      </div>

                      {/* API 请求方法 */}
                      <div>
                        <label className="text-[13px] text-slate-700 mb-1.5 block">请求方法</label>
                        <select
                          value={form.apiMethod}
                          onChange={(e) => setForm((f) => ({ ...f, apiMethod: e.target.value as "GET" | "POST" | "PUT" | "DELETE" }))}
                          className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                        >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                        </select>
                      </div>

                      {/* API 请求头 */}
                      <div>
                        <label className="text-[13px] text-slate-700 mb-1.5 block">请求头 (JSON格式)</label>
                        <textarea
                          value={form.apiHeaders}
                          onChange={(e) => setForm((f) => ({ ...f, apiHeaders: e.target.value }))}
                          placeholder='例如: {"Content-Type": "application/json"}'
                          rows={3}
                          className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all font-mono"
                        />
                      </div>

                      {/* API 请求体 */}
                      <div>
                        <label className="text-[13px] text-slate-700 mb-1.5 block">请求体 (JSON格式)</label>
                        <textarea
                          value={form.apiBody}
                          onChange={(e) => setForm((f) => ({ ...f, apiBody: e.target.value }))}
                          placeholder='例如: {"key": "value"}'
                          rows={4}
                          className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all font-mono"
                        />
                      </div>
                    </>
                  )}

                  {/* 对于数据库类型，显示连接信息 */}
                  {(selectedType !== "excel" && selectedType !== "csv" && selectedType !== "api") && (
                    <>
                      {/* 连接方式 */}
                      <div>
                        <label className="text-[13px] text-slate-700 mb-2 block">连接方式</label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="connMethod"
                              checked={form.connectionMethod === "hostname"}
                              onChange={() => setForm((f) => ({ ...f, connectionMethod: "hostname" }))}
                              className="w-4 h-4 text-blue-500 accent-blue-500"
                            />
                            <span className="text-[13px] text-slate-700">主机名</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="connMethod"
                              checked={form.connectionMethod === "jdbc"}
                              onChange={() => setForm((f) => ({ ...f, connectionMethod: "jdbc" }))}
                              className="w-4 h-4 text-blue-500 accent-blue-500"
                            />
                            <span className="text-[13px] text-slate-700">JDBC连接</span>
                          </label>
                        </div>
                      </div>

                      {/* 主机名/IP地址 */}
                      <div>
                        <label className="text-[13px] text-slate-700 mb-1.5 block">
                          主机名/IP地址 <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.host}
                          onChange={(e) => setForm((f) => ({ ...f, host: e.target.value }))}
                          placeholder="请输入主机名/IP地址"
                          className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                        />
                      </div>

                      {/* 端口 */}
                      <div>
                        <label className="text-[13px] text-slate-700 mb-1.5 block">
                          端口 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={form.port}
                          onChange={(e) => setForm((f) => ({ ...f, port: e.target.value }))}
                          className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                        />
                      </div>

                      {/* 数据库名称 */}
                      <div>
                        <label className="text-[13px] text-slate-700 mb-1.5 block">
                          数据库名称 <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.database}
                          onChange={(e) => setForm((f) => ({ ...f, database: e.target.value }))}
                          placeholder="请输入数据库名称"
                          className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                        />
                      </div>

                      {/* 用户名 */}
                      <div>
                        <label className="text-[13px] text-slate-700 mb-1.5 block">用户名</label>
                        <input
                          value={form.username}
                          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                          placeholder="请输入用户名"
                          className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                        />
                      </div>

                      {/* 密码 */}
                      <div>
                        <label className="text-[13px] text-slate-700 mb-1.5 block">密码</label>
                        <input
                          type="password"
                          value={form.password}
                          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                          placeholder="请输入密码"
                          className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                        />
                      </div>

                      {/* 额外的JDBC连接字符串 */}
                      <div>
                        <label className="text-[13px] text-slate-700 mb-1.5 block">额外的 JDBC 连接字符串</label>
                        <input
                          value={form.jdbcExtra}
                          onChange={(e) => setForm((f) => ({ ...f, jdbcExtra: e.target.value }))}
                          placeholder="请输入额外的 JDBC 连接字符串"
                          className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                        />
                      </div>
                    </>
                  )}

                  {/* SSH设置 */}
                  <div>
                    <button
                      onClick={() => setSshOpen(!sshOpen)}
                      className="flex items-center gap-1.5 text-blue-500 text-[13px] hover:text-blue-600 transition-colors"
                    >
                      SSH 设置
                      {sshOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    {sshOpen && (
                      <div className="mt-4 space-y-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sshEnabled}
                            onChange={(e) => setSshEnabled(e.target.checked)}
                            className="w-4 h-4 rounded accent-blue-500"
                          />
                          <span className="text-[13px] text-slate-700">启用SSH</span>
                        </label>
                        {sshEnabled && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-[13px] text-slate-700 mb-1.5 block">主机</label>
                              <input
                                value={sshForm.host}
                                onChange={(e) => setSshForm((f) => ({ ...f, host: e.target.value }))}
                                placeholder="请输入主机名"
                                className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-[13px] text-slate-700 mb-1.5 block">端口</label>
                              <input
                                type="number"
                                value={sshForm.port}
                                onChange={(e) => setSshForm((f) => ({ ...f, port: e.target.value }))}
                                placeholder="请输入 端口"
                                className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-[13px] text-slate-700 mb-1.5 block">用户名</label>
                              <input
                                value={sshForm.username}
                                onChange={(e) => setSshForm((f) => ({ ...f, username: e.target.value }))}
                                placeholder="请输入 用户名"
                                className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-[13px] text-slate-700 mb-2 block">连接方式</label>
                              <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="sshAuthMethod"
                                    checked={sshForm.authMethod === "password"}
                                    onChange={() => setSshForm((f) => ({ ...f, authMethod: "password" }))}
                                    className="w-4 h-4 text-blue-500 accent-blue-500"
                                  />
                                  <span className="text-[13px] text-slate-700">密码</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="sshAuthMethod"
                                    checked={sshForm.authMethod === "sshkey"}
                                    onChange={() => setSshForm((f) => ({ ...f, authMethod: "sshkey" }))}
                                    className="w-4 h-4 text-blue-500 accent-blue-500"
                                  />
                                  <span className="text-[13px] text-slate-700">ssh key</span>
                                </label>
                              </div>
                            </div>
                            {sshForm.authMethod === "password" ? (
                              <div>
                                <label className="text-[13px] text-slate-700 mb-1.5 block">密码</label>
                                <input
                                  type="password"
                                  value={sshForm.password}
                                  onChange={(e) => setSshForm((f) => ({ ...f, password: e.target.value }))}
                                  placeholder="请输入 密码"
                                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                                />
                              </div>
                            ) : (
                              <>
                                <div>
                                  <label className="text-[13px] text-slate-700 mb-1.5 block">SSH Key</label>
                                  <textarea
                                    value={sshForm.sshKey}
                                    onChange={(e) => setSshForm((f) => ({ ...f, sshKey: e.target.value }))}
                                    placeholder="请输入 SSH Key"
                                    rows={4}
                                    className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all resize-none font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="text-[13px] text-slate-700 mb-1.5 block">SSH Key 密码</label>
                                  <input
                                    type="password"
                                    value={sshForm.sshKeyPassword}
                                    onChange={(e) => setSshForm((f) => ({ ...f, sshKeyPassword: e.target.value }))}
                                    placeholder="请输入 SSH Key 密码"
                                    className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
                <button
                  onClick={() => navigate("/data-config/data-sources")}
                  className="px-4 py-2 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  上一步
                </button>
                <button className="px-4 py-2 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors">
                  验证
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.name}
                  className="px-4 py-2 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  保存
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Mock data for datasets ============
interface DataSetField {
  name: string;
  physicalName: string;
  type: "文本" | "数值" | "时间";
  comment: string;
  tableName: string;
  category: "dimension" | "metric";
}

interface DataSetMockData {
  fields: DataSetField[];
  rows: Record<string, string>[];
  totalRows: number;
}

const mockDataSetDetails: Record<string, DataSetMockData> = {
  "dset-1": {
    fields: [
      { name: "能力1", physicalName: "ability1", type: "文本", comment: "能力1", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "能力2", physicalName: "ability2", type: "文本", comment: "能力2", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "能力3", physicalName: "ability3", type: "文本", comment: "能力3", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "能力4", physicalName: "ability4", type: "文本", comment: "能力4", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "能力5", physicalName: "ability5", type: "文本", comment: "能力5", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "公司", physicalName: "company", type: "文本", comment: "公司", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "教育", physicalName: "education", type: "文本", comment: "教育", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "经验", physicalName: "experience", type: "文本", comment: "经验", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "行业", physicalName: "industry", type: "文本", comment: "行业", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "IPO", physicalName: "ipo", type: "文本", comment: "IPO", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "工作", physicalName: "job", type: "文本", comment: "工作", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "地点", physicalName: "location", type: "文本", comment: "地点", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "人们", physicalName: "people", type: "文本", comment: "人们", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "工资", physicalName: "wage", type: "文本", comment: "工资", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "福利", physicalName: "benefit", type: "文本", comment: "福利", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "新产业", physicalName: "newIndustry", type: "文本", comment: "新产业", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "城市", physicalName: "city", type: "文本", comment: "城市", tableName: "excel_Sheet1_ae2a87cf75", category: "dimension" },
      { name: "薪水", physicalName: "salary", type: "数值", comment: "薪水", tableName: "excel_Sheet1_ae2a87cf75", category: "metric" },
    ],
    rows: [
      { "能力1": "商业分析", "能力2": "业务提升", "能力3": "匹配策略", "能力4": "数据分析师", "能力5": "产品运营", "公司": "北京趣象科技有...", "教育": "本科", "城市": "北京" },
      { "能力1": "商业分析", "能力2": "专题研究", "能力3": "互联网数据分析", "能力4": "商业分析", "能力5": "数据监控", "公司": "车好多集团", "教育": "本科", "城市": "北京" },
      { "能力1": "提升策略", "能力2": "现有业务", "能力3": "数据分析师", "能力4": "策略", "能力5": "制定策略", "公司": "聚美优品", "教育": "本科", "城市": "北京" },
      { "能力1": "数据仓库", "能力2": "蜂巢", "能力3": "模型研发", "能力4": "数据应用", "能力5": "业务部门", "公司": "彩食鲜", "教育": "本科", "城市": "北京" },
      { "能力1": "数据仓库", "能力2": "SQL", "能力3": "Python", "能力4": "Excel", "能力5": "Hadoop", "公司": "当当网", "教育": "本科", "城市": "北京" },
      { "能力1": "数据挖掘", "能力2": "数据仓库", "能力3": "ETL", "能力4": "商业分析", "能力5": "蜂巢", "公司": "京东集团", "教育": "硕士", "城市": "北京" },
      { "能力1": "SQL", "能力2": "物联网", "能力3": "Tableau", "能力4": "商业分析", "能力5": "数据分析专员", "公司": "美团点评", "教育": "本科", "城市": "北京" },
      { "能力1": "数据挖掘", "能力2": "商业分析", "能力3": "数据建模", "能力4": "设计业务", "能力5": "业务评价", "公司": "猎桥", "教育": "本科", "城市": "北京" },
      { "能力1": "转化路径", "能力2": "随机森林算法", "能力3": "数据分析师", "能力4": "C端产品", "能力5": "用户分层", "公司": "中国平安", "教育": "本科", "城市": "北京" },
      { "能力1": "数据仓库", "能力2": "蜂巢", "能力3": "深入分析", "能力4": "数据分析师", "能力5": "用户分层", "公司": "新浪网", "教育": "本科", "城市": "北京" },
      { "能力1": "数据挖掘", "能力2": "商业分析", "能力3": "埋点", "能力4": "数学统计类", "能力5": "数据方法", "公司": "活体", "教育": "本科", "城市": "北京" },
      { "能力1": "Python", "能力2": "SQL", "能力3": "SPSS", "能力4": "SAS", "能力5": "数据分析师", "公司": "便利蜂", "教育": "本科", "城市": "北京" },
      { "能力1": "商业分析", "能力2": "数据分析师", "能力3": "两轮车", "能力4": "监控", "能力5": "成本", "公司": "滴滴", "教育": "本科", "城市": "北京" },
      { "能力1": "商业分析", "能力2": "整理业务", "能力3": "商业数据分析", "能力4": "数据体系", "能力5": "业务流程", "公司": "火花思维", "教育": "本科", "城市": "北京" },
      { "能力1": "数据仓库", "能力2": "蜂巢", "能力3": "建模", "能力4": "互联网数据分析", "能力5": "数据分析师", "公司": "映客直播", "教育": "本科", "城市": "北京" },
      { "能力1": "深入分析", "能力2": "实施运营", "能力3": "互联网数据分析", "能力4": "数据分析师", "能力5": "数据分析", "公司": "水滴公司", "教育": "本科", "城市": "北京" },
      { "能力1": "SQL", "能力2": "数据挖掘", "能力3": "数据仓库", "能力4": "数据建模", "能力5": "商业分析", "公司": "快手", "教育": "本科", "城市": "北京" },
    ],
    totalRows: 6407,
  },
  "dset-2": {
    fields: [
      { name: "事件ID", physicalName: "event_id", type: "文本", comment: "事件ID", tableName: "user_events", category: "dimension" },
      { name: "用户ID", physicalName: "user_id", type: "文本", comment: "用户ID", tableName: "user_events", category: "dimension" },
      { name: "行为", physicalName: "action", type: "文本", comment: "行为", tableName: "user_events", category: "dimension" },
      { name: "时间戳", physicalName: "timestamp", type: "时间", comment: "时间戳", tableName: "user_events", category: "dimension" },
      { name: "页面", physicalName: "page", type: "文本", comment: "页面", tableName: "user_events", category: "dimension" },
    ],
    rows: [
      { "事件ID": "evt-001", "用户ID": "u-1001", "行为": "点击", "时间戳": "2024-03-01 10:30", "页面": "首页" },
      { "事件ID": "evt-002", "用户ID": "u-1002", "行为": "浏览", "时间戳": "2024-03-01 11:20", "页面": "产品页" },
      { "事件ID": "evt-003", "用户ID": "u-1001", "行为": "购买", "时间戳": "2024-03-01 14:15", "页面": "结算页" },
      { "事件ID": "evt-004", "用户ID": "u-1003", "行为": "注册", "时间戳": "2024-03-02 09:00", "页面": "注册页" },
    ],
    totalRows: 1283400,
  },
  "dset-3": {
    fields: [
      { name: "SKU", physicalName: "sku", type: "文本", comment: "SKU", tableName: "inventory", category: "dimension" },
      { name: "名称", physicalName: "name", type: "文本", comment: "名称", tableName: "inventory", category: "dimension" },
      { name: "数量", physicalName: "quantity", type: "数值", comment: "数量", tableName: "inventory", category: "metric" },
      { name: "仓库", physicalName: "warehouse", type: "文本", comment: "仓库", tableName: "inventory", category: "dimension" },
      { name: "更新时间", physicalName: "updated_at", type: "时间", comment: "更新时间", tableName: "inventory", category: "dimension" },
    ],
    rows: [
      { "SKU": "SKU-001", "名称": "笔记本电脑", "数量": "120", "仓库": "华东仓", "更新时间": "2024-03-08" },
      { "SKU": "SKU-002", "名称": "鼠标", "数量": "580", "仓库": "华北仓", "更新时间": "2024-03-07" },
      { "SKU": "SKU-003", "名称": "键盘", "数量": "340", "仓库": "华东仓", "更新时间": "2024-03-06" },
      { "SKU": "SKU-004", "名称": "显示器", "数量": "85", "仓库": "华南仓", "更新时间": "2024-03-05" },
    ],
    totalRows: 8320,
  },
};

function getDataSetDetails(datasetId: string): DataSetMockData {
  return mockDataSetDetails[datasetId] || {
    fields: [
      { name: "字段1", physicalName: "field1", type: "文本" as const, comment: "字段1", tableName: "table1", category: "dimension" as const },
      { name: "字段2", physicalName: "field2", type: "数值" as const, comment: "字段2", tableName: "table1", category: "metric" as const },
    ],
    rows: [{ "字段1": "数据1", "字段2": "100" }],
    totalRows: 1,
  };
}

// Mock tables for create dataset page - per data source
const mockCreateTables: Record<string, Array<{ name: string; icon: "table" | "sql" }>> = {
  "ds-1": [
    { name: "自定义SQL", icon: "sql" },
    { name: "excel_Sheet1_ae2a87cf75", icon: "table" },
  ],
  "ds-2": [
    { name: "自定义SQL", icon: "sql" },
    { name: "user_events", icon: "table" },
    { name: "system_logs", icon: "table" },
  ],
  "ds-3": [
    { name: "自定义SQL", icon: "sql" },
    { name: "recruit_data", icon: "table" },
  ],
};

function getCreateTablesForSource(sourceId: string): Array<{ name: string; icon: "table" | "sql" }> {
  return mockCreateTables[sourceId] || [
    { name: "自定义SQL", icon: "sql" },
    { name: "table_data", icon: "table" },
  ];
}

// ============ DataSetsPage ============
export function DataSetsPage() {
  const { dataSets, dataSources, addDataSet, deleteDataSet, renameDataSet, addCalculatedField, updateCalculatedField, deleteCalculatedField } = useDashboards();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDataSetId, setSelectedDataSetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "structure" | "calculated">("preview");
  const [showCalculatedFieldModal, setShowCalculatedFieldModal] = useState(false);
  const [editingCalculatedField, setEditingCalculatedField] = useState<{id: string, fieldName: string, expression: string, dataType: "integer" | "float"} | null>(null);
  const [calculatedFieldForm, setCalculatedFieldForm] = useState({fieldName: "", expression: "", dataType: "integer" as "integer" | "float"});
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  // More menu / rename / delete states
  const [moreMenuId, setMoreMenuId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const moreMenuRef = React.useRef<HTMLDivElement | null>(null);

  // Default select first data set
  useEffect(() => {
    if (dataSets.length > 0 && !selectedDataSetId) {
      setSelectedDataSetId(dataSets[0].id);
    }
  }, [dataSets, selectedDataSetId]);

  const selectedDS = useMemo(
    () => dataSets.find((ds) => ds.id === selectedDataSetId) || null,
    [dataSets, selectedDataSetId]
  );

  const filteredSets = useMemo(
    () => dataSets.filter((ds) => ds.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [dataSets, searchQuery]
  );

  const dsDetails = useMemo(() => {
    if (!selectedDataSetId) return null;
    return getDataSetDetails(selectedDataSetId);
  }, [selectedDataSetId]);

  // Mock folders
  const mockFolders = [
    { id: "folder-1", name: "1", children: [] as string[] },
    { id: "folder-2", name: "【官方示例】", children: [] as string[] },
  ];

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

  const handleStartRename = (ds: { id: string; name: string }) => {
    setRenameId(ds.id);
    setRenameValue(ds.name);
    setMoreMenuId(null);
  };

  const handleConfirmRename = () => {
    if (renameId && renameValue.trim()) {
      renameDataSet(renameId, renameValue.trim());
    }
    setRenameId(null);
    setRenameValue("");
  };

  const handleDeleteClick = (dsId: string) => {
    setMoreMenuId(null);
    // For datasets, we don't check usage - just show confirmation
    setDeleteConfirmId(dsId);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteDataSet(deleteConfirmId);
      if (selectedDataSetId === deleteConfirmId) {
        setSelectedDataSetId(null);
      }
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="flex h-full bg-white">
      {/* Left Sidebar - DataSet List */}
      <div className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-200 ${leftCollapsed ? "w-0 overflow-hidden" : "w-[220px]"}`}>
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[15px] text-slate-800 font-medium">数据集</span>
            <button
              onClick={() => navigate("/data-config/data-sets/create")}
              className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
              title="新增数据集"
            >
              <FolderPlus className="w-4 h-4" />
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
          {filteredSets.map((ds) => (
            <div
              key={ds.id}
              className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all mb-0.5 ${selectedDataSetId === ds.id ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"}`}
              onClick={() => {
                setSelectedDataSetId(ds.id);
                setActiveTab("preview");
              }}
            >
              <Database className={`w-4 h-4 shrink-0 ${selectedDataSetId === ds.id ? "text-blue-500" : "text-slate-400"}`} />
              {renameId === ds.id ? (
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
                <span className="text-[13px] truncate flex-1 min-w-0">{ds.name}</span>
              )}
              {renameId !== ds.id && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMoreMenuId(moreMenuId === ds.id ? null : ds.id);
                    }}
                    className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-200/60 transition-all shrink-0"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {moreMenuId === ds.id && (
                    <div
                      ref={moreMenuRef}
                      className="absolute right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-[120px]"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStartRename(ds); }}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        更改名称
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(ds.id); }}
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
          {/* Folders */}
          {mockFolders.map((folder) => (
            <div key={folder.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all mb-0.5 text-slate-700 hover:bg-slate-50">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <svg className="w-4 h-4 text-amber-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              <span className="text-[13px] truncate">{folder.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedDS && dsDetails ? (
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
                <span className="text-[15px] text-slate-800 font-medium">{selectedDS.name}</span>
                <span className="text-[13px] text-slate-400">创建人:管理员</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // 刷新数据
                    alert('刷新数据功能开发中');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-[13px] hover:bg-slate-200 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  刷新数据
                </button>
                <button
                  onClick={() => {
                    // 导出数据集为CSV
                    if (dsDetails) {
                      const headers = dsDetails.fields.map((field) => field.name).join(",");
                      const rows = dsDetails.rows.map((row) => {
                        return dsDetails.fields.map((field) => {
                          const value = row[field.name];
                          return typeof value === "string" && value.includes(",") ? `"${value}"` : value;
                        }).join(",");
                      });
                      const csvContent = [headers, ...rows].join("\n");
                      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", `${selectedDS.name}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-[13px] hover:bg-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  导出
                </button>
                <button
                  onClick={() => navigate("/data-config/data-sets/create")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  编辑
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 border-b border-slate-200">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-4 py-2.5 text-[14px] transition-all border-b-2 ${activeTab === "preview" ? "border-blue-500 text-blue-600 font-medium" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                  数据预览
                </button>
                <button
                  onClick={() => setActiveTab("structure")}
                  className={`px-4 py-2.5 text-[14px] transition-all border-b-2 ${activeTab === "structure" ? "border-blue-500 text-blue-600 font-medium" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                  结构预览
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === "preview" && (
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-[13px] text-slate-500">显示100条数据，共{dsDetails.totalRows}条</p>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            {dsDetails.fields.map((field) => (
                              <th key={field.name} className="px-4 py-3 text-left text-[12px] text-slate-500 font-medium whitespace-nowrap border-r border-slate-100 last:border-r-0">
                                <span className="text-blue-500 mr-1">T</span>{field.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {dsDetails.rows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="border-b border-slate-100 hover:bg-slate-50/50">
                              {dsDetails.fields.map((field) => (
                                <td key={field.name} className="px-4 py-3 text-[13px] text-slate-700 whitespace-nowrap border-r border-slate-50 last:border-r-0">
                                  {row[field.name] || "-"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "structure" && (
                <div className="p-6">
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-3 text-left text-[13px] text-slate-600 font-medium">字段名称</th>
                          <th className="px-6 py-3 text-left text-[13px] text-slate-600 font-medium">字段类型</th>
                          <th className="px-6 py-3 text-left text-[13px] text-slate-600 font-medium">字段备注</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dsDetails.fields.map((field, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="px-6 py-3.5 text-[13px] text-slate-800">{field.name}</td>
                            <td className="px-6 py-3.5 text-[13px] text-slate-800">
                              <span className={`mr-1.5 ${field.type === "数值" ? "text-blue-500" : "text-blue-500"}`}>
                                {field.type === "数值" ? "#" : "T"}
                              </span>
                              {field.type}
                            </td>
                            <td className="px-6 py-3.5 text-[13px] text-slate-600">{field.comment}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "calculated" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] text-slate-800 font-medium">计算字段管理</h3>
                    <button
                      onClick={() => {
                        setEditingCalculatedField(null);
                        setCalculatedFieldForm({fieldName: "", expression: "", dataType: "integer"});
                        setShowCalculatedFieldModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      新增计算字段
                    </button>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-3 text-left text-[13px] text-slate-600 font-medium">字段名称</th>
                          <th className="px-6 py-3 text-left text-[13px] text-slate-600 font-medium">表达式</th>
                          <th className="px-6 py-3 text-left text-[13px] text-slate-600 font-medium">数据类型</th>
                          <th className="px-6 py-3 text-left text-[13px] text-slate-600 font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDS.calculatedFields.map((field) => (
                          <tr key={field.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="px-6 py-3.5 text-[13px] text-slate-800">{field.fieldName}</td>
                            <td className="px-6 py-3.5 text-[13px] text-slate-700 font-mono">{field.expression}</td>
                            <td className="px-6 py-3.5 text-[13px] text-slate-800">
                              {field.dataType === 'integer' ? '整数' : '浮点数'}
                            </td>
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingCalculatedField({
                                      id: field.id,
                                      fieldName: field.fieldName,
                                      expression: field.expression,
                                      dataType: field.dataType
                                    });
                                    setCalculatedFieldForm({
                                      fieldName: field.fieldName,
                                      expression: field.expression,
                                      dataType: field.dataType
                                    });
                                    setShowCalculatedFieldModal(true);
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded text-[12px] text-blue-500 hover:bg-blue-50 transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  编辑
                                </button>
                                <button
                                  onClick={() => {
                                    if (selectedDataSetId) {
                                      deleteCalculatedField(selectedDataSetId, field.id);
                                    }
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded text-[12px] text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  删除
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {selectedDS.calculatedFields.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-[13px] text-slate-400">
                              暂无计算字段，请点击上方按钮添加
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Table2 className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-slate-600 text-lg mb-2">选择数据集</h3>
            <p className="text-[14px] text-center max-w-md">
              从左侧列表中选择一个数据集，查看其数据预览和结构
            </p>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-[360px] p-6">
            <div className="flex items-center gap-2 mb-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <span className="text-[15px] text-slate-800 font-medium">确认删除</span>
            </div>
            <p className="text-[14px] text-slate-600 mb-5">确定要删除该数据集吗？删除后不可恢复。</p>
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

      {/* Calculated Field Modal */}
      {showCalculatedFieldModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-[500px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] text-slate-800 font-medium">
                {editingCalculatedField ? '编辑计算字段' : '新增计算字段'}
              </h3>
              <button
                onClick={() => setShowCalculatedFieldModal(false)}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  字段名称 <span className="text-red-500">*</span>
                </label>
                <input
                  value={calculatedFieldForm.fieldName}
                  onChange={(e) => setCalculatedFieldForm({...calculatedFieldForm, fieldName: e.target.value})}
                  placeholder="请输入字段名称"
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                />
              </div>
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  表达式 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={calculatedFieldForm.expression}
                  onChange={(e) => setCalculatedFieldForm({...calculatedFieldForm, expression: e.target.value})}
                  placeholder="例如: price * quantity"
                  rows={4}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all font-mono"
                />
                <p className="text-[12px] text-slate-400 mt-1">
                  支持使用现有字段和算术运算符 (+, -, *, /)
                </p>
              </div>
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  数据类型 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dataType"
                      checked={calculatedFieldForm.dataType === 'integer'}
                      onChange={() => setCalculatedFieldForm({...calculatedFieldForm, dataType: 'integer'})}
                      className="w-4 h-4 text-blue-500 accent-blue-500"
                    />
                    <span className="text-[13px] text-slate-700">整数</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dataType"
                      checked={calculatedFieldForm.dataType === 'float'}
                      onChange={() => setCalculatedFieldForm({...calculatedFieldForm, dataType: 'float'})}
                      className="w-4 h-4 text-blue-500 accent-blue-500"
                    />
                    <span className="text-[13px] text-slate-700">浮点数</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCalculatedFieldModal(false)}
                className="px-4 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (selectedDataSetId && calculatedFieldForm.fieldName && calculatedFieldForm.expression) {
                    if (editingCalculatedField) {
                      updateCalculatedField(selectedDataSetId, editingCalculatedField.id, {
                        fieldName: calculatedFieldForm.fieldName,
                        expression: calculatedFieldForm.expression,
                        dataType: calculatedFieldForm.dataType
                      });
                    } else {
                      addCalculatedField(selectedDataSetId, calculatedFieldForm.fieldName, calculatedFieldForm.expression, calculatedFieldForm.dataType);
                    }
                    setShowCalculatedFieldModal(false);
                  }
                }}
                className="px-4 py-1.5 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export function CreateDataSetPage() {
  const { dataSources, addDataSet } = useDashboards();
  const navigate = useNavigate();
  const [selectedDataSourceId, setSelectedDataSourceId] = useState<string>("");
  const [tableSearch, setTableSearch] = useState("");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "batch">("preview");
  const [showCalculatedFieldModal, setShowCalculatedFieldModal] = useState(false);
  const [calculatedFieldForm, setCalculatedFieldForm] = useState({fieldName: "", expression: "", dataType: "integer" as "integer" | "float"});

  // SQL editor state
  const [sqlEditorMode, setSqlEditorMode] = useState(false);
  const [sqlName, setSqlName] = useState("自定义SQL");
  const [sqlQuery, setSqlQuery] = useState("");
  const [sqlActiveTab, setSqlActiveTab] = useState<"query" | "params">("query");
  const [sqlParams, setSqlParams] = useState<Array<{ name: string; type: string }>>([]);
  const [sqlRunResults, setSqlRunResults] = useState<Array<{ name: string }> | null>(null);
  const [sqlTableSearch, setSqlTableSearch] = useState("");
  const [sqlLeftCollapsed, setSqlLeftCollapsed] = useState(false);
  const [sqlBottomTab, setSqlBottomTab] = useState<"results" | "batch">("results");
  const [sqlFields, setSqlFields] = useState<DataSetField[]>([]);

  // Dragged tables (tabs in the right panel upper area)
  const [draggedTables, setDraggedTables] = useState<Array<{ name: string; sourceId: string }>>([]);
  const [activeTableTab, setActiveTableTab] = useState<string>("");

  // Fields for the active table
  const [fields, setFields] = useState<DataSetField[]>([]);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);

  // Available tables for the selected data source
  const availableTables = useMemo(() => {
    if (!selectedDataSourceId) return [];
    const tables = getCreateTablesForSource(selectedDataSourceId);
    if (!tableSearch) return tables;
    return tables.filter((t) => t.name.toLowerCase().includes(tableSearch.toLowerCase()));
  }, [selectedDataSourceId, tableSearch]);

  const selectedSourceName = useMemo(
    () => dataSources.find((ds) => ds.id === selectedDataSourceId)?.name || "",
    [dataSources, selectedDataSourceId]
  );

  // SQL editor: tables for current source (all tables, not just create tables)
  const sqlAllTables = useMemo(() => {
    if (!selectedDataSourceId) return [];
    return getTablesForSource(selectedDataSourceId);
  }, [selectedDataSourceId]);

  const filteredSqlTables = useMemo(() => {
    if (!sqlTableSearch) return sqlAllTables;
    return sqlAllTables.filter((t) => t.name.toLowerCase().includes(sqlTableSearch.toLowerCase()));
  }, [sqlAllTables, sqlTableSearch]);

  // When a table is clicked/dragged to the right area
  const handleAddTable = (tableName: string) => {
    if (tableName === "自定义SQL") {
      setSqlEditorMode(true);
      setSqlName("自定义SQL");
      setSqlQuery("");
      setSqlActiveTab("query");
      setSqlParams([]);
      setSqlRunResults(null);
      setSqlTableSearch("");
      return;
    }
    const existing = draggedTables.find((t) => t.name === tableName && t.sourceId === selectedDataSourceId);
    if (existing) {
      setActiveTableTab(tableName);
      return;
    }
    const newEntry = { name: tableName, sourceId: selectedDataSourceId };
    setDraggedTables((prev) => [...prev, newEntry]);
    setActiveTableTab(tableName);

    // Load mock fields for this table
    const mockFields: DataSetField[] = [
      { name: "能力1", physicalName: "ability1", type: "文本", comment: "能力1", tableName, category: "dimension" },
      { name: "能力2", physicalName: "ability2", type: "文本", comment: "能力2", tableName, category: "dimension" },
      { name: "能力3", physicalName: "ability3", type: "文本", comment: "能力3", tableName, category: "dimension" },
      { name: "能力4", physicalName: "ability4", type: "文本", comment: "能力4", tableName, category: "dimension" },
      { name: "能力5", physicalName: "ability5", type: "文本", comment: "能力5", tableName, category: "dimension" },
      { name: "公司", physicalName: "company", type: "文本", comment: "公司", tableName, category: "dimension" },
      { name: "教育", physicalName: "education", type: "文本", comment: "教育", tableName, category: "dimension" },
      { name: "经验", physicalName: "experience", type: "文本", comment: "经验", tableName, category: "dimension" },
      { name: "行业", physicalName: "industry", type: "文本", comment: "行业", tableName, category: "dimension" },
      { name: "IPO", physicalName: "ipo", type: "文本", comment: "IPO", tableName, category: "dimension" },
      { name: "工作", physicalName: "job", type: "文本", comment: "工作", tableName, category: "dimension" },
      { name: "地点", physicalName: "location", type: "文本", comment: "地点", tableName, category: "dimension" },
      { name: "城市", physicalName: "city", type: "文本", comment: "城市", tableName, category: "dimension" },
      { name: "薪水", physicalName: "salary", type: "数值", comment: "薪水", tableName, category: "metric" },
    ];
    setFields(mockFields);

    // Load mock rows
    setPreviewRows([
      { "能力1": "商业分析", "能力2": "业务提升", "能力3": "匹配策略", "能力4": "数据分析师", "能力5": "产品运营", "公司": "北京趣象科技有...", "教育": "本科", "经验": "3-5年", "行业": "互联网", "IPO": "不需要融资", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "商业分析", "能力2": "专题研究", "能力3": "互联网数据分析", "能力4": "数据监控", "能力5": "数据监控", "公司": "车好多集团", "教育": "本科", "经验": "5-10年", "行业": "互联网", "IPO": "D轮及以上", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "提升策略", "能力2": "现有业务", "能力3": "数据分析师", "能力4": "策略", "能力5": "制定策略", "公司": "聚美优品", "教育": "本科", "经验": "经验不限", "行业": "电子...", "IPO": "已上市", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "数据仓库", "能力2": "蜂巢", "能力3": "模型研发", "能力4": "数据应用", "能力5": "业务部门", "公司": "彩食鲜", "教育": "本科", "经验": "3-5年", "行业": "新零售", "IPO": "已上市", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "数据仓库", "能力2": "SQL", "能力3": "Python", "能力4": "Excel", "能力5": "Hadoop", "公司": "当当网", "教育": "本科", "经验": "3-5年", "行业": "电子...", "IPO": "已上市", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "数据挖掘", "能力2": "数据仓库", "能力3": "ETL", "能力4": "商业分析", "能力5": "蜂巢", "公司": "京东集团", "教育": "硕士", "经验": "3-5年", "行业": "互联网", "IPO": "已上市", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "SQL", "能力2": "物联网", "能力3": "Tableau", "能力4": "商业分析", "能力5": "数据分析专员", "公司": "美团点评", "教育": "本科", "经验": "3-5年", "行业": "氧气", "IPO": "已上市", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "数据挖掘", "能力2": "商业分析", "能力3": "数据建模", "能力4": "设计业务", "能力5": "业务评价", "公司": "猎桥", "教育": "本科", "经验": "3-5年", "行业": "互联网", "IPO": "不需要融资", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "转化路径", "能力2": "随机森林算法", "能力3": "数据分析师", "能力4": "C端产品", "能力5": "用户分层", "公司": "中国平安", "教育": "本科", "经验": "3-5年", "行业": "互联网", "IPO": "已上市", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "数据仓库", "能力2": "蜂巢", "能力3": "深入分析", "能力4": "数据分析师", "能力5": "用户分层", "公司": "新浪网", "教育": "本科", "经验": "3-5年", "行业": "互联网", "IPO": "已上市", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "数据挖掘", "能力2": "商业分析", "能力3": "埋点", "能力4": "数学统计类", "能力5": "数据方法", "公司": "活体", "教育": "本科", "经验": "5-10年", "行业": "移动...", "IPO": "不需要融资", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "Python", "能力2": "SQL", "能力3": "SPSS", "能力4": "SAS", "能力5": "数据分析师", "公司": "便利蜂", "教育": "本科", "经验": "经验不限", "行业": "互联网", "IPO": "不需要融资", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "商业分析", "能力2": "数据分析师", "能力3": "两轮车", "能力4": "监控", "能力5": "成本", "公司": "滴滴", "教育": "本科", "经验": "1-3年", "行业": "移动...", "IPO": "D轮及以上", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "商业分析", "能力2": "整理业务", "能力3": "商业数据分析", "能力4": "数据体系", "能力5": "业务流程", "公司": "火花思维", "教育": "本科", "经验": "3-5年", "行业": "在线...", "IPO": "D轮及以上", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
      { "能力1": "数据仓库", "能力2": "蜂巢", "能力3": "建模", "能力4": "互联网数据分析", "能力5": "数据分析师", "公司": "映客直播", "教育": "本科", "经验": "3-5年", "行业": "互联网", "IPO": "已上市", "工作": "数据分析...", "地点": "北京...", "城市": "北京" },
    ]);
  };

  const handleRemoveTable = (tableName: string) => {
    setDraggedTables((prev) => prev.filter((t) => t.name !== tableName));
    if (activeTableTab === tableName) {
      setActiveTableTab(draggedTables.length > 1 ? draggedTables[0].name : "");
      if (draggedTables.length <= 1) {
        setFields([]);
        setPreviewRows([]);
      }
    }
  };

  const handleFieldChange = (index: number, key: string, value: string) => {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, [key]: value } : f)));
  };

  const handleDeleteField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (draggedTables.length === 0) return;
    const fieldNames = fields.map((f) => f.name);
    addDataSet({
      name: "未命名数据集",
      sourceId: selectedDataSourceId,
      tableName: draggedTables[0]?.name,
      fields: fieldNames,
      rowCount: previewRows.length,
    });
    navigate("/data-config/data-sets");
  };

  // SQL editor handlers
  const handleSqlRun = () => {
    setSqlRunResults([
      { name: "SCHED_NAME" },
      { name: "触发器名称" },
      { name: "触发组" },
      { name: "BLOB_DATA" },
    ]);
    // Also populate fields for batch management
    setSqlFields([
      { name: "SCHED_NAME", physicalName: "sched_name", type: "文本", comment: "SCHED_NAME", tableName: "自定义SQL", category: "dimension" },
      { name: "触发器名称", physicalName: "trigger_name", type: "文本", comment: "触发器名称", tableName: "自定义SQL", category: "dimension" },
      { name: "触发组", physicalName: "trigger_group", type: "文本", comment: "触发组", tableName: "自定义SQL", category: "dimension" },
      { name: "BLOB_DATA", physicalName: "blob_data", type: "文本", comment: "BLOB_DATA", tableName: "自定义SQL", category: "metric" },
    ]);
  };

  const handleSqlSave = () => {
    const name = sqlName.trim() || "自定义SQL";
    const newEntry = { name, sourceId: selectedDataSourceId };
    setDraggedTables((prev) => [...prev, newEntry]);
    setActiveTableTab(name);

    const mockFields: DataSetField[] = [
      { name: "SCHED_NAME", physicalName: "sched_name", type: "文本", comment: "SCHED_NAME", tableName: name, category: "dimension" },
      { name: "触发组", physicalName: "trigger_group", type: "文本", comment: "触发组", tableName: name, category: "dimension" },
      { name: "定时任务表达式", physicalName: "cron_expression", type: "文本", comment: "定时任务表达式", tableName: name, category: "dimension" },
      { name: "时区 ID", physicalName: "time_zone_id", type: "文本", comment: "时区 ID", tableName: name, category: "dimension" },
      { name: "触发器名称", physicalName: "trigger_name", type: "文本", comment: "触发器名称", tableName: name, category: "metric" },
    ];
    setFields(mockFields);
    setPreviewRows([
      { "SCHED_NAME": "同步作业", "触发器名称": "数据源", "触发组": "检查状态", "定时任务表达式": "0 0/5 * * * ?", "时区 ID": "Asia/Shanghai" },
      { "SCHED_NAME": "同步作业", "触发器名称": "schedule.updateStopJobStatus", "触发组": "默认", "定时任务表达式": "0 0 1 * * ?", "时区 ID": "Asia/Shanghai" },
    ]);
    setSqlEditorMode(false);
  };

  const dimensionFields = fields.filter((f) => f.category === "dimension");
  const metricFields = fields.filter((f) => f.category === "metric");

  // ===== SQL Editor Mode =====
  if (sqlEditorMode) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Top bar */}
        <div className="flex items-center justify-between h-12 px-4 border-b border-slate-200">
          <input
            value={sqlName}
            onChange={(e) => setSqlName(e.target.value)}
            className="px-3 py-1.5 rounded-md border border-slate-200 text-[14px] text-slate-800 w-[200px] outline-none focus:border-blue-300"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSqlRun}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              运行
            </button>
            <button
              onClick={() => setSqlActiveTab(sqlActiveTab === "params" ? "query" : "params")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              参数设置
            </button>
            <button
              onClick={handleSqlSave}
              className="px-4 py-1.5 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
            >
              保存
            </button>
            <button
              onClick={() => setSqlEditorMode(false)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel: data source + table list */}
          <div className={`border-r border-slate-200 flex flex-col shrink-0 transition-all duration-200 ${sqlLeftCollapsed ? "w-0 overflow-hidden" : "w-[200px]"}`}>
            <div className="px-3 pt-3 pb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-slate-600">当前数据源</span>
                <button onClick={() => setSqlLeftCollapsed(true)} className="p-0.5 rounded hover:bg-slate-100 text-slate-400">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
              <select
                value={selectedDataSourceId}
                onChange={(e) => setSelectedDataSourceId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 bg-white mb-3"
              >
                {dataSources.map((ds) => (
                  <option key={ds.id} value={ds.id}>{ds.name}</option>
                ))}
              </select>

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] text-slate-700 font-medium">数据表</span>
                <div className="flex items-center gap-1 text-slate-400">
                  <Table2 className="w-3.5 h-3.5" />
                  <span className="text-[12px]">{sqlAllTables.length}</span>
                </div>
              </div>
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  value={sqlTableSearch}
                  onChange={(e) => setSqlTableSearch(e.target.value)}
                  placeholder="通过表名称搜索"
                  className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-1">
              {filteredSqlTables.map((table) => (
                <div key={table.name} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-md group cursor-default">
                  <Table2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[13px] text-slate-700 truncate flex-1">{table.name}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(table.name)}
                    className="p-0.5 rounded hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="复制表名"
                  >
                    <Copy className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {sqlLeftCollapsed && (
            <button onClick={() => setSqlLeftCollapsed(false)} className="w-5 flex items-center justify-center border-r border-slate-200 text-slate-400 hover:bg-slate-50 shrink-0">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Right: SQL editor or parameter settings */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {sqlActiveTab === "query" ? (
              <>
                {/* SQL editor area */}
                <div className="h-[280px] flex flex-col shrink-0">
                  <div className="flex-1 relative bg-slate-900 overflow-auto">
                    <div className="flex min-h-full">
                      <div className="py-3 px-2 text-right select-none shrink-0">
                        {(sqlQuery || " ").split("\n").map((_, i) => (
                          <div key={i} className="text-[13px] text-slate-500 leading-6 font-mono h-6">{i + 1}</div>
                        ))}
                      </div>
                      <textarea
                        value={sqlQuery}
                        onChange={(e) => setSqlQuery(e.target.value)}
                        placeholder="请输入 SQL 语句..."
                        className="flex-1 bg-transparent text-[13px] text-slate-100 font-mono leading-6 py-3 pr-3 resize-none outline-none placeholder:text-slate-600 min-h-full"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>

                {/* Resizer */}
                <div className="h-1 bg-slate-200 cursor-row-resize hover:bg-blue-200 transition-colors shrink-0" />

                {/* Run results / Batch management */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSqlBottomTab("results")}
                        className={`px-3 py-2.5 text-[14px] transition-all border-b-2 ${sqlBottomTab === "results" ? "border-blue-500 text-blue-600 font-medium" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                      >
                        运行结果
                      </button>
                      <button
                        onClick={() => setSqlBottomTab("batch")}
                        className={`px-3 py-2.5 text-[14px] transition-all border-b-2 ${sqlBottomTab === "batch" ? "border-blue-500 text-blue-600 font-medium" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                      >
                        批量管理
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto">
                    {sqlBottomTab === "results" ? (
                      sqlRunResults ? (
                        <div>
                          <div className="sticky top-0 bg-slate-50 border-b border-slate-200 flex">
                            {sqlRunResults.map((col) => (
                              <div key={col.name} className="px-4 py-2.5 text-[13px] text-slate-500 font-medium whitespace-nowrap border-r border-slate-100 last:border-r-0 min-w-[160px]">
                                <span className="text-blue-500 mr-1">T</span>{col.name}
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <svg className="w-16 h-16 mb-2 text-slate-200" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="12" y="20" width="40" height="28" rx="2" />
                              <path d="M12 28h40" />
                              <path d="M28 28v20" />
                              <path d="M28 8l4 4-4 4" strokeWidth="2" />
                              <path d="M36 8l-4 4 4 4" strokeWidth="2" />
                              <path d="M32 4v12" strokeWidth="2" />
                            </svg>
                            <span className="text-[13px]">暂无数据</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-300 text-[13px]">点击"运行"执行 SQL 查询</div>
                      )
                    ) : (
                      /* Batch management content */
                      <div className="overflow-auto">
                        {sqlFields.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-slate-300 text-[13px]">请先运行 SQL 查询</div>
                        ) : (
                          <>
                            {/* Dimension section */}
                            {sqlFields.filter((f) => f.category === "dimension").length > 0 && (
                              <>
                                <div className="bg-blue-50 px-6 py-2 text-[13px] text-blue-600 font-medium flex items-center gap-1.5">
                                  <ChevronDown className="w-3.5 h-3.5" />
                                  维度
                                </div>
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                      <th className="w-10 px-3 py-2.5"><input type="checkbox" className="w-3.5 h-3.5 accent-blue-500" /></th>
                                      <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">字段名称</th>
                                      <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">物理字段名</th>
                                      <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">字段备注</th>
                                      <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">表名</th>
                                      <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">字段类型</th>
                                      <th className="px-4 py-2.5 text-center text-[13px] text-slate-600 font-medium">维度</th>
                                      <th className="px-4 py-2.5 text-center text-[13px] text-slate-600 font-medium">操作</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sqlFields.filter((f) => f.category === "dimension").map((field, idx) => {
                                      const realIdx = sqlFields.findIndex((f) => f.physicalName === field.physicalName);
                                      return (
                                        <tr key={field.physicalName} className="border-b border-slate-100 hover:bg-slate-50/50">
                                          <td className="w-10 px-3 py-2.5"><input type="checkbox" className="w-3.5 h-3.5 accent-blue-500" /></td>
                                          <td className="px-4 py-2.5">
                                            <input
                                              value={field.physicalName}
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                setSqlFields((prev) => prev.map((f, i) => (i === realIdx ? { ...f, physicalName: val } : f)));
                                              }}
                                              className="w-[140px] px-2.5 py-1 rounded border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300"
                                            />
                                          </td>
                                          <td className="px-4 py-2.5 text-[13px] text-slate-600">{field.name}</td>
                                          <td className="px-4 py-2.5 text-[13px] text-slate-600">{field.comment}</td>
                                          <td className="px-4 py-2.5 text-[13px] text-slate-600">{field.tableName}</td>
                                          <td className="px-4 py-2.5">
                                            <select
                                              value={field.type}
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                setSqlFields((prev) => prev.map((f, i) => (i === realIdx ? { ...f, type: val } : f)));
                                              }}
                                              className="px-2.5 py-1 rounded border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 bg-white"
                                            >
                                              <option value="文本">T 文本</option>
                                              <option value="数值"># 数值</option>
                                              <option value="时间">时间</option>
                                            </select>
                                          </td>
                                          <td className="px-4 py-2.5 text-center">
                                            <svg className="w-4 h-4 text-slate-400 mx-auto" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6l4-4 4 4M4 10l4 4 4-4" /></svg>
                                          </td>
                                          <td className="px-4 py-2.5">
                                            <div className="flex items-center justify-center gap-2">
                                              <button
                                                onClick={() => setSqlFields((prev) => prev.filter((_, i) => i !== realIdx))}
                                                className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
                                                title="删除"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </>
                            )}

                            {/* Metric section */}
                            {sqlFields.filter((f) => f.category === "metric").length > 0 && (
                              <>
                                <div className="bg-blue-50 px-6 py-2 text-[13px] text-blue-600 font-medium flex items-center gap-1.5">
                                  <ChevronDown className="w-3.5 h-3.5" />
                                  指标
                                </div>
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                      <th className="w-10 px-3 py-2.5"><input type="checkbox" className="w-3.5 h-3.5 accent-blue-500" /></th>
                                      <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">字段名称</th>
                                      <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">物理字段名</th>
                                      <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">字段备注</th>
                                      <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">表名</th>
                                      <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">字段类型</th>
                                      <th className="px-4 py-2.5 text-center text-[13px] text-slate-600 font-medium">指标</th>
                                      <th className="px-4 py-2.5 text-center text-[13px] text-slate-600 font-medium">操作</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sqlFields.filter((f) => f.category === "metric").map((field) => {
                                      const realIdx = sqlFields.findIndex((f) => f.physicalName === field.physicalName);
                                      return (
                                        <tr key={field.physicalName} className="border-b border-slate-100 hover:bg-slate-50/50">
                                          <td className="w-10 px-3 py-2.5"><input type="checkbox" className="w-3.5 h-3.5 accent-blue-500" /></td>
                                          <td className="px-4 py-2.5">
                                            <input
                                              value={field.physicalName}
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                setSqlFields((prev) => prev.map((f, i) => (i === realIdx ? { ...f, physicalName: val } : f)));
                                              }}
                                              className="w-[140px] px-2.5 py-1 rounded border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300"
                                            />
                                          </td>
                                          <td className="px-4 py-2.5 text-[13px] text-slate-600">{field.name}</td>
                                          <td className="px-4 py-2.5 text-[13px] text-slate-600">{field.comment}</td>
                                          <td className="px-4 py-2.5 text-[13px] text-slate-600">{field.tableName}</td>
                                          <td className="px-4 py-2.5">
                                            <select
                                              value={field.type}
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                setSqlFields((prev) => prev.map((f, i) => (i === realIdx ? { ...f, type: val } : f)));
                                              }}
                                              className="px-2.5 py-1 rounded border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 bg-white"
                                            >
                                              <option value="文本">T 文本</option>
                                              <option value="数值"># 数值</option>
                                              <option value="时间">时间</option>
                                            </select>
                                          </td>
                                          <td className="px-4 py-2.5 text-center">
                                            <svg className="w-4 h-4 text-slate-400 mx-auto" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6l4-4 4 4M4 10l4 4 4-4" /></svg>
                                          </td>
                                          <td className="px-4 py-2.5">
                                            <div className="flex items-center justify-center gap-2">
                                              <button
                                                onClick={() => setSqlFields((prev) => prev.filter((_, i) => i !== realIdx))}
                                                className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
                                                title="删除"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Parameter settings */
              <div className="flex flex-col h-full">
                <div className="px-6 border-b border-slate-200">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSqlActiveTab("query")}
                      className="px-4 py-2.5 text-[14px] border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition-all"
                    >
                      SQL查询
                    </button>
                    <button className="px-4 py-2.5 text-[14px] border-b-2 border-blue-500 text-blue-600 font-medium">
                      参数设置
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-6">
                  {/* Info box */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[14px] text-blue-700 font-medium mb-1">参数使用说明</p>
                        <p className="text-[13px] text-blue-600">1. SQL 变量只能在 WHERE 条件中使用</p>
                        <p className="text-[13px] text-blue-600">{"2. 示例：  SELECT * FROM table WHERE {{ DE_PARAM }} = substring({{ PARAM1 }},1,5)"}</p>
                        <p className="text-[13px] text-blue-600 ml-3">{"AND {{ DE_PARAM }} IN ({{ PARAM2 }})"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Parameter list header */}
                  {sqlParams.length > 0 && (
                    <div className="grid grid-cols-[1fr_160px_48px] gap-3 mb-3">
                      <span className="text-[13px] text-slate-500">参数名称</span>
                      <span className="text-[13px] text-slate-500">参数类型</span>
                      <span className="text-[13px] text-slate-500">操作</span>
                    </div>
                  )}
                  {sqlParams.map((param, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_160px_48px] gap-3 mb-3">
                      <input
                        value={param.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSqlParams((prev) => prev.map((p, i) => (i === idx ? { ...p, name: val } : p)));
                        }}
                        placeholder="名称"
                        className="px-3 py-2 rounded-md border border-slate-200 text-[13px] outline-none focus:border-blue-300"
                      />
                      <select
                        value={param.type}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSqlParams((prev) => prev.map((p, i) => (i === idx ? { ...p, type: val } : p)));
                        }}
                        className="px-3 py-2 rounded-md border border-slate-200 text-[13px] outline-none focus:border-blue-300 bg-white"
                      >
                        <option value="日期">日期</option>
                        <option value="文本">文本</option>
                        <option value="数值">数值</option>
                      </select>
                      <button
                        onClick={() => setSqlParams((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-2 rounded hover:bg-red-50 text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => setSqlParams((prev) => [...prev, { name: "", type: "日期" }])}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    添加参数
                  </button>
                </div>

                {/* Bottom actions */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
                  <button
                    onClick={() => setSqlActiveTab("query")}
                    className="px-4 py-2 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    取 消
                  </button>
                  <button
                    onClick={() => setSqlActiveTab("query")}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white text-[13px] hover:bg-blue-600 transition-colors"
                  >
                    保 存
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== Normal Create Dataset Mode =====
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className={`border-r border-slate-200 flex flex-col shrink-0 transition-all duration-200 ${leftCollapsed ? "w-0 overflow-hidden" : "w-[200px]"}`}>
          {/* 选择数据源 */}
          <div className="px-3 pt-3 pb-2">
            <p className="text-[12px] text-slate-500 mb-1.5">选择数据源</p>
            <select
              value={selectedDataSourceId}
              onChange={(e) => {
                setSelectedDataSourceId(e.target.value);
                setTableSearch("");
              }}
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 bg-white"
            >
              <option value="">请选择数据源</option>
              {dataSources.map((ds) => (
                <option key={ds.id} value={ds.id}>{ds.name}</option>
              ))}
            </select>
          </div>

          {/* 数据表 */}
          <div className="px-3 pb-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] text-slate-700 font-medium">数据表</span>
              <div className="flex items-center gap-1 text-slate-400">
                <Table2 className="w-3.5 h-3.5" />
                <span className="text-[12px]">{selectedDataSourceId ? availableTables.filter((t) => t.icon === "table").length : 0}</span>
              </div>
            </div>
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="通过表名称搜索"
                className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
              />
            </div>
          </div>

          {/* Table list */}
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {availableTables.map((table) => (
              <div
                key={table.name}
                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-slate-700 hover:bg-slate-50 transition-all mb-0.5"
                onClick={() => handleAddTable(table.name)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("tableName", table.name);
                }}
              >
                {table.icon === "sql" ? (
                  <svg className="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="3" width="12" height="10" rx="1" /><path d="M4 7h8M4 10h5" /></svg>
                ) : (
                  <Table2 className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="text-[13px] truncate">{table.name}</span>
              </div>
            ))}
            {selectedDataSourceId && availableTables.length === 0 && (
              <div className="text-center text-[12px] text-slate-400 py-4">无匹配表</div>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        {!leftCollapsed && (
          <button
            onClick={() => setLeftCollapsed(true)}
            className="w-5 flex items-center justify-center border-r border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
        {leftCollapsed && (
          <button
            onClick={() => setLeftCollapsed(false)}
            className="w-5 flex items-center justify-center border-r border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors shrink-0"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Right Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Upper area - Table drag zone / table tabs */}
          <div
            className="border-b border-slate-200 min-h-[180px] flex flex-col"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const tableName = e.dataTransfer.getData("tableName");
              if (tableName) handleAddTable(tableName);
            }}
          >
            {draggedTables.length > 0 ? (
              <>
                {/* Table tabs */}
                <div className="flex items-center gap-1 px-4 pt-3">
                  {draggedTables.map((t) => (
                    <div
                      key={t.name}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-md text-[13px] border border-b-0 cursor-pointer ${activeTableTab === t.name ? "bg-white border-slate-200 text-slate-800" : "bg-slate-50 border-slate-100 text-slate-500"}`}
                      onClick={() => setActiveTableTab(t.name)}
                    >
                      <Table2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[140px]">{t.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveTable(t.name); }}
                        className="ml-1 text-slate-400 hover:text-slate-600"
                      >
                        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="1" fill="currentColor" /><circle cx="6" cy="2" r="1" fill="currentColor" /><circle cx="6" cy="10" r="1" fill="currentColor" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
                {/* Empty spacer area */}
                <div className="flex-1" />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <svg className="w-16 h-16 mb-3 text-slate-200" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="12" y="8" width="40" height="48" rx="2" /><path d="M20 20h24M20 28h24M20 36h16" strokeWidth="2" /><path d="M38 18l8 8-8 8" className="text-blue-400" stroke="currentColor" strokeWidth="2" />
                </svg>
                <p className="text-[14px] text-slate-500">将左边的数据表、自定义SQL</p>
                <p className="text-[14px] text-slate-500">拖拽到这里创建数据集</p>
              </div>
            )}
          </div>

          {/* Resizer bar */}
          <div className="h-1 bg-slate-100 cursor-row-resize hover:bg-blue-200 transition-colors" />

          {/* Lower area - Data preview / Batch management */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center justify-between px-6 py-0 border-b border-slate-200">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-4 py-2.5 text-[14px] transition-all border-b-2 ${activeTab === "preview" ? "border-blue-500 text-blue-600 font-medium" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                  数据预览
                </button>
                <button
                  onClick={() => setActiveTab("batch")}
                  className={`px-4 py-2.5 text-[14px] transition-all border-b-2 ${activeTab === "batch" ? "border-blue-500 text-blue-600 font-medium" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                  批量管理
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button 
                    onClick={() => setShowCalculatedFieldModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    新建字段（计算）
                  </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8a6 6 0 0110.89-3.48" /><path d="M14 8a6 6 0 01-10.89 3.48" /><path d="M12.89 4.52L14 2v3h-3" /><path d="M3.11 11.48L2 14v-3h3" /></svg>
                  刷新数据
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {draggedTables.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-300 text-[13px]">暂无数据</div>
              ) : activeTab === "preview" ? (
                <div className="flex">
                  {/* Left field sidebar */}
                  <div className="w-[180px] border-r border-slate-100 overflow-y-auto py-3 px-2 shrink-0">
                    {dimensionFields.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-1.5 px-2 py-1 text-[12px] text-slate-500">
                          <ChevronDown className="w-3 h-3" />
                          <span>维度</span>
                        </div>
                        {dimensionFields.map((f) => (
                          <div key={f.physicalName} className="flex items-center gap-2 px-4 py-1.5 text-[13px] text-slate-700">
                            <span className="text-blue-500 text-[11px]">T</span>
                            <span className="truncate">{f.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {metricFields.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 px-2 py-1 text-[12px] text-slate-500">
                          <ChevronDown className="w-3 h-3" />
                          <span>指标</span>
                        </div>
                        {metricFields.map((f) => (
                          <div key={f.physicalName} className="flex items-center gap-2 px-4 py-1.5 text-[13px] text-slate-700">
                            <span className="text-blue-500 text-[11px]">#</span>
                            <span className="truncate">{f.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Data table */}
                  <div className="flex-1 overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 sticky top-0">
                          {fields.map((f) => (
                            <th key={f.physicalName} className="px-3 py-2.5 text-left text-[12px] text-slate-500 font-medium whitespace-nowrap border-r border-slate-100 last:border-r-0">
                              <span className="text-blue-500 mr-1">{f.category === "metric" ? "#" : "T"}</span>{f.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                            {fields.map((f) => (
                              <td key={f.physicalName} className="px-3 py-2 text-[13px] text-slate-700 whitespace-nowrap border-r border-slate-50 last:border-r-0 max-w-[120px] truncate">
                                {row[f.name] || "-"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Batch management tab */
                <div className="overflow-auto">
                  {/* Dimension section */}
                  {dimensionFields.length > 0 && (
                    <>
                      <div className="bg-blue-50 px-6 py-2 text-[13px] text-blue-600 font-medium flex items-center gap-1.5">
                        <ChevronDown className="w-3.5 h-3.5" />
                        维度
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="w-10 px-3 py-2.5"><input type="checkbox" className="w-3.5 h-3.5 accent-blue-500" /></th>
                            <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">字段名称</th>
                            <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">物理字段名</th>
                            <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">字段备注</th>
                            <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">表名</th>
                            <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">字段类型</th>
                            <th className="px-4 py-2.5 text-center text-[13px] text-slate-600 font-medium">维度</th>
                            <th className="px-4 py-2.5 text-center text-[13px] text-slate-600 font-medium">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dimensionFields.map((field, idx) => {
                            const realIdx = fields.findIndex((f) => f.physicalName === field.physicalName);
                            return (
                              <tr key={field.physicalName} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="w-10 px-3 py-2.5"><input type="checkbox" className="w-3.5 h-3.5 accent-blue-500" /></td>
                                <td className="px-4 py-2.5">
                                  <input
                                    value={field.physicalName}
                                    onChange={(e) => handleFieldChange(realIdx, "physicalName", e.target.value)}
                                    className="w-[140px] px-2.5 py-1 rounded border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300"
                                  />
                                </td>
                                <td className="px-4 py-2.5 text-[13px] text-slate-600">{field.name}</td>
                                <td className="px-4 py-2.5 text-[13px] text-slate-600">{field.comment}</td>
                                <td className="px-4 py-2.5 text-[13px] text-slate-600">{field.tableName}</td>
                                <td className="px-4 py-2.5">
                                  <select
                                    value={field.type}
                                    onChange={(e) => handleFieldChange(realIdx, "type", e.target.value)}
                                    className="px-2.5 py-1 rounded border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 bg-white"
                                  >
                                    <option value="文本">T 文本</option>
                                    <option value="数值"># 数值</option>
                                    <option value="时间">时间</option>
                                  </select>
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                  <svg className="w-4 h-4 text-slate-400 mx-auto" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6l4-4 4 4M4 10l4 4 4-4" /></svg>
                                </td>
                                <td className="px-4 py-2.5">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleDeleteField(realIdx)}
                                      className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
                                      title="删除"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  )}

                  {/* Metric section */}
                  {metricFields.length > 0 && (
                    <>
                      <div className="bg-blue-50 px-6 py-2 text-[13px] text-blue-600 font-medium flex items-center gap-1.5">
                        <ChevronDown className="w-3.5 h-3.5" />
                        指标
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="w-10 px-3 py-2.5"><input type="checkbox" className="w-3.5 h-3.5 accent-blue-500" /></th>
                            <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">字段名称</th>
                            <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">物理字段名</th>
                            <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">字段备注</th>
                            <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">表名</th>
                            <th className="px-4 py-2.5 text-left text-[13px] text-slate-600 font-medium">字段类型</th>
                            <th className="px-4 py-2.5 text-center text-[13px] text-slate-600 font-medium">指标</th>
                            <th className="px-4 py-2.5 text-center text-[13px] text-slate-600 font-medium">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {metricFields.map((field) => {
                            const realIdx = fields.findIndex((f) => f.physicalName === field.physicalName);
                            return (
                              <tr key={field.physicalName} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="w-10 px-3 py-2.5"><input type="checkbox" className="w-3.5 h-3.5 accent-blue-500" /></td>
                                <td className="px-4 py-2.5">
                                  <input
                                    value={field.physicalName}
                                    onChange={(e) => handleFieldChange(realIdx, "physicalName", e.target.value)}
                                    className="w-[140px] px-2.5 py-1 rounded border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300"
                                  />
                                </td>
                                <td className="px-4 py-2.5 text-[13px] text-slate-600">{field.name}</td>
                                <td className="px-4 py-2.5 text-[13px] text-slate-600">{field.comment}</td>
                                <td className="px-4 py-2.5 text-[13px] text-slate-600">{field.tableName}</td>
                                <td className="px-4 py-2.5">
                                  <select
                                    value={field.type}
                                    onChange={(e) => handleFieldChange(realIdx, "type", e.target.value)}
                                    className="px-2.5 py-1 rounded border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 bg-white"
                                  >
                                    <option value="文本">T 文本</option>
                                    <option value="数值"># 数值</option>
                                    <option value="时间">时间</option>
                                  </select>
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                  <svg className="w-4 h-4 text-slate-400 mx-auto" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6l4-4 4 4M4 10l4 4 4-4" /></svg>
                                </td>
                                <td className="px-4 py-2.5">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleDeleteField(realIdx)}
                                      className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
                                      title="删除"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Calculated Field Modal */}
      {showCalculatedFieldModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-[800px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] text-slate-800 font-medium">
                新建计算字段
              </h3>
              <button
                onClick={() => setShowCalculatedFieldModal(false)}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="col-span-6 space-y-4">
                {/* 字段名称 */}
                <div>
                  <label className="text-[13px] text-slate-700 mb-1.5 block">
                    字段名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={calculatedFieldForm.fieldName}
                    onChange={(e) => setCalculatedFieldForm({...calculatedFieldForm, fieldName: e.target.value})}
                    placeholder="请输入字段名称"
                    className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
                
                {/* 数据类型和字段类型 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] text-slate-700 mb-1.5 block">数据类型</label>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="dataType" checked className="w-4 h-4 text-blue-500 accent-blue-500" />
                        <span className="text-[13px] text-slate-700">维度</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="dataType" className="w-4 h-4 text-blue-500 accent-blue-500" />
                        <span className="text-[13px] text-slate-700">指标</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] text-slate-700 mb-1.5 block">字段类型</label>
                    <select className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all">
                      <option value="text">T 文本</option>
                      <option value="number"># 数值</option>
                      <option value="date">时间</option>
                    </select>
                  </div>
                </div>
                
                {/* 字段表达式 */}
                <div>
                  <label className="text-[13px] text-slate-700 mb-1.5 block">
                    字段表达式 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={calculatedFieldForm.expression}
                    onChange={(e) => setCalculatedFieldForm({...calculatedFieldForm, expression: e.target.value})}
                    placeholder="请输入表达式"
                    rows={6}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all font-mono"
                  />
                </div>
              </div>
              
              {/* Right Column */}
              <div className="col-span-6 space-y-4">
                {/* 字段引用 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[13px] text-slate-700 font-medium">点击引用字段</h4>
                    <Info className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="mb-2">
                    <input placeholder="通过名称搜索" className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all" />
                  </div>
                  <div className="border border-slate-200 rounded-md p-3 max-h-[200px] overflow-y-auto">
                    <div className="mb-3">
                      <h5 className="text-[12px] text-slate-500 mb-2">维度</h5>
                      {['年份', '最大的年'].map((field) => (
                        <div key={field} className="flex items-center gap-2 mb-1.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer" onClick={() => setCalculatedFieldForm({...calculatedFieldForm, expression: calculatedFieldForm.expression + field})}>
                          <span className="text-blue-500 text-[11px]">T</span>
                          <span className="text-[13px] text-slate-700">{field}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h5 className="text-[12px] text-slate-500 mb-2">指标</h5>
                      {['国民总收入(亿元)', '国内生产总值(亿元)', '第一产业增加值(亿元)', '第二产业增加值(亿元)', '第三产业增加值(亿元)', '人均国内生产总值(元)'].map((field) => (
                        <div key={field} className="flex items-center gap-2 mb-1.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer" onClick={() => setCalculatedFieldForm({...calculatedFieldForm, expression: calculatedFieldForm.expression + field})}>
                          <span className="text-green-500 text-[11px]">#</span>
                          <span className="text-[13px] text-slate-700">{field}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 函数引用 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[13px] text-slate-700 font-medium">点击引用函数</h4>
                    <Info className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="mb-2">
                    <input placeholder="通过名称搜索" className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all" />
                  </div>
                  <div className="border border-slate-200 rounded-md p-3 max-h-[200px] overflow-y-auto">
                    {['SUBSTRING(s,n,len)', 'ABS(x)', 'CEIL(x)', 'FLOOR(x)', 'ROUND(x)', 'ROUND(x,y)', 'COUNT(x)', 'SUM(x)', 'AVG(x)', 'MAX(x)', 'MIN(x)'].map((func) => (
                      <div key={func} className="mb-1.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer" onClick={() => setCalculatedFieldForm({...calculatedFieldForm, expression: calculatedFieldForm.expression + func})}>
                        <span className="text-[13px] text-slate-700">{func}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCalculatedFieldModal(false)}
                className="px-4 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // 校验表达式
                  alert('校验成功！');
                }}
                className="px-4 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
              >
                校验
              </button>
              <button
                onClick={() => {
                  if (calculatedFieldForm.fieldName && calculatedFieldForm.expression) {
                    // 这里可以添加保存计算字段的逻辑
                    alert('计算字段创建成功！');
                    setShowCalculatedFieldModal(false);
                  }
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
