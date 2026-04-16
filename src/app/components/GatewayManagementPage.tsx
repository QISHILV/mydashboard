import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, Edit, Trash2, Link as LinkIcon } from "lucide-react";

interface Gateway {
  id: string;
  name: string;
  ip: string;
  port: number;
  status: "online" | "offline";
  deviceCount: number;
  createdAt: string;
  updatedAt: string;
}

export function GatewayManagementPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [gateways] = useState<Gateway[]>([
    {
      id: "1",
      name: "网关1",
      ip: "192.168.1.100",
      port: 502,
      status: "online",
      deviceCount: 5,
      createdAt: "2026-03-15 10:30:00",
      updatedAt: "2026-04-02 14:20:00",
    },
    {
      id: "2",
      name: "网关2",
      ip: "192.168.1.101",
      port: 502,
      status: "offline",
      deviceCount: 3,
      createdAt: "2026-03-20 09:15:00",
      updatedAt: "2026-04-01 16:45:00",
    },
  ]);

  const filteredGateways = gateways.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.ip.includes(searchTerm)
  );

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl text-slate-800">网关管理</h1>
          <button
            onClick={() => navigate("/myscada/gateway/create")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>新建网关</span>
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索网关名称或IP地址"
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
                  网关名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  IP地址
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  端口
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  关联设备数
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
              {filteredGateways.map((gateway) => (
                <tr key={gateway.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-800">
                    {gateway.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {gateway.ip}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {gateway.port}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        gateway.status === "online"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {gateway.status === "online" ? "在线" : "离线"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {gateway.deviceCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {gateway.updatedAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/myscada/gateway/${gateway.id}/devices`)}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                        title="关联设备"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/myscada/gateway/edit/${gateway.id}`)}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
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
