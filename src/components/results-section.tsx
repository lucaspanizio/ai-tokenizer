import { getModel } from "../lib/models";
import type { TokenizerModel } from "../lib/types";
import type { ResultState } from "../hooks/use-tokenizer";
import { TokenCountChart } from "./token-count-chart";
import { ResultCard } from "./result-card";

interface ResultsSectionProps {
  orderedSelectedIds: string[];
  results: Record<string, ResultState>;
  doneEntries: { model: TokenizerModel; tokenCount: number }[];
}

export function ResultsSection({ orderedSelectedIds, results, doneEntries }: ResultsSectionProps) {
  return (
    <section className="mt-6 space-y-6">
      {doneEntries.length > 1 && <TokenCountChart entries={doneEntries} />}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {orderedSelectedIds.map((id) => {
          const state = results[id];
          if (!state) return null;
          return <ResultCard key={id} model={getModel(id)} state={state} />;
        })}
      </div>
    </section>
  );
}
