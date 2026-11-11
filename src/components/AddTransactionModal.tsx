import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransactions } from "../context/TransactionsContext";

const schema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z
    .number({ error: "Enter an amount" })
    .positive("Must be greater than 0"),
  category: z.string().min(1, "Pick a category"),
  date: z.string().min(1, "Pick a date"),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const today = () => new Date().toISOString().slice(0, 10);

export function AddTransactionModal({ onClose }: { onClose: () => void }) {
  const { add } = useTransactions();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "expense", date: today(), category: "", note: "" },
  });

  const type = watch("type");

  const onSubmit = (values: FormValues) => {
    add(values);
    onClose();
  };

  const field = "min-h-11 rounded-xl border border-[#CBD1CB] px-3 text-[15px]";
  const label = "flex flex-col gap-1.5 text-[13px] text-[#55615B]";
  const error = "text-xs text-[#9A4A06]";

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-8"
      >
        <h2 className="text-[22px] font-bold">Add transaction</h2>

        <div className="flex gap-2">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setValue("type", t)}
              className={`min-h-11 flex-1 rounded-xl border text-sm font-medium capitalize ${
                type === t
                  ? "border-2 border-[#0F6E8C] bg-[#E6F1F4]"
                  : "border-[#CBD1CB]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <label className={label}>
          Amount
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            className={field}
            {...register("amount", { valueAsNumber: true })}
          />
          {errors.amount && (
            <span className={error}>{errors.amount.message}</span>
          )}
        </label>

        <label className={label}>
          Category
          <input
            placeholder="Food"
            className={field}
            {...register("category")}
          />
          {errors.category && (
            <span className={error}>{errors.category.message}</span>
          )}
        </label>

        <label className={label}>
          Date
          <input type="date" className={field} {...register("date")} />
          {errors.date && <span className={error}>{errors.date.message}</span>}
        </label>

        <label className={label}>
          Note (optional)
          <input className={field} {...register("note")} />
        </label>

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 flex-1 rounded-xl border border-[#CBD1CB] text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="min-h-12 flex-[2] rounded-xl bg-[#0F6E8C] text-sm font-semibold text-white"
          >
            Save transaction
          </button>
        </div>
      </form>
    </div>
  );
}
