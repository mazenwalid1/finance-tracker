import type { Transaction } from "../../../types";
import type {
  CategorySpending,
  FinancialInsight,
  MonthComparison,
  MonthlySeriesPoint,
  MonthSummary,
} from "../types/analytics.types";

export const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const getSelectedMonthDate = (monthKey: string) => {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
};

export const shiftMonth = (monthKey: string, offset: number) => {
  const date = getSelectedMonthDate(monthKey);
  date.setMonth(date.getMonth() + offset);
  return getMonthKey(date);
};

export const getMonthSummary = (
  transactions: Transaction[],
  monthKey: string,
): MonthSummary => {
  const monthTransactions = transactions.filter((transaction) =>
    transaction.date.startsWith(monthKey),
  );
  const income = monthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return { income, expenses, savings: income - expenses };
};

export const getTotalBalance = (transactions: Transaction[]) =>
  transactions.reduce(
    (balance, transaction) =>
      balance +
      (transaction.type === "income" ? transaction.amount : -transaction.amount),
    0,
  );

export const getPercentChange = (current: number, previous: number): number | null => {
  if (previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
};

export const getComparison = (
  transactions: Transaction[],
  monthKey: string,
  kind: "income" | "expenses" | "savings",
): MonthComparison => {
  const currentSummary = getMonthSummary(transactions, monthKey);
  const previousSummary = getMonthSummary(
    transactions,
    shiftMonth(monthKey, -1),
  );
  const current = currentSummary[kind];
  const previous = previousSummary[kind];
  return { current, previous, percentChange: getPercentChange(current, previous) };
};

export const getLastSixMonths = (
  transactions: Transaction[],
  endMonthKey: string,
): MonthlySeriesPoint[] =>
  Array.from({ length: 6 }, (_, index) => {
    const month = shiftMonth(endMonthKey, index - 5);
    const summary = getMonthSummary(transactions, month);
    return { month, income: summary.income, expenses: summary.expenses };
  });

export const getCategorySpending = (
  transactions: Transaction[],
  monthKey?: string,
): CategorySpending[] => {
  const expenseTransactions = transactions.filter(
    (transaction) =>
      transaction.type === "expense" &&
      (!monthKey || transaction.date.startsWith(monthKey)),
  );
  const totals = new Map<string, number>();

  expenseTransactions.forEach((transaction) => {
    const category = transaction.category.trim() || "Uncategorized";
    totals.set(category, (totals.get(category) ?? 0) + transaction.amount);
  });

  const total = Array.from(totals.values()).reduce((sum, amount) => sum + amount, 0);
  if (total === 0) return [];

  return Array.from(totals.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / total) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const getFinancialInsights = (
  transactions: Transaction[],
  monthKey: string,
): FinancialInsight[] => {
  const insights: FinancialInsight[] = [];
  const current = getMonthSummary(transactions, monthKey);
  const previous = getMonthSummary(transactions, shiftMonth(monthKey, -1));

  if (previous.expenses > 0 && current.expenses > 0) {
    const change = getPercentChange(current.expenses, previous.expenses);
    if (change !== null) {
      const increased = change > 0;
      insights.push({
        id: "expense-change",
        title: `${Math.abs(change).toFixed(0)}% ${increased ? "increase" : "decrease"}`,
        detail: `Your expenses ${increased ? "increased" : "decreased"} compared with last month.`,
        tone: increased ? "negative" : "positive",
      });
    }
  }

  const categories = getCategorySpending(transactions, monthKey);
  if (categories.length > 0) {
    insights.push({
      id: "top-category",
      title: categories[0].category,
      detail: `Your highest spending category was ${categories[0].category}.`,
      tone: "neutral",
    });
  }

  if (current.income > 0) {
    const savingsRate = (current.savings / current.income) * 100;
    if (current.savings > 0) {
      insights.push({
        id: "savings-rate",
        title: `${savingsRate.toFixed(0)}% saved`,
        detail: "You kept this share of your income this month.",
        tone: "positive",
      });
    }
  }

  if (current.expenses > current.income) {
    insights.push({
      id: "overspending",
      title: "Expenses exceeded income",
      detail: "Your spending this month was higher than your income.",
      tone: "negative",
    });
  }

  return insights;
};
