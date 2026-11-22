import { useState } from "react";
import { useTransactions } from "./context/transactions-context";
import { getSummary } from "./lib/summary";
import { formatMoney } from "./lib/format";
import { StatCard } from "./components/StatCard";
import { TransactionTable } from "./components/TransactionTable";
import { AddTransactionModal } from "./components/AddTransactionModal";

export default function App() {
  const { transactions } = useTransactions();
  const [open, setOpen] = useState(false);
  const { income, expenses, balance } = getSummary(transactions);

  return (
    <main className="min-h-screen bg-[#F5F6F3] px-4 py-6 text-[#14201B] sm:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#55615B]">Finance tracker</p>
            <h1 className="text-[26px] font-bold">Dashboard</h1>
          </div>
        <button
          onClick={() => setOpen(true)}
          className="min-h-11 rounded-xl bg-[#0F6E8C] px-5 text-sm font-semibold text-white"
        >
          + Add transaction
        </button>
        </header>

        <section
          aria-label="Financial summary"
          className="mb-6 grid gap-4 sm:grid-cols-3"
        >
          <StatCard label="Balance" value={formatMoney(balance)} />
          <StatCard label="Income" value={formatMoney(income)} tone="income" />
          <StatCard
            label="Expenses"
            value={formatMoney(expenses)}
            tone="expense"
          />
        </section>

        <section
          aria-labelledby="recent-transactions-heading"
          className="rounded-2xl border border-[#E3E6E1] bg-white p-5"
        >
          <h2 id="recent-transactions-heading" className="mb-3 text-base font-semibold">
            Recent transactions
          </h2>
          <TransactionTable />
        </section>

        {open && <AddTransactionModal onClose={() => setOpen(false)} />}
      </div>
    </main>
  );
}
