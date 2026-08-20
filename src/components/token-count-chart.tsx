import type { CSSProperties } from "react";
import type { TokenizerModel } from "../lib/types";

interface ChartEntry {
  model: TokenizerModel;
  tokenCount: number;
}

interface TokenCountChartProps {
  entries: ChartEntry[];
}

export function TokenCountChart({ entries }: TokenCountChartProps) {
  if (entries.length === 0) return null;
  const max = Math.max(...entries.map((e) => e.tokenCount), 1);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-100">
        Tokens necessários por modelo
      </h3>
      <p className="mt-0.5 text-xs text-slate-400">
        Mesma frase, contagens diferentes: quanto maior a barra, mais "cara" essa frase é para o modelo.
      </p>

      <div className="mt-4 space-y-2.5">
        {entries.map(({ model, tokenCount }) => {
          const widthPct = Math.max((tokenCount / max) * 100, tokenCount > 0 ? 2 : 0);
          return (
            <div key={model.id} className="flex items-center gap-3" title={`${model.label}: ${tokenCount} tokens`}>
              <span className="w-24 shrink-0 truncate text-xs font-medium text-slate-300">
                {model.shortLabel}
              </span>
              <div className="relative h-4 min-w-0 flex-1 rounded-sm bg-slate-800">
                <div
                  className="model-swatch h-full rounded-r-[4px]"
                  style={
                    {
                      width: `${widthPct}%`,
                      "--swatch-color": model.color,
                    } as CSSProperties
                  }
                />
              </div>
              <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-200">
                {tokenCount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
