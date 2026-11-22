import type { FinancialInsight } from "../types/analytics.types";

const tones = {
  positive: "border-l-[#2F7F68] bg-[#F2F8F5]",
  negative: "border-l-[#D97745] bg-[#FFF7F2]",
  neutral: "border-l-[#5576A4] bg-[#F4F7FA]",
};

export function FinancialInsights({
  insights,
}: {
  insights: FinancialInsight[];
}) {
  return (
    <section
      aria-labelledby="insights-heading"
      className="rounded-2xl border border-[#E3E6E1] bg-white p-5"
    >
      <h2 id="insights-heading" className="text-base font-semibold">
        Financial insights
      </h2>
      {insights.length === 0 ? (
        <p className="mt-4 text-sm text-[#7A857F]">
          Add more income and expense activity to generate insights.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {insights.map((insight) => (
            <article
              key={insight.id}
              className={`border-l-4 rounded-xl px-4 py-3 ${tones[insight.tone]}`}
            >
              <h3 className="text-sm font-bold text-[#14201B]">
                {insight.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#66736D]">
                {insight.detail}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
