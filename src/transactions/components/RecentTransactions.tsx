import { useTransactions } from "../../context/transactions-context";
import { formatDate, formatMoney } from "../../lib/format";

export function RecentTransactions({
  onViewAll,
}: {
  onViewAll: () => void;
}) {
  const { transactions } = useTransactions();
  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <section
      aria-labelledby="recent-transactions-heading"
      className="rounded-2xl border border-[#E3E6E1] bg-white p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="recent-transactions-heading" className="text-base font-semibold">
          Recent transactions
        </h2>
        {transactions.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-sm font-semibold text-[#0F6E8C] hover:text-[#094D63]"
          >
            View all
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D8DDD7] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[#55615B]">
            No transactions yet
          </p>
          <p className="mt-1 text-xs text-[#7A857F]">
            Add your first transaction to start your dashboard.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#EEF0EC]">
          {recent.map((transaction) => (
            <article
              key={transaction.id}
              className="flex items-center gap-3 py-3"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  transaction.type === "income"
                    ? "bg-[#EAF4EF] text-[#2F7F68]"
                    : "bg-[#FFF1E8] text-[#B85E32]"
                }`}
                aria-hidden="true"
              >
                {transaction.type === "income" ? "↗" : "↘"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#14201B]">
                  {transaction.note?.trim() || transaction.category || "Transaction"}
                </p>
                <p className="mt-0.5 text-xs text-[#7A857F]">
                  {transaction.category || "Uncategorized"} · {formatDate(transaction.date)}
                </p>
              </div>
              <p
                className={`shrink-0 text-sm font-bold ${
                  transaction.type === "income"
                    ? "text-[#2F7F68]"
                    : "text-[#B85E32]"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatMoney(transaction.amount)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
