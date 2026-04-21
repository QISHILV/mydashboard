import React, { useState, useEffect, useMemo } from "react";
import { DataSet, DataSource, Field, CalculatedField } from "../DashboardContext";
import { X, Check, Plus, Trash2, Edit3, PlayCircle, Database, FileText, ChevronDown, ChevronUp, Search } from "lucide-react";

interface DataSetFormProps {
  dataSet: DataSet | undefined;
  dataSources: DataSource[];
  onSave: (dataSet: Omit<DataSet, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function DataSetForm({ dataSet, dataSources, onSave, onCancel }: DataSetFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<"table" | "sql" | "api" | "file">(dataSet?.type || "table");
  const [name, setName] = useState(dataSet?.name || "");
  const [description, setDescription] = useState(dataSet?.description || "");
  const [category, setCategory] = useState(dataSet?.category || "");
  const [sourceId, setSourceId] = useState(dataSet?.sourceId || "");
  const [tableName, setTableName] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [apiMethod, setApiMethod] = useState<"GET" | "POST" | "PUT" | "DELETE">("GET");
  const [apiHeaders, setApiHeaders] = useState("");
  const [apiBody, setApiBody] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fields, setFields] = useState<Field[]>(dataSet?.fields || []);
  const [calculatedFields, setCalculatedFields] = useState<CalculatedField[]>(dataSet?.calculatedFields || []);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | undefined>();
  const [tables, setTables] = useState<{ name: string }[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (sourceId) {
      const ds = dataSources.find(ds => ds.id === sourceId);
      setSelectedDataSource(ds);
      // 模拟获取表列表
      if (ds) {
        setTables([
          { name: "users" },
          { name: "orders" },
          { name: "products" },
          { name: "categories" },
        ]);
      }
    } else {
      setSelectedDataSource(undefined);
      setTables([]);
    }
  }, [sourceId, dataSources]);

  const handleAddField = () => {
    setFields([...fields, {
      id: `field-${Date.now()}`,
      name: `field_${fields.length + 1}`,
      label: `字段 ${fields.length + 1}`,
      type: "string",
      description: "",
    }]);
  };

  const handleUpdateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleAddCalculatedField = () => {
    setCalculatedFields([...calculatedFields, {
      id: `calc-${Date.now()}`,
      name: `calc_${calculatedFields.length + 1}`,
      label: `计算字段 ${calculatedFields.length + 1}`,
      expression: "",
      description: "",
    }]);
  };

