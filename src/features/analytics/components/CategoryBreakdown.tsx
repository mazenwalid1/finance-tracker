import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatMoney } from "../../../lib/format";
import type { CategorySpending } from "../types/analytics.types";

const COLORS = [
  "#2F7F68",
  "#D97745",
  "#5576A4",
  "#A76891",
  "#C59B3C",
  "#738A73",
  "#8A6DAA",
];

export function CategoryBreakdown({
  data,
}: {
  data: CategorySpending[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-[#7A857F]">
        No expenses in this month.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="44%"
            innerRadius={58}
            outerRadius={88}
            paddingAngle={2}
          >
            {data.map((item, index) => (
              <Cell
                key={item.category}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) =>
              [`${formatMoney(Number(value))}`, String(name)]
            }
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => {
              const item = data.find((category) => category.category === value);
              return `${value} (${item?.percentage.toFixed(0) ?? 0}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
