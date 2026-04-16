import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, Send, Eye, Trash2 } from "lucide-react";

interface Template {
  id: string;
  name: string;
  pointCount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export function TemplateManagementPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [templates] = useState<Template[]>([
    {
      id: "1",
      name: "温度监控模板",
      pointCount: 10,
      description: "用于温度传感器数据采集",
      createdAt: "2026-03-10 14:20:00",
      updatedAt: "2026-04-01 10:15:00",
    },
    {
      id: "2",
      name: "压力监控模板",
      pointCount: 8,
      description: "用于压力传感器数据采集",
      createdAt: "2026-03-12 09:30:00",
      updatedAt: "2026-03-28 16:45:00",
    },
  ]);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl text-slate-800">模板管理</h1>
          <button
            onClick={() => navigate("/myscada/template/create")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>新建模板</span>
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索模板名称"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="bg-white rounded-lg border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  模板名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  点位数量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  描述
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  更新时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-800">
                    {template.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {template.pointCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {template.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {template.createdAt}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {template.updatedAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/myscada/template/${template.id}`)}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/myscada/template/${template.id}/deploy`)}
                        className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"
                        title="下发"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
