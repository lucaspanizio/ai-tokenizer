export function PageFooter() {
  return (
    <footer className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-500">
      <p>
        Feito com ❤️ por{" "}
        <a
          href="https://linkedin.com/in/lucaspanizio"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-100 underline decoration-slate-600 underline-offset-2 transition hover:text-slate-300"
        >
          Lucas Panizio
        </a>
        . Código-fonte no{" "}
        <a
          href="https://github.com/lucaspanizio/ai-tokenizer"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-100 underline decoration-slate-600 underline-offset-2 transition hover:text-slate-300"
        >
          GitHub
        </a>
        .
      </p>
    </footer>
  );
}
