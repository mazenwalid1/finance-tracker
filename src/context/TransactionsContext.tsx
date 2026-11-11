import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Transaction } from "../types";

type Ctx = {
  transactions: Transaction[];
  add: (t: Omit<Transaction, "id">) => void;
  remove: (id: string) => void;
};

const TransactionsContext = createContext<Ctx | null>(null);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "transactions",
    [],
  );

  const add: Ctx["add"] = (t) =>
    setTransactions((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev]);

  const remove: Ctx["remove"] = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  return (
    <TransactionsContext.Provider value={{ transactions, add, remove }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx)
    throw new Error("useTransactions must be used inside TransactionsProvider");
  return ctx;
}
