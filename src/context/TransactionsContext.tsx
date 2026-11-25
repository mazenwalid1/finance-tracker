import { type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Transaction } from "../types";
import {
  TransactionsContext,
  type TransactionsContextValue,
} from "./transactions-context";

const isTransactionList = (value: unknown): value is Transaction[] =>
  Array.isArray(value) &&
  value.every((item) => {
    if (typeof item !== "object" || item === null) return false;
    const transaction = item as Record<string, unknown>;

    return (
      typeof transaction.id === "string" &&
      (transaction.type === "income" || transaction.type === "expense") &&
      typeof transaction.amount === "number" &&
      Number.isFinite(transaction.amount) &&
      transaction.amount > 0 &&
      typeof transaction.category === "string" &&
      typeof transaction.date === "string" &&
      (transaction.note === undefined || typeof transaction.note === "string")
    );
  });

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const {
    value: transactions,
    setValue: setTransactions,
    storageError,
    canResetStorage,
    clearUnreadableStorage,
  } = useLocalStorage<Transaction[]>(
    "transactions",
    [],
    isTransactionList,
  );

  const add: TransactionsContextValue["add"] = (t) =>
    setTransactions((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev]);

  const remove: TransactionsContextValue["remove"] = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        add,
        remove,
        storageError,
        canResetStorage,
        clearUnreadableStorage,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
