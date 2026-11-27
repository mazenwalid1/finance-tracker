import { useMemo, useState } from "react";
import { useTransactions } from "./context/transactions-context";
import { TransactionTable } from "./components/TransactionTable";
import { AddTransactionModal } from "./components/AddTransactionModal";
import { SummaryCards } from "./features/analytics/components/SummaryCards";
import { IncomeExpenseChart } from "./features/analytics/components/IncomeExpenseChart";
import { SpendingTrendsChart } from "./features/analytics/components/SpendingTrendsChart";
import { CategoryBreakdown } from "./features/analytics/components/CategoryBreakdown";
import { FinancialInsights } from "./features/analytics/components/FinancialInsights";
import { RecentTransactions } from "./transactions/components/RecentTransactions";
import { formatMonth } from "./lib/format";
import {
  getCategorySpending,
  getComparison,
  getFinancialInsights,
  getLastSixMonths,
  getMonthKey,
  getTotalBalance,
  shiftMonth,
} from "./features/analytics/utils/financeCalculations";

export default function App() {
  const {
    transactions,
    storageError,
    canResetStorage,
    clearUnreadableStorage,
  } = useTransactions();
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() =>
    getMonthKey(new Date()),
  );

  const monthOptions = useMemo(() => {
    const currentMonth = getMonthKey(new Date());
    return Array.from({ length: 24 }, (_, index) =>
      shiftMonth(currentMonth, -index),
    );
  }, []);

  const balance = useMemo(() => getTotalBalance(transactions), [transactions]);
  const income = useMemo(
    () => getComparison(transactions, selectedMonth, "income"),
    [transactions, selectedMonth],
  );
  const expenses = useMemo(
    () => getComparison(transactions, selectedMonth, "expenses"),
    [transactions, selectedMonth],
  );
  const savings = useMemo(
    () => getComparison(transactions, selectedMonth, "savings"),
    [transactions, selectedMonth],
  );
  const monthlySeries = useMemo(
    () => getLastSixMonths(transactions, selectedMonth),
    [transactions, selectedMonth],
  );
  const categorySpending = useMemo(
    () => getCategorySpending(transactions, selectedMonth),
    [transactions, selectedMonth],
  );
  const insights = useMemo(
    () => getFinancialInsights(transactions, selectedMonth),
    [transactions, selectedMonth],
  );

  const scrollToTransactions = () => {
    document
      .getElementById("all-transactions")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-[#F5F6F3] px-4 py-6 text-[#14201B] sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#55615B]">
              Finance tracker
            </p>
            <h1 className="text-[26px] font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="month-select">
              Select month
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="min-h-11 rounded-xl border border-[#CBD1CB] bg-white px-3 text-sm font-medium text-[#55615B]"
            >
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {formatMonth(month)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="min-h-11 rounded-xl bg-[#0F6E8C] px-5 text-sm font-semibold text-white transition hover:bg-[#094D63]"
            >
              + Add transaction
            </button>
          </div>
        </header>

        {storageError && (
          <div
            role="alert"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D97745] bg-[#FFF7F2] px-4 py-3 text-sm text-[#7A3F20]"
          >
            <p>{storageError}</p>
            {canResetStorage && (
              <button
                type="button"
                onClick={clearUnreadableStorage}
                className="min-h-10 rounded-lg border border-[#D97745] px-3 font-semibold"
              >
                Replace unreadable saved data
              </button>
            )}
          </div>
        )}

        <div className="space-y-6">
          <SummaryCards
            balance={balance}
            income={income}
            expenses={expenses}
            savings={savings}
          />

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border border-[#E3E6E1] bg-white p-5">
              <div className="mb-2">
                <h2 className="text-base font-semibold">Income vs expenses</h2>
                <p className="mt-1 text-xs text-[#7A857F]">
                  Last six months ending {formatMonth(selectedMonth)}
                </p>
              </div>
              <div className="mt-3 flex gap-4 text-xs text-[#66736D]">
                <span>
                  <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#2F7F68]" />
                  Income
                </span>
                <span>
                  <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#D97745]" />
                  Expenses
                </span>
              </div>
              <IncomeExpenseChart data={monthlySeries} />
            </section>

            <section className="rounded-2xl border border-[#E3E6E1] bg-white p-5">
              <h2 className="text-base font-semibold">Monthly spending</h2>
              <p className="mt-1 text-xs text-[#7A857F]">
                Monthly expense pattern
              </p>
              <SpendingTrendsChart data={monthlySeries} />
            </section>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
            <section className="rounded-2xl border border-[#E3E6E1] bg-white p-5">
              <h2 className="text-base font-semibold">Expenses by category</h2>
              <p className="mt-1 text-xs text-[#7A857F]">
                {formatMonth(selectedMonth)}
              </p>
              <CategoryBreakdown data={categorySpending} />
            </section>
            <RecentTransactions onViewAll={scrollToTransactions} />
          </div>

          <FinancialInsights insights={insights} />

          <section
            id="all-transactions"
            aria-labelledby="all-transactions-heading"
            className="scroll-mt-6 rounded-2xl border border-[#E3E6E1] bg-white p-5"
          >
            <h2
              id="all-transactions-heading"
              className="mb-3 text-base font-semibold"
            >
              All transactions
            </h2>
            <TransactionTable />
          </section>
        </div>

        {open && <AddTransactionModal onClose={() => setOpen(false)} />}
      </div>
    </main>
  );
}
