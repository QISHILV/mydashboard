import React, { useState } from 'react';
import { Database, Globe, FileSpreadsheet, Plus, Search, RefreshCw, MoreVertical, Edit2, Trash2, Copy } from 'lucide-react';
import { DataSource } from '../DashboardContext';

interface DataSourceListProps {
  dataSources: DataSource[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTest: (id: string) => void;
  onRefresh: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function DataSourceList({ 
  dataSources, 
  onAdd, 
  onEdit, 
  onDelete, 
  onTest, 
  onRefresh, 
  onDuplicate 
}: DataSourceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const filteredDataSources = dataSources.filter(ds => {
    const matchesSearch = ds.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || ds.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mysql':
      case 'postgresql':
      case 'clickhouse':
      case 'oracle':
      case 'db2':
      case 'mariadb':
      case 'sqlserver':
      case 'tidb':
      case 'doris':
      case 'starrocks':
        return <Database className="w-5 h-5" />;
      case 'api':
        return <Globe className="w-5 h-5" />;
      case 'excel':
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5" />;
      default:
        return <Database className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mysql':
        return 'bg-blue-100 text-blue-600';
      case 'postgresql':
        return 'bg-green-100 text-green-600';
      case 'clickhouse':
        return 'bg-purple-100 text-purple-600';
      case 'api':
        return 'bg-pink-100 text-pink-600';
      case 'excel':
      case 'csv':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">数据源管理</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加数据源
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索数据源..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">全部类型</option>
          <option value="mysql">MySQL</option>
          <option value="postgresql">PostgreSQL</option>
          <option value="clickhouse">ClickHouse</option>
          <option value="api">API</option>
          <option value="excel">Excel</option>
          <option value="csv">CSV</option>
        </select>
      </div>

      {/* DataSource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDataSources.map((ds) => (
          <div
            key={ds.id}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(ds.type)}`}>
                  {getTypeIcon(ds.type)}
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">{ds.name}</h3>
                  <p className="text-sm text-slate-500 uppercase">{ds.type}</p>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(ds.status)}`} />
            </div>
            
            <div className="text-sm text-slate-500 mb-4">
              {ds.type === 'api' && ds.apiUrl && (
                <p className="truncate">{ds.apiUrl}</p>
              )}
              {ds.type !== 'api' && ds.host && (
                <p>{ds.host}:{ds.port}/{ds.database}</p>
              )}
              <p>创建时间: {new Date(ds.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(ds.id)}
                className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                编辑
              </button>
              <button
                onClick={() => onTest(ds.id)}
                className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                测试
              </button>
              <div className="relative">
                <button
                  onClick={() => {
                    setExpandedMenu(expandedMenu === ds.id ? null : ds.id);
                  }}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {expandedMenu === ds.id && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg z-10 min-w-[120px]">
                    <button
                      onClick={() => {
                        onRefresh(ds.id);
                        setExpandedMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      刷新
                    </button>
                    <button
                      onClick={() => {
                        onDuplicate(ds.id);
                        setExpandedMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      复制
                    </button>
                    <button
                      onClick={() => {
                        onDelete(ds.id);
                        setExpandedMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDataSources.length === 0 && (
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">暂无数据源，请点击上方按钮添加</p>
        </div>
      )}
    </div>
  );
}
