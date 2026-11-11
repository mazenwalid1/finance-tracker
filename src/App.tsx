import { useState } from "react";
import { useTransactions } from "./context/TransactionsContext";
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
    <div className="min-h-screen bg-[#F5F6F3] p-8 text-[#14201B]">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-[26px] font-bold">Dashboard</h1>
        <button
          onClick={() => setOpen(true)}
          className="min-h-11 rounded-xl bg-[#0F6E8C] px-5 text-sm font-semibold text-white"
        >
          + Add transaction
        </button>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Balance" value={formatMoney(balance)} />
        <StatCard label="Income" value={formatMoney(income)} tone="income" />
        <StatCard
          label="Expenses"
          value={formatMoney(expenses)}
          tone="expense"
        />
      </section>

      <section className="rounded-2xl border border-[#E3E6E1] bg-white p-5">
        <h2 className="mb-3 text-base font-semibold">Recent transactions</h2>
        <TransactionTable />
      </section>

      {open && <AddTransactionModal onClose={() => setOpen(false)} />}
    </div>
  );
}
