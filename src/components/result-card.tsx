import type { CSSProperties } from "react";
import { usePopoverPlacement } from "../hooks/use-popover-placement";
import { groupTokensByGrapheme } from "../lib/graphemeGroup";
import type { DisplayToken, TokenizerModel } from "../lib/types";
import type { TokenizeResult } from "../lib/types";

const CHIP_STYLES = [
  "bg-blue-900/50 text-blue-100",
  "bg-emerald-900/50 text-emerald-100",
  "bg-amber-900/50 text-amber-100",
  "bg-purple-900/50 text-purple-100",
  "bg-pink-900/50 text-pink-100",
  "bg-cyan-900/50 text-cyan-100",
];

function formatChipText(text: string): string {
  if (text === "\n") return "↵";
  return text.replace(/^ +/, (m) => "·".repeat(m.length)).replace(/\n/g, "↵");
}

interface ResultCardProps {
  model: TokenizerModel;
  state: { status: "loading" } | { status: "error"; message: string } | { status: "done"; result: TokenizeResult };
}

export function ResultCard({ model, state }: ResultCardProps) {
  const displayTokens = state.status === "done" ? groupTokensByGrapheme(state.result.tokens) : [];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
      <header className="flex items-center gap-2">
        <span
          className="model-swatch h-3 w-3 shrink-0 rounded-full"
          style={{ "--swatch-color": model.color } as CSSProperties}
        />
        <h3 className="text-sm font-semibold text-slate-100">{model.label}</h3>
      </header>

      {state.status === "loading" && (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-700 border-t-slate-300" />
          {model.family === "hf" ? "Baixando tokenizador e processando…" : "Processando…"}
        </div>
      )}

      {state.status === "error" && (
        <p className="mt-4 text-sm text-red-400">
          Não foi possível carregar este tokenizador: {state.message}
        </p>
      )}

      {state.status === "done" && (
        <>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Stat label="caracteres" value={state.result.charCount.toLocaleString("pt-BR")} />
            <Stat label="tokens" value={state.result.tokenCount.toLocaleString("pt-BR")} />
            <Stat
              label="chars/token"
              value={
                state.result.tokenCount === 0
                  ? "–"
                  : (state.result.charCount / state.result.tokenCount).toFixed(2)
              }
            />
          </dl>

          <div className="mt-4 flex flex-wrap gap-1 rounded-lg border border-dashed border-slate-700 p-2 font-mono text-sm leading-relaxed">
            {state.result.tokens.length === 0 && (
              <span className="text-slate-500">(sem tokens)</span>
            )}
            {displayTokens.map((token, i) => (
              <span
                key={i}
                title={`ids: [${token.ids.join(", ")}]${token.isFragmentGroup ? " (fragmento de bytes, não é um caractere válido sozinho)" : ""}`}
                className={`rounded px-1.5 py-0.5 ${CHIP_STYLES[i % CHIP_STYLES.length]} ${token.isFragmentGroup ? "ring-1 ring-dashed ring-slate-500" : ""
                  }`}
              >
                {formatChipText(token.text) || " "}
                {token.ids.length > 1 && (
                  <sup className="ml-0.5 opacity-70">×{token.ids.length}</sup>
                )}
              </span>
            ))}
          </div>

          <TokenIdsDropdown tokens={displayTokens} />
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-800/60 py-1.5">
      <div className="text-base font-semibold text-slate-100">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

// Altura máxima do popover (max-h-40 + padding) usada pra decidir se cabe
// embaixo do botão antes de virar pra cima.
const IDS_PANEL_HEIGHT = 190;

function TokenIdsDropdown({ tokens }: { tokens: DisplayToken[] }) {
  const { isOpen, placement, triggerRef, containerRef, toggle } = usePopoverPlacement(IDS_PANEL_HEIGHT);

  if (tokens.length === 0) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        className="mt-2 text-xs font-medium text-slate-400 underline decoration-dotted underline-offset-2 hover:text-slate-100"
      >
        {isOpen ? "ocultar IDs dos tokens" : "ver IDs dos tokens"}
      </button>

      {isOpen && (
        <div
          className={`max-h-40 overflow-y-auto rounded-lg bg-slate-800 p-2 font-mono text-xs text-slate-300 shadow-sm sm:absolute sm:left-0 sm:z-20 sm:w-full sm:border sm:border-slate-700 sm:shadow-lg ${placement === "top"
            ? "mt-2 sm:top-auto sm:bottom-full sm:mt-0 sm:mb-1"
            : "mt-2 sm:top-full sm:mt-1"
            }`}
        >
          {tokens.map((token, i) => (
            <div key={i} className="flex justify-between gap-2 py-0.5">
              <span className="truncate">{JSON.stringify(token.text)}</span>
              <span className="shrink-0 text-slate-500">[{token.ids.join(", ")}]</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