  const handleUpdateCalculatedField = (id: string, updates: Partial<CalculatedField>) => {
    setCalculatedFields(calculatedFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const handleDeleteCalculatedField = (id: string) => {
    setCalculatedFields(calculatedFields.filter(field => field.id !== id));
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    // 模拟测试连接
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = Math.random() > 0.2; // 80% 成功率
    setTestResult({
      success,
      message: success ? "连接成功" : "连接失败，请检查配置"
    });
    
    setIsTesting(false);
  };

  const handleSave = () => {
    if (!name || !sourceId) {
      alert("请填写必要信息");
      return;
    }

    onSave({
      name,
      type,
      description,
      category,
      sourceId,
      fields,
      calculatedFields,
      tableName: type === "table" ? tableName : undefined,
      sqlQuery: type === "sql" ? sqlQuery : undefined,
      apiUrl: type === "api" ? apiUrl : undefined,
      apiMethod: type === "api" ? apiMethod : undefined,
      apiHeaders: type === "api" ? apiHeaders : undefined,
      apiBody: type === "api" ? apiBody : undefined,
      fileUrl: type === "file" ? fileUrl : undefined,
      creator: "管理员",
    });
  };

  const steps = [
    { id: 1, title: "基本信息" },
    { id: 2, title: "数据源配置" },
    { id: 3, title: "字段配置" },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-[16px] text-slate-800 font-medium">
            {dataSet ? "编辑数据集" : "新建数据集"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            {steps.map((stepItem) => (
              <div key={stepItem.id} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] ${step >= stepItem.id ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                  {step > stepItem.id ? <Check className="w-3.5 h-3.5" /> : stepItem.id}
                </div>
                <span className={`text-[13px] ${step >= stepItem.id ? "text-slate-800" : "text-slate-400"}`}>
                  {stepItem.title}
                </span>
                {stepItem.id < steps.length && (
                  <div className={`w-8 h-px ${step > stepItem.id ? "bg-blue-500" : "bg-slate-300"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  数据集名称 <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入数据集名称"
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                />
              </div>

              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="请输入描述"
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">分类</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="请输入分类"
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                />
              </div>

              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  数据集类型 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: "table", label: "表", icon: <Database className="w-4 h-4" /> },
                    { value: "sql", label: "SQL", icon: <FileText className="w-4 h-4" /> },
                    { value: "api", label: "API", icon: <PlayCircle className="w-4 h-4" /> },
                    { value: "file", label: "文件", icon: <FileText className="w-4 h-4" /> },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setType(option.value as any)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-md border transition-all ${type === option.value ? "border-blue-300 bg-blue-50" : "border-slate-200 hover:border-blue-200"}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === option.value ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                        {option.icon}
                      </div>
                      <span className={`text-[13px] ${type === option.value ? "text-blue-600 font-medium" : "text-slate-700"}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="text-[13px] text-slate-700 mb-1.5 block">
                  数据源 <span className="text-red-500">*</span>
                </label>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                >
                  <option value="">请选择数据源</option>
                  {dataSources.map((ds) => (
                    <option key={ds.id} value={ds.id}>
                      {ds.name} ({ds.type})
                    </option>
                  ))}
                </select>
              </div>

              {type === "table" && selectedDataSource && (
                <div>
                  <label className="text-[13px] text-slate-700 mb-1.5 block">
                    表名 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                  >
                    <option value="">请选择表</option>
                    {tables.map((table) => (
                      <option key={table.name} value={table.name}>
                        {table.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {type === "sql" && (
                <div>
                  <label className="text-[13px] text-slate-700 mb-1.5 block">
                    SQL 查询 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="请输入SQL查询语句"
                    rows={6}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all resize-none font-mono"
                  />
                </div>
              )}

              {type === "api" && (
                <>
                  <div>
                    <label className="text-[13px] text-slate-700 mb-1.5 block">
                      API URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="请输入API URL"
                      className="w-full px-3 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[13px] text-slate-700 mb-1.5 block">请求方法</label>
                    <select
                      value={apiMethod}
                      onChange={(e) => setApiMethod(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[13px] text-slate-700 mb-1.5 block">请求头 (JSON格式)</label>
                    <textarea
                      value={apiHeaders}
                      onChange={(e) => setApiHeaders(e.target.value)}
                      placeholder='例如: {"Content-Type": "application/json"}'
                      rows={3}
                      className="w-full px-3 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all resize-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[13px] text-slate-700 mb-1.5 block">请求体 (JSON格式)</label>
                    <textarea
                      value={apiBody}
                      onChange={(e) => setApiBody(e.target.value)}
                      placeholder='例如: {"key": "value"}'
                      rows={3}
                      className="w-full px-3 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all resize-none font-mono"
                    />
                  </div>
                </>
              )}

              {type === "file" && (
                <div>
                  <label className="text-[13px] text-slate-700 mb-1.5 block">
                    文件路径 <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="请输入文件路径或URL"
                    className="w-full px-3 py-2 rounded-md border border-slate-200 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
              )}

              <div>
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting || !sourceId}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500 text-white text-[14px] hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isTesting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <PlayCircle className="w-4 h-4" />
                  )}
                  {isTesting ? "测试中..." : "测试连接"}
                </button>
                {testResult && (
                  <div className={`mt-2 px-3 py-2 rounded-md text-[13px] ${testResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {testResult.message}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              {/* 基础字段 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] text-slate-800 font-medium">基础字段</h3>
                  <button
                    onClick={handleAddField}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-blue-300 text-blue-500 text-[13px] hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    添加字段
                  </button>
                </div>
                <div className="space-y-3">
                  {fields.map((field) => (
                    <div key={field.id} className="bg-white rounded-lg border border-slate-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[13px] text-slate-800 font-medium">字段 {fields.indexOf(field) + 1}</h4>
                        <button
                          onClick={() => handleDeleteField(field.id)}
                          className="p-1 rounded-md hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[12px] text-slate-700 mb-1 block">字段名</label>
                          <input
                            value={field.name}
                            onChange={(e) => handleUpdateField(field.id, { name: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[12px] text-slate-700 mb-1 block">显示名称</label>
                          <input
                            value={field.label}
                            onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[12px] text-slate-700 mb-1 block">字段类型</label>
                          <select
                            value={field.type}
                            onChange={(e) => handleUpdateField(field.id, { type: e.target.value as any })}
                            className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                          >
                            <option value="string">字符串</option>
                            <option value="number">数值</option>
                            <option value="boolean">布尔值</option>
                            <option value="date">日期</option>
                            <option value="datetime">日期时间</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[12px] text-slate-700 mb-1 block">描述</label>
                          <input
                            value={field.description}
                            onChange={(e) => handleUpdateField(field.id, { description: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 计算字段 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] text-slate-800 font-medium">计算字段</h3>
                  <button
                    onClick={handleAddCalculatedField}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-blue-300 text-blue-500 text-[13px] hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    添加计算字段
                  </button>
                </div>
                <div className="space-y-3">
                  {calculatedFields.map((field) => (
                    <div key={field.id} className="bg-white rounded-lg border border-slate-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[13px] text-slate-800 font-medium">计算字段 {calculatedFields.indexOf(field) + 1}</h4>
                        <button
                          onClick={() => handleDeleteCalculatedField(field.id)}
                          className="p-1 rounded-md hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[12px] text-slate-700 mb-1 block">字段名</label>
                            <input
                              value={field.name}
                              onChange={(e) => handleUpdateCalculatedField(field.id, { name: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-[12px] text-slate-700 mb-1 block">显示名称</label>
                            <input
                              value={field.label}
                              onChange={(e) => handleUpdateCalculatedField(field.id, { label: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                            />
                          </div>
                        </div>
                        
                        {/* 字段选择和公式编辑器 */}
                        <div>
                          <label className="text-[12px] text-slate-700 mb-1 block">计算公式</label>
                          <div className="flex flex-col gap-2">
                            {/* 字段选择区 */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="text-[12px] text-slate-500">可用字段:</span>
                              {fields.map(f => (
                                <button
                                  key={f.id}
                                  onClick={() => {
                                    const currentExpr = field.expression || '';
                                    handleUpdateCalculatedField(field.id, { 
                                      expression: currentExpr + f.name 
                                    });
                                  }}
                                  className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded hover:bg-slate-200 cursor-pointer"
                                >
                                  {f.name}
                                </button>
                              ))}
                            </div>
                            
                            {/* 运算符按钮 */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {['+', '-', '*', '/', '(', ')', 'SUM', 'AVG', 'MAX', 'MIN', 'ABS', 'IF', 'DATE'].map(op => (
                                <button
                                  key={op}
                                  onClick={() => {
                                    const currentExpr = field.expression || '';
                                    handleUpdateCalculatedField(field.id, { 
                                      expression: currentExpr + op 
                                    });
                                  }}
                                  className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded hover:bg-blue-100 cursor-pointer"
                                >
                                  {op}
                                </button>
                              ))}
                            </div>
                            
                            {/* 公式输入框 */}
                            <input
                              value={field.expression}
                              onChange={(e) => handleUpdateCalculatedField(field.id, { expression: e.target.value })}
                              placeholder="例如: SUM(能力1) + AVG(能力2)"
                              className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all font-mono"
                            />
                            
                            {/* 语法校验 */}
                            <div className="text-xs text-red-500">
                              {/* 模拟语法校验 */}
                              {field.expression && field.expression.includes('/ 0') && '错误: 除数不能为0'}
                              {field.expression && field.expression.includes('(') && !field.expression.includes(')') && '错误: 括号不匹配'}
                            </div>
                          </div>
                        </div>
                        
                        {/* 数据预览 */}
                        <div>
                          <label className="text-[12px] text-slate-700 mb-1 block">数据预览</label>
                          <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 grid grid-cols-2">
                              <div className="px-3 py-1.5 text-xs font-medium text-slate-600">原始值</div>
                              <div className="px-3 py-1.5 text-xs font-medium text-slate-600">计算结果</div>
                            </div>
                            {[100, 200, 300, 400, 500].map((value, index) => (
                              <div key={index} className="grid grid-cols-2 border-b border-slate-100 last:border-b-0">
                                <div className="px-3 py-1.5 text-xs text-slate-700">{value}</div>
                                <div className="px-3 py-1.5 text-xs text-slate-700">
                                  {/* 模拟计算结果 */}
                                  {field.expression?.includes('SUM') ? value * 2 : 
                                   field.expression?.includes('AVG') ? value / 2 : 
                                   field.expression?.includes('MAX') ? 1000 : 
                                   field.expression?.includes('MIN') ? 0 : 
                                   value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-[12px] text-slate-700 mb-1 block">描述</label>
                          <input
                            value={field.description}
                            onChange={(e) => handleUpdateCalculatedField(field.id, { description: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-blue-300 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1) as 1 | 2 | 3)}
            disabled={step === 1}
            className="px-4 py-2 rounded-md border border-slate-200 text-[14px] text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            上一步
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-slate-200 text-[14px] text-slate-600 hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep(Math.min(3, step + 1) as 1 | 2 | 3)}
                className="px-4 py-2 rounded-md bg-blue-500 text-white text-[14px] hover:bg-blue-600 transition-colors"
              >
                下一步
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-blue-500 text-white text-[14px] hover:bg-blue-600 transition-colors"
              >
                保存
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
