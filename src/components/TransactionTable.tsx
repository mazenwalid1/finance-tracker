import { useMemo, useState } from "react";
import { useTransactions } from "../context/transactions-context";
import { formatDate, formatMoney } from "../lib/format";

export function TransactionTable() {
  const { transactions, remove } = useTransactions();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [exportMessage, setExportMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);

  const categories = useMemo(
    () =>
      [...new Set(transactions.map((transaction) => transaction.category.trim()).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b)),
    [transactions],
  );
  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return [...transactions]
      .filter((transaction) => {
        const searchableText = [
          transaction.note ?? "",
          transaction.category,
          transaction.type,
          transaction.date,
          String(transaction.amount),
        ]
          .join(" ")
          .toLocaleLowerCase();

        return (
          (!query || searchableText.includes(query)) &&
          (!category || transaction.category.trim() === category) &&
          (!dateFrom || transaction.date >= dateFrom) &&
          (!dateTo || transaction.date <= dateTo)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [category, dateFrom, dateTo, search, transactions]);

  const exportExpenses = () => {
    setExportMessage(null);
    let url: string | undefined;

    try {
      const expenses = [...transactions]
        .filter((transaction) => transaction.type === "expense")
        .sort((a, b) => b.date.localeCompare(a.date));
      if (expenses.length === 0) {
        setExportMessage({
          text: "There are no expenses to export yet.",
          error: false,
        });
        return;
      }

      const escapeCsvCell = (value: string | number) => {
        let text = String(value);
        if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) {
          text = `'${text}`;
        }
        return `"${text.replaceAll('"', '""')}"`;
      };
      const rows = [
        ["Date", "Category", "Note", "Amount"],
        ...expenses.map((transaction) => [
          transaction.date,
          transaction.category,
          transaction.note ?? "",
          transaction.amount,
        ]),
      ];
      const csv = `\uFEFF${rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n")}`;
      url = URL.createObjectURL(
        new Blob([csv], { type: "text/csv;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "finance-tracker-expenses.csv";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setExportMessage({ text: "CSV download started.", error: false });
      window.setTimeout(() => {
        link.remove();
        if (url) URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      if (url) URL.revokeObjectURL(url);
      console.error("Failed to export expenses to CSV.", error);
      setExportMessage({
        text: "Could not download the expenses CSV. Please try again.",
        error: true,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs font-medium text-[#55615B]">
            Search transactions
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Note, category, amount..."
              className="min-h-10 rounded-lg border border-[#CBD1CB] bg-white px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-[#55615B]">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="min-h-10 rounded-lg border border-[#CBD1CB] bg-white px-3 text-sm font-normal"
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-[#55615B]">
            Date from
            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(event) => {
                if (!dateTo || event.target.value <= dateTo) {
                  setDateFrom(event.target.value);
                }
              }}
              className="min-h-10 rounded-lg border border-[#CBD1CB] bg-white px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-[#55615B]">
            Date to
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(event) => {
                if (!dateFrom || event.target.value >= dateFrom) {
                  setDateTo(event.target.value);
                }
              }}
              className="min-h-10 rounded-lg border border-[#CBD1CB] bg-white px-3 text-sm font-normal"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={exportExpenses}
          className="min-h-10 rounded-lg border border-[#CBD1CB] px-3 text-sm font-semibold text-[#0F6E8C] hover:bg-[#F5F6F3]"
        >
          Export expenses CSV
        </button>
      </div>
      {exportMessage && (
        <p
          role={exportMessage.error ? "alert" : "status"}
          className={`text-sm ${exportMessage.error ? "text-[#9A4A06]" : "text-[#55615B]"}`}
        >
          {exportMessage.text}
        </p>
      )}

      {filteredTransactions.length === 0 ? (
        <p className="py-4 text-sm text-[#55615B]">
          {transactions.length === 0
            ? "No transactions yet. Add your first one."
            : "No transactions match these filters."}
        </p>
      ) : (
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
              {filteredTransactions.map((t) => (
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
      )}
    </div>
  );
}
