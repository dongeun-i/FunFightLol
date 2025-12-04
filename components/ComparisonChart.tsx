"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ComparisonChartProps {
  data: Array<{
    name: string;
    [key: string]: string | number;
  }>;
  colors?: string[];
}

export default function ComparisonChart({
  data,
  colors = ["#71717a", "#a855f7", "#3b82f6", "#10b981", "#f59e0b"],
}: ComparisonChartProps) {
  // 데이터에서 name을 제외한 모든 키를 가져옴
  const keys = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== "name")
    : [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-300 dark:stroke-zinc-700" />
        <XAxis
          dataKey="name"
          className="text-xs fill-zinc-600 dark:fill-zinc-400"
          tick={{ fill: "currentColor" }}
        />
        <YAxis
          className="text-xs fill-zinc-600 dark:fill-zinc-400"
          tick={{ fill: "currentColor" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--tw-color-zinc-100)",
            border: "1px solid var(--tw-color-zinc-300)",
            borderRadius: "8px",
          }}
          className="dark:bg-zinc-800 dark:border-zinc-700"
        />
        <Legend />
        {keys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}


