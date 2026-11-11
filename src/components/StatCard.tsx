type Props = {
  label: string;
  value: string;
  tone?: "default" | "income" | "expense";
};

const tones = {
  default: "text-[#14201B]",
  income: "text-[#0F6E8C]",
  expense: "text-[#9A4A06]",
};

export function StatCard({ label, value, tone = "default" }: Props) {
  return (
    <div className="rounded-2xl border border-[#E3E6E1] bg-white p-5">
      <div className="text-sm text-[#55615B]">{label}</div>
      <div className={`mt-1.5 text-3xl font-bold ${tones[tone]}`}>{value}</div>
    </div>
  );
}
