"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StatChartProps {
  data: Array<{
    name: string;
    [key: string]: string | number;
  }>;
  type?: "bar" | "line";
  dataKey: string;
  color?: string;
}

export default function StatChart({
  data,
  type = "bar",
  dataKey,
  color = "#71717a",
}: StatChartProps) {
  const ChartComponent = type === "bar" ? BarChart : LineChart;
  const DataComponent = type === "bar" ? Bar : Line;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <ChartComponent
        data={data}
        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
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
        <DataComponent
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fill={color}
          strokeWidth={2}
          radius={type === "bar" ? [4, 4, 0, 0] : undefined}
        />
      </ChartComponent>
    </ResponsiveContainer>
  );
}

