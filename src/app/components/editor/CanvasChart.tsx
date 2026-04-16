import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart,
} from "recharts";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6"];

const barData = [
  { name: "1月", value1: 4000, value2: 2400, value3: 1800 },
  { name: "2月", value1: 3000, value2: 1398, value3: 2200 },
  { name: "3月", value1: 2000, value2: 4800, value3: 2800 },
  { name: "4月", value1: 2780, value2: 3908, value3: 1900 },
  { name: "5月", value1: 1890, value2: 4800, value3: 3200 },
  { name: "6月", value1: 2390, value2: 3800, value3: 2500 },
];

const lineData = [
  { name: "周一", uv: 4000, pv: 2400 },
  { name: "周二", uv: 3000, pv: 1398 },
  { name: "周三", uv: 2000, pv: 9800 },
  { name: "周四", uv: 2780, pv: 3908 },
  { name: "周五", uv: 1890, pv: 4800 },
  { name: "周六", uv: 2390, pv: 3800 },
  { name: "周日", uv: 3490, pv: 4300 },
];

const pieData = [
  { name: "直接访问", value: 335 },
  { name: "搜索引擎", value: 310 },
  { name: "邮件营销", value: 234 },
  { name: "联盟广告", value: 135 },
  { name: "视频广告", value: 148 },
];

const scatterData = [
  { x: 100, y: 200 }, { x: 120, y: 100 }, { x: 170, y: 300 },
  { x: 140, y: 250 }, { x: 150, y: 400 }, { x: 110, y: 280 },
  { x: 200, y: 180 }, { x: 250, y: 350 }, { x: 300, y: 250 },
];

const radarData = [
  { subject: "销售", A: 120, B: 110 },
  { subject: "管理", A: 98, B: 130 },
  { subject: "技术", A: 86, B: 130 },
  { subject: "客服", A: 99, B: 100 },
  { subject: "开发", A: 85, B: 90 },
  { subject: "市场", A: 65, B: 85 },
];

interface CanvasChartProps {
  type: string;
  width: number;
  height: number;
}

export function CanvasChart({ type, width, height }: CanvasChartProps) {
  const chartHeight = height - 8;

  switch (type) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={barData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value1" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="value2" fill="#10b981" radius={[2, 2, 0, 0]} />
            <Bar dataKey="value3" fill="#f59e0b" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case "horizontal-bar":
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={barData} layout="vertical" margin={{ top: 8, right: 8, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value1" fill="#6366f1" radius={[0, 2, 2, 0]} />
            <Bar dataKey="value2" fill="#f59e0b" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case "bar-line":
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <ComposedChart data={barData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value1" fill="#6366f1" radius={[2, 2, 0, 0]} />
            <Line type="monotone" dataKey="value2" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      );

    case "capsule-bar":
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={barData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value1" fill="#8b5cf6" radius={[10, 10, 10, 10]} barSize={12} />
            <Bar dataKey="value2" fill="#a78bfa" radius={[10, 10, 10, 10]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      );

    case "line":
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={lineData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="uv" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="pv" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      );

    case "area":
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={lineData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <Tooltip />
            <Area type="monotone" dataKey="uv" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
            <Area type="monotone" dataKey="pv" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      );

    case "pie":
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={Math.min(width, chartHeight) / 3} dataKey="value" label={{ fontSize: 10 }}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );

    case "donut":
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={Math.min(width, chartHeight) / 5} outerRadius={Math.min(width, chartHeight) / 3} dataKey="value">
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );

    case "scatter":
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <ScatterChart margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="x" tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <YAxis dataKey="y" tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <Tooltip />
            <Scatter data={scatterData} fill="#6366f1" />
          </ScatterChart>
        </ResponsiveContainer>
      );

    case "radar":
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={Math.min(width, chartHeight) / 3}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fontSize: 8 }} />
            <Radar name="A" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
            <Radar name="B" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      );

    default:
      return (
        <div className="flex items-center justify-center h-full text-slate-400 text-[13px]">
          未知图表类型
        </div>
      );
  }
}
