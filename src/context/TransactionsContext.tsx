import { type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Transaction } from "../types";
import {
  TransactionsContext,
  type TransactionsContextValue,
} from "./transactions-context";

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "transactions",
    [],
  );

  const add: TransactionsContextValue["add"] = (t) =>
    setTransactions((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev]);

  const remove: TransactionsContextValue["remove"] = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  return (
    <TransactionsContext.Provider value={{ transactions, add, remove }}>
      {children}
    </TransactionsContext.Provider>
  );
}
