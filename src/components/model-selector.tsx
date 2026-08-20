import type { CSSProperties } from "react";
import { MODELS } from "../lib/models";

interface ModelSelectorProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function ModelSelector({ selectedIds, onToggle }: ModelSelectorProps) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-200">
        Modelos
      </legend>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {MODELS.map((model) => {
          const active = selectedIds.includes(model.id);
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onToggle(model.id)}
              aria-pressed={active}
              className={`group flex flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left transition ${active
                ? "border-slate-100 bg-slate-100/10"
                : "border-slate-700 hover:border-slate-500"
                }`}
            >
              <span className="flex w-full items-center gap-2">
                <span
                  className="model-swatch h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ "--swatch-color": model.color } as CSSProperties}
                />
                <span className="text-sm font-medium text-slate-100">
                  {model.shortLabel}
                </span>
                <span
                  className={`ml-auto text-xs ${active ? "opacity-100" : "opacity-0"}`}
                  aria-hidden
                >
                  ✓
                </span>
              </span>
              <span className="text-xs leading-snug text-slate-400">
                {model.description}
              </span>
              <span className="text-[11px] text-slate-500">
                vocabulário: {model.vocabSize.toLocaleString("pt-BR")} tokens
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
