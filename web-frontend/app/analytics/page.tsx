"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

const weeklyData = [
  { day: "周一", tokens: 12500, cost: 0.05 },
  { day: "周二", tokens: 18200, cost: 0.07 },
  { day: "周三", tokens: 15800, cost: 0.06 },
  { day: "周四", tokens: 21300, cost: 0.09 },
  { day: "周五", tokens: 19500, cost: 0.08 },
  { day: "周六", tokens: 28000, cost: 0.11 },
  { day: "周日", tokens: 24700, cost: 0.10 },
];

const monthlyData = [
  { week: "第1周", tokens: 85000, cost: 0.34 },
  { week: "第2周", tokens: 92000, cost: 0.37 },
  { week: "第3周", tokens: 78000, cost: 0.31 },
  { week: "第4周", tokens: 105000, cost: 0.42 },
];

const categoryData = [
  { name: "上课对话", value: 65, color: "#3B82F6" },
  { name: "课件读取", value: 20, color: "#10B981" },
  { name: "群聊互动", value: 15, color: "#8B5CF6" },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  const totalTokens = weeklyData.reduce((sum, d) => sum + d.tokens, 0);
  const totalCost = weeklyData.reduce((sum, d) => sum + d.cost, 0);
  const avgDaily = totalTokens / 7;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Token 消耗统计
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          监控 API 使用量与成本
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">本周消耗</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {totalTokens.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">预估成本</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${totalCost.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">日均消耗</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {avgDaily.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">相比上周</p>
              <p className="text-xl font-bold text-green-500">-12%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTimeRange("week")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeRange === "week"
              ? "bg-primary-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          本周
        </button>
        <button
          onClick={() => setTimeRange("month")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeRange === "month"
              ? "bg-primary-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          本月
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Token 消耗趋势
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeRange === "week" ? weeklyData : monthlyData}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey={timeRange === "week" ? "day" : "week"}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tokens"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            分类统计
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#9CA3AF"
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value: number) => [`${value}%`, "占比"]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          每日明细
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  日期
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  Token 数量
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  预估成本
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  占比
                </th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((row, index) => (
                <tr
                  key={row.day}
                  className="border-b border-gray-100 dark:border-gray-700"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    {row.day}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                    {row.tokens.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                    ${row.cost.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-500">
                    {((row.tokens / totalTokens) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  合计
                </td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                  {totalTokens.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                  ${totalCost.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}