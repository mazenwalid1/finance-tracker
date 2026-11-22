import { createContext, useContext } from "react";
import type { Transaction } from "../types";

export type TransactionsContextValue = {
  transactions: Transaction[];
  add: (transaction: Omit<Transaction, "id">) => void;
  remove: (id: string) => void;
};

export const TransactionsContext =
  createContext<TransactionsContextValue | null>(null);

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions must be used inside TransactionsProvider");
  }
  return context;
}
