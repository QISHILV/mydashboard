import React, { useState } from "react";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";

interface FilterCondition {
  id: string;
  field: string;
  filterType: "condition" | "enum";
  operator: string;
  value: string;
}

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  fields: Array<{ name: string; type: string }>;
  onConfirm: (conditions: FilterCondition[], logic: "AND" | "OR") => void;
}

const operators = ["等于", "不等于", "包含", "不包含", "为空", "不为空", "空字符串", "非空字符串"];
const enumValues = ["值1", "值2", "值3", "值4"];

export function FilterDialog({ open, onClose, fields, onConfirm }: FilterDialogProps) {
  const [logic, setLogic] = useState<"AND" | "OR">("OR");
  const [conditions, setConditions] = useState<FilterCondition[]>([
    { id: "1", field: "门店占比", filterType: "condition", operator: "", value: "" }
  ]);
  const [showFilterTypeMenu, setShowFilterTypeMenu] = useState<string | null>(null);
  const [showOperatorMenu, setShowOperatorMenu] = useState<string | null>(null);
  const [showEnumMenu, setShowEnumMenu] = useState<string | null>(null);

  if (!open) return null;

  const addCondition = () => {
    setConditions([...conditions, {
      id: Date.now().toString(),
      field: "",
      filterType: "condition",
      operator: "",
      value: ""
    }]);
  };

  const addRelation = () => {
    setConditions([...conditions, {
      id: Date.now().toString(),
      field: "",
      filterType: "condition",
      operator: "",
      value: ""
    }]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-[900px] max-h-[600px] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-[16px] font-medium text-slate-800">添加过滤</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {conditions.map((condition, index) => (
              <div key={condition.id} className="flex items-center gap-3">
                {index > 0 && (
                  <button
                    onClick={() => setLogic(logic === "OR" ? "AND" : "OR")}
                    className="text-[13px] text-slate-500 hover:text-blue-600 flex items-center gap-1 min-w-[50px]"
                  >
                    {logic} <ChevronDown className="w-3 h-3" />
                  </button>
                )}

                <div className="flex-1 flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                  <span className="text-[13px] text-slate-500">筛选字段</span>

                  <input
                    type="text"
                    value={condition.field}
                    onChange={e => updateCondition(condition.id, { field: e.target.value })}
                    placeholder="门店占比"
                    className="px-3 py-1.5 border border-slate-200 rounded text-[13px] outline-none focus:border-blue-400 w-[120px]"
                  />

                  <span className="text-[13px] text-slate-500">筛选方式</span>

                  <div className="relative">
                    <button
                      onClick={() => setShowFilterTypeMenu(showFilterTypeMenu === condition.id ? null : condition.id)}
                      className="px-3 py-1.5 border border-slate-200 rounded text-[13px] flex items-center gap-2 hover:border-blue-400 min-w-[110px] justify-between bg-white"
                    >
                      <span>{condition.filterType === "condition" ? "条件筛选" : "枚举值筛选"}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {showFilterTypeMenu === condition.id && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 min-w-[110px]">
                        <button
                          onClick={() => {
                            updateCondition(condition.id, { filterType: "condition", operator: "", value: "" });
                            setShowFilterTypeMenu(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-[13px] hover:bg-slate-50 text-slate-700"
                        >
                          条件筛选
                        </button>
                        <button
                          onClick={() => {
                            updateCondition(condition.id, { filterType: "enum", operator: "", value: "" });
                            setShowFilterTypeMenu(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-[13px] hover:bg-slate-50 text-slate-700"
                        >
                          枚举值筛选
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-[13px] text-slate-500">固定值</span>

                  {condition.filterType === "condition" ? (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          onClick={() => setShowOperatorMenu(showOperatorMenu === condition.id ? null : condition.id)}
                          className="px-3 py-1.5 border border-slate-200 rounded text-[13px] flex items-center gap-2 hover:border-blue-400 min-w-[100px] justify-between bg-white"
                        >
                          <span className={condition.operator ? "text-slate-700" : "text-slate-400"}>
                            {condition.operator || "默认条件"}
                          </span>
                          <ChevronDown className="w-3 h-3" />
                        </button>

                        {showOperatorMenu === condition.id && (
                          <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                            {operators.map(op => (
                              <button
                                key={op}
                                onClick={() => {
                                  updateCondition(condition.id, { operator: op });
                                  setShowOperatorMenu(null);
                                }}
                                className="w-full px-3 py-1.5 text-left text-[13px] hover:bg-slate-50 text-slate-700"
                              >
                                {op}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <input
                        type="text"
                        value={condition.value}
                        onChange={e => updateCondition(condition.id, { value: e.target.value })}
                        placeholder="输入值"
                        className="px-3 py-1.5 border border-slate-200 rounded text-[13px] outline-none focus:border-blue-400 w-[120px]"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={() => setShowEnumMenu(showEnumMenu === condition.id ? null : condition.id)}
                        className="px-3 py-1.5 border border-slate-200 rounded text-[13px] flex items-center gap-2 hover:border-blue-400 min-w-[150px] justify-between bg-white"
                      >
                        <span className={condition.value ? "text-slate-700" : "text-slate-400"}>
                          {condition.value || "选择枚举值"}
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {showEnumMenu === condition.id && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
                          {enumValues.map(val => (
                            <button
                              key={val}
                              onClick={() => {
                                updateCondition(condition.id, { value: val });
                                setShowEnumMenu(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-[13px] hover:bg-slate-50 text-slate-700"
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => removeCondition(condition.id)}
                    className="text-slate-400 hover:text-red-500 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={addCondition}
              className="px-3 py-1.5 text-[13px] text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              添加条件
            </button>
            <button
              onClick={addRelation}
              className="px-3 py-1.5 text-[13px] text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              添加关系
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] border border-slate-200 rounded hover:bg-slate-50"
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirm(conditions, logic);
              onClose();
            }}
            className="px-4 py-2 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}
