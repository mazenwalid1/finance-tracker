import { useTransactions } from "../context/TransactionsContext";
import { formatDate, formatMoney } from "../lib/format";

export function TransactionTable() {
  const { transactions, remove } = useTransactions();

  if (transactions.length === 0) {
    return (
      <p className="text-sm text-[#55615B]">
        No transactions yet. Add your first one.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="text-left text-[#55615B]">
            <th className="py-2 font-medium">Date</th>
            <th className="font-medium">Note</th>
            <th className="font-medium">Category</th>
            <th className="text-right font-medium">Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-t border-[#E3E6E1]">
              <td className="py-3">{formatDate(t.date)}</td>
              <td>{t.note || "-"}</td>
              <td>{t.category}</td>
              <td
                className={`text-right ${t.type === "income" ? "text-[#0F6E8C]" : "text-[#9A4A06]"}`}
              >
                {t.type === "income" ? "+" : "-"}
                {formatMoney(t.amount)}
              </td>
              <td className="text-right">
                <button
                  onClick={() => remove(t.id)}
                  aria-label={`Delete ${t.note || t.category}`}
                  className="px-2 text-[#55615B] hover:text-[#9A4A06]"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
