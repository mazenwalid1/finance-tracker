import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney, formatMonth } from "../../../lib/format";
import type { MonthlySeriesPoint } from "../types/analytics.types";

export function IncomeExpenseChart({
  data,
}: {
  data: MonthlySeriesPoint[];
}) {
  const hasData = data.some((point) => point.income > 0 || point.expenses > 0);

  if (!hasData) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-[#7A857F]">
        No income or expense activity in this period.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -12 }}>
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
            cursor={{ fill: "#F5F7F4" }}
          />
          <Bar dataKey="income" fill="#2F7F68" radius={[5, 5, 0, 0]} />
          <Bar dataKey="expenses" fill="#D97745" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
