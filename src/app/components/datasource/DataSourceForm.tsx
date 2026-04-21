import React, { useState, useEffect } from 'react';
import { X, Database, Globe, FileSpreadsheet } from 'lucide-react';
import { DataSource, DataSourceType } from '../DashboardContext';

interface DataSourceFormProps {
  dataSource?: DataSource;
  onSave: (dataSource: Omit<DataSource, 'id' | 'createdAt' | 'status'>) => void;
  onCancel: () => void;
  onTest?: (config: Omit<DataSource, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
}

export function DataSourceForm({ dataSource, onSave, onCancel, onTest }: DataSourceFormProps) {
  const [formData, setFormData] = useState<Omit<DataSource, 'id' | 'createdAt' | 'status'>>({
    name: '',
    type: 'mysql',
    description: '',
    host: 'localhost',
    port: 3306,
    database: '',
    username: '',
    password: '',
    jdbcExtra: '',
    connectionMethod: 'hostname',
    apiUrl: '',
    apiMethod: 'GET',
    apiHeaders: '{}',
    apiBody: '',
    fileUrl: '',
    creator: '管理员',
    excelOptions: {
      includeHeader: true,
      startRow: 1,
      dateFormat: 'YYYY-MM-DD',
      sheets: [],
      selectedSheet: '',
    },
    apiOptions: {
      authType: 'none',
      username: '',
      password: '',
      apiKey: '',
      token: '',
      jsonPath: '',
    },
  });
  
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    if (dataSource) {
      setFormData({
        name: dataSource.name,
        type: dataSource.type,
        description: dataSource.description,
        host: dataSource.host,
        port: dataSource.port,
        database: dataSource.database,
        username: dataSource.username,
        password: dataSource.password,
        jdbcExtra: dataSource.jdbcExtra,
        connectionMethod: dataSource.connectionMethod,
        apiUrl: dataSource.apiUrl,
        apiMethod: dataSource.apiMethod,
        apiHeaders: dataSource.apiHeaders,
        apiBody: dataSource.apiBody,
        fileUrl: dataSource.fileUrl,
        creator: dataSource.creator,
        excelOptions: dataSource.excelOptions || {
          includeHeader: true,
          startRow: 1,
          dateFormat: 'YYYY-MM-DD',
          sheets: [],
          selectedSheet: '',
        },
        apiOptions: dataSource.apiOptions || {
          authType: 'none',
          username: '',
          password: '',
          apiKey: '',
          token: '',
          jsonPath: '',
        },
      });
    }
  }, [dataSource]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleTest = async () => {
    if (!onTest) return;
    
    setTestStatus('testing');
    setTestMessage('正在测试连接...');
    
    try {
      const result = await onTest(formData);
      setTestStatus(result ? 'success' : 'error');
      setTestMessage(result ? '连接成功！' : '连接失败，请检查配置');
    } catch (error) {
      setTestStatus('error');
      setTestMessage('连接出错: ' + (error as Error).message);
    }
  };

  const renderTypeFields = () => {
    switch (formData.type) {
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
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">主机地址</label>
                <input
                  type="text"
                  value={formData.host || ''}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="localhost"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">端口</label>
                <input
                  type="number"
                  value={formData.port || ''}
                  onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={formData.type === 'mysql' ? '3306' : formData.type === 'postgresql' ? '5432' : '9000'}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">数据库名称</label>
              <input
                type="text"
                value={formData.database || ''}
                onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="my_database"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">用户名</label>
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">密码</label>
                <input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </>
        );

      case 'api':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">API 地址</label>
              <input
                type="text"
                value={formData.apiUrl || ''}
                onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://api.example.com/data"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">请求方法</label>
              <select
                value={formData.apiMethod || 'GET'}
                onChange={(e) => setFormData({ ...formData, apiMethod: e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE' })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">认证方式</label>
              <select
                value={formData.apiOptions?.authType}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  apiOptions: {
                    ...prev.apiOptions!,
                    authType: e.target.value as "none" | "basic" | "apikey" | "token",
                  }
                }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="none">无认证</option>
                <option value="basic">Basic认证</option>
                <option value="apikey">API Key</option>
                <option value="token">Token</option>
              </select>
            </div>
            
            {formData.apiOptions?.authType === 'basic' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">用户名</label>
                  <input
                    type="text"
                    value={formData.apiOptions?.username}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      apiOptions: {
                        ...prev.apiOptions!,
                        username: e.target.value,
                      }
                    }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">密码</label>
                  <input
                    type="password"
                    value={formData.apiOptions?.password}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      apiOptions: {
                        ...prev.apiOptions!,
                        password: e.target.value,
                      }
                    }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            )}
            
