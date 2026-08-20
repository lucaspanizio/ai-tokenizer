import { useTokenizer } from "./hooks/use-tokenizer";
import { PageHeader } from "./components/page-header";
import { TokenizerForm } from "./components/tokenizer-form";
import { ResultsSection } from "./components/results-section";
import { PageFooter } from "./components/page-footer";

export function App() {
  const tokenizer = useTokenizer();

  const { text, setText, selectedIds, toggleModel, canProcess, process } = tokenizer;
  const { hasResults, results, orderedSelectedIds, doneEntries } = tokenizer;

  return (
    <div className="min-h-screen mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader />

      <TokenizerForm
        text={text}
        onTextChange={setText}
        selectedIds={selectedIds}
        onToggleModel={toggleModel}
        canProcess={canProcess}
        onProcess={process}
      />

      {hasResults && (
        <ResultsSection
          results={results}
          doneEntries={doneEntries}
          orderedSelectedIds={orderedSelectedIds}
        />
      )}

      <PageFooter />
    </div>
  );
}
