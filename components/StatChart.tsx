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

  // 데이터 개수에 따라 막대 크기 조정 (2명일 때 너무 두껍지 않게)
  const barSize = type === "bar" 
    ? data.length <= 2 
      ? 40 
      : data.length <= 3 
      ? 50 
      : undefined 
    : undefined;

  // 숫자를 1k, 1M 형식으로 변환
  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'k';
    }
    return value.toString();
  };


  // Y축 최대값 계산 (데이터 최대값의 120%로 여유있게)
  const maxValue = data.length > 0 
    ? Math.max(...data.map(d => {
        const value = d[dataKey];
        return typeof value === 'number' ? value : parseFloat(String(value)) || 0;
      }))
    : 0;
  const yAxisDomain: [number, number] | [number, string] = maxValue > 0 ? [0, maxValue * 1.2] : [0, 'auto'];

  return (
    <div className="[&_.recharts-active-bar]:!fill-transparent [&_.recharts-active-bar]:!stroke-transparent [&_.recharts-bar-rectangle]:focus:!outline-none [&_.recharts-active-bar]:!outline-none [&_.recharts-tooltip-wrapper]:!hidden [&_.recharts-cursor]:!hidden [&_.recharts-bar-rectangle]:!cursor-default [&_*]:!user-select-none [&_*]:!ring-0 [&_*]:focus:!ring-0 [&_*]:focus-visible:!ring-0">
      <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
        <ChartComponent
          data={data}
          margin={{ top: 15, right: 5, left: -10, bottom: 5 }}
          onClick={() => {}}
          onMouseDown={() => {}}
          onMouseUp={() => {}}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-300 dark:stroke-zinc-700" />
          <XAxis
            dataKey="name"
            className="text-[10px] sm:text-xs fill-zinc-600 dark:fill-zinc-400"
            tick={{ fill: "currentColor" }}
          />
          <YAxis
            className="text-[10px] sm:text-xs fill-zinc-600 dark:fill-zinc-400"
            tick={{ fill: "currentColor" }}
            tickFormatter={formatNumber}
            domain={yAxisDomain}
            width={35}
          />
          {type === "bar" ? (
            <Bar
              dataKey={dataKey}
              fill={color}
              radius={[4, 4, 0, 0] as [number, number, number, number]}
              barSize={barSize}
              activeBar={false}
              isAnimationActive={false}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              onClick={() => {}}
              onMouseDown={() => {}}
              onMouseUp={() => {}}
              label={{
                position: "top",
                fill: color,
                fontSize: 10,
                fontWeight: 600,
                formatter: (value: any) => {
                  const numValue = typeof value === 'number' ? value : parseFloat(value);
                  if (isNaN(numValue)) return '';
                  
                  // 값 포맷팅
                  if (numValue >= 1000) {
                    return numValue.toLocaleString();
                  } else if (numValue % 1 !== 0) {
                    return numValue.toFixed(2);
                  }
                  return numValue.toString();
                }
              }}
            />
          ) : (
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              activeDot={false}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}


