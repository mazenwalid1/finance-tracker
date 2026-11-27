import { formatMoney } from "../../../lib/format";
import type { MonthComparison } from "../types/analytics.types";

type SummaryCardsProps = {
  balance: number;
  income: MonthComparison;
  expenses: MonthComparison;
  savings: MonthComparison;
};

const ChangeIndicator = ({ value }: { value: number | null }) => {
  if (value === null) {
    return <span className="text-xs text-[#7A857F]">No previous-month data</span>;
  }

  const positive = value >= 0;
  return (
    <span
      className={`text-xs font-semibold ${positive ? "text-[#18794E]" : "text-[#B42318]"}`}
    >
      {positive ? "↑" : "↓"} {Math.abs(value).toFixed(1)}%
    </span>
  );
};

const Card = ({
  label,
  value,
  comparison,
  positiveIsGood = true,
}: {
  label: string;
  value: number;
  comparison?: MonthComparison;
  positiveIsGood?: boolean;
}) => {
  const change = comparison?.percentChange ?? null;
  const isGood =
    change === null
      ? undefined
      : positiveIsGood
        ? change >= 0
        : change <= 0;

  return (
    <article className="rounded-2xl border border-[#E3E6E1] bg-white p-5 shadow-[0_1px_2px_rgba(20,32,27,0.03)]">
      <div className="text-sm font-medium text-[#66736D]">{label}</div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-[#14201B]">
        {formatMoney(value)}
      </div>
      {comparison && (
        <div className="mt-3 flex items-center justify-between gap-2">
          {change === null ? (
            <ChangeIndicator value={change} />
          ) : (
            <span
              className={`text-xs font-semibold ${isGood ? "text-[#18794E]" : "text-[#B42318]"}`}
            >
              {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
            </span>
          )}
          <span className="text-xs text-[#7A857F]">vs last month</span>
        </div>
      )}
    </article>
  );
};

export function SummaryCards({
  balance,
  income,
  expenses,
  savings,
}: SummaryCardsProps) {
  return (
    <section
      aria-label="Financial summary"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <Card label="All-time balance" value={balance} />
      <Card label="Monthly income" value={income.current} comparison={income} />
      <Card
        label="Monthly expenses"
        value={expenses.current}
        comparison={expenses}
        positiveIsGood={false}
      />
      <Card
        label="Remaining balance"
        value={savings.current}
        comparison={savings}
      />
    </section>
  );
}
