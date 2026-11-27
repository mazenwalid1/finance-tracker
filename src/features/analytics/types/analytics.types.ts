export type MonthSummary = {
  income: number;
  expenses: number;
  savings: number;
};

export type MonthComparison = {
  current: number;
  previous: number;
  percentChange: number | null;
};

export type MonthlySeriesPoint = {
  month: string;
  income: number;
  expenses: number;
};

export type CategorySpending = {
  category: string;
  amount: number;
  percentage: number;
};

export type FinancialInsight = {
  id: string;
  title: string;
  detail: string;
  tone: "positive" | "negative" | "neutral";
};
