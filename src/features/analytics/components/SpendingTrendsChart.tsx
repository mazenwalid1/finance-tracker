import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney, formatMonth } from "../../../lib/format";
import type { MonthlySeriesPoint } from "../types/analytics.types";

export function SpendingTrendsChart({
  data,
}: {
  data: MonthlySeriesPoint[];
}) {
  const hasData = data.some((point) => point.expenses > 0);

  if (!hasData) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-[#7A857F]">
        No expense activity in this period.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <CartesianGrid stroke="#EEF0EC" vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={(month: string) =>
              new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                new Date(`${month}-01T00:00:00`),
              )
            }
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#66736D", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#66736D", fontSize: 12 }}
            tickFormatter={(value: number) =>
              value === 0 ? "0" : `${Math.round(value / 1000)}k`
            }
          />
          <Tooltip
            formatter={(value) => formatMoney(Number(value))}
            labelFormatter={(month) => formatMonth(String(month))}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#D97745"
            strokeWidth={3}
            dot={{ fill: "#FFFFFF", stroke: "#D97745", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
