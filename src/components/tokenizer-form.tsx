import { ModelSelector } from "./model-selector";
import { TextInput } from "./text-input";

interface TokenizerFormProps {
  text: string;
  onTextChange: (value: string) => void;
  selectedIds: string[];
  onToggleModel: (id: string) => void;
  canProcess: boolean;
  onProcess: () => void;
}

export function TokenizerForm(props: TokenizerFormProps) {
  const { text, onTextChange, selectedIds, onToggleModel, canProcess, onProcess } = props;
  return (
    <section className="space-y-6 flex flex-col rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-6">
      <TextInput value={text} onChange={onTextChange} />

      <ModelSelector selectedIds={selectedIds} onToggle={onToggleModel} />

      <button
        type="button"
        onClick={onProcess}
        disabled={!canProcess}
        className="ml-auto rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition enabled:hover:bg-white enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Tokenizar
      </button>
    </section>
  );
}