            {formData.apiOptions?.authType === 'apikey' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
                <input
                  type="text"
                  value={formData.apiOptions?.apiKey}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    apiOptions: {
                      ...prev.apiOptions!,
                      apiKey: e.target.value,
                    }
                  }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            )}
            
            {formData.apiOptions?.authType === 'token' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Token</label>
                <input
                  type="text"
                  value={formData.apiOptions?.token}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    apiOptions: {
                      ...prev.apiOptions!,
                      token: e.target.value,
                    }
                  }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">请求头 (JSON)</label>
              <textarea
                value={formData.apiHeaders || '{}'}
                onChange={(e) => setFormData({ ...formData, apiHeaders: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
                placeholder='{"Content-Type": "application/json"}'
              />
            </div>
            {formData.apiMethod !== 'GET' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">请求体 (JSON)</label>
                <textarea
                  value={formData.apiBody || ''}
                  onChange={(e) => setFormData({ ...formData, apiBody: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={4}
                  placeholder='{"key": "value"}'
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">JSONPath 数据路径</label>
              <input
                type="text"
                value={formData.apiOptions?.jsonPath}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  apiOptions: {
                    ...prev.apiOptions!,
                    jsonPath: e.target.value,
                  }
                }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="$.data.items"
              />
              <p className="text-xs text-slate-400 mt-1">用于从API响应中提取数据数组的路径</p>
            </div>
          </div>
        );

      case 'excel':
      case 'csv':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{formData.type === 'excel' ? 'Excel' : 'CSV'} 文件</label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                   onClick={() => document.querySelector('input[type="file"]')?.click()}>
                <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">点击或拖拽文件到此处上传</p>
                <p className="text-sm text-slate-400">支持 .{formData.type === 'excel' ? 'xlsx, .xls' : 'csv'} 格式</p>
                <input
                  type="file"
                  accept={formData.type === 'excel' ? ".xlsx,.xls" : ".csv"}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, fileUrl: URL.createObjectURL(file) });
                      // 模拟解析Excel文件，提取Sheet列表
                      if (formData.type === 'excel') {
                        setFormData(prev => ({
                          ...prev,
                          excelOptions: {
                            ...prev.excelOptions!,
                            sheets: ['Sheet1', 'Sheet2', 'Sheet3'],
                            selectedSheet: 'Sheet1',
                          }
                        }));
                      }
                    }
                  }}
                />
              </div>
            </div>

            {formData.fileUrl && formData.type === 'excel' && formData.excelOptions?.sheets.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">选择工作表</label>
                <select
                  value={formData.excelOptions.selectedSheet}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    excelOptions: {
                      ...prev.excelOptions!,
                      selectedSheet: e.target.value,
                    }
                  }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {formData.excelOptions.sheets.map(sheet => (
                    <option key={sheet} value={sheet}>{sheet}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">包含表头</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.excelOptions?.includeHeader}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      excelOptions: {
                        ...prev.excelOptions!,
                        includeHeader: e.target.checked,
                      }
                    }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-600">第一行作为表头</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">数据起始行</label>
                <input
                  type="number"
                  value={formData.excelOptions?.startRow}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    excelOptions: {
                      ...prev.excelOptions!,
                      startRow: parseInt(e.target.value),
                    }
                  }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">日期格式</label>
              <input
                type="text"
                value={formData.excelOptions?.dateFormat}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  excelOptions: {
                    ...prev.excelOptions!,
                    dateFormat: e.target.value,
                  }
                }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="YYYY-MM-DD"
              />
            </div>

            {formData.fileUrl && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">数据预览</label>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 grid grid-cols-3">
                    <div className="px-4 py-2 text-sm font-medium text-slate-600">字段1</div>
                    <div className="px-4 py-2 text-sm font-medium text-slate-600">字段2</div>
                    <div className="px-4 py-2 text-sm font-medium text-slate-600">字段3</div>
                  </div>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="grid grid-cols-3 border-b border-slate-100 last:border-b-0">
                      <div className="px-4 py-2 text-sm text-slate-700">数据{i}</div>
                      <div className="px-4 py-2 text-sm text-slate-700">数据{i+1}</div>
                      <div className="px-4 py-2 text-sm text-slate-700">数据{i+2}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">预览前5行数据</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl w-[600px] max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            {dataSource ? '编辑数据源' : '添加数据源'}
          </h3>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">数据源名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="输入数据源名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">数据源类型</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'mysql', icon: Database, label: 'MySQL' },
                { type: 'api', icon: Globe, label: 'API' },
                { type: 'excel', icon: FileSpreadsheet, label: 'Excel' },
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type as DataSourceType })}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                    formData.type === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="输入数据源描述"
            />
          </div>

          {/* Type-specific fields */}
          {renderTypeFields()}

          {/* Test result */}
          {testStatus !== 'idle' && (
            <div className={`p-3 rounded-lg ${
              testStatus === 'success' ? 'bg-green-50 text-green-700' :
              testStatus === 'error' ? 'bg-red-50 text-red-700' :
              'bg-slate-50 text-slate-700'
            }`}>
              {testMessage}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleTest}
              className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              测试连接
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
