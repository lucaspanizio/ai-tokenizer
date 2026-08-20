const EXAMPLES = [
  {
    label: "Português",
    text: "A inteligência artificial está transformando não só a tecnologia, mas também a sociedade.",
  },
  {
    label: "English",
    text: "Artificial intelligence is changing the way we live and work.",
  },
  {
    label: "日本語",
    text: "人工知能は社会を大きく変えています。",
  },
  {
    label: "Emoji + acentos",
    text: "Bom dia! ☀️ Vamos tomar um café ☕ e conversar sobre programação 👨‍💻",
  },
];

const MAX_CHARS = 340;

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div className="space-y-3">
      <textarea
        id="input-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        maxLength={MAX_CHARS}
        placeholder="Digite uma frase para tokenizar"
        className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 p-3 text-base text-slate-100 shadow-sm outline-none placeholder:text-slate-500 focus:border-slate-500"
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Exemplos:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => onChange(ex.text)}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
            >
              {ex.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 sm:shrink-0">
          {value.length}/{MAX_CHARS} caracteres
        </span>
      </div>
    </div>
  );
}
