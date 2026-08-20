import { useCallback, useEffect, useMemo, useState } from 'react';

import { preloadTokenizer, tokenizeWithModel } from '../lib/tokenize';
import type { TokenizeResult } from '../lib/types';
import { getModel, MODELS } from '../lib/models';

export type ResultState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'done'; result: TokenizeResult };

const DEFAULT_SELECTION = ['gpt-4o', 'gpt2', 'deepseek-r1'];

export function useTokenizer() {
  const [text, setText] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_SELECTION);
  const [results, setResults] = useState<Record<string, ResultState>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    DEFAULT_SELECTION.forEach(preloadTokenizer);
  }, []);

  const updateText = useCallback((value: string) => {
    setText(value);
    if (value.trim().length === 0) {
      setResults({});
    }
  }, []);

  const toggleModel = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id];
      if (next.includes(id) && !prev.includes(id)) {
        preloadTokenizer(id);
      }
      return next;
    });
  }, []);

  const canProcess = !isProcessing && text.trim().length > 0 && selectedIds.length > 0;

  const process = useCallback(async () => {
    if (text.trim().length === 0 || selectedIds.length === 0) return;
    setIsProcessing(true);
    setResults(Object.fromEntries(selectedIds.map((id) => [id, { status: 'loading' as const }])));

    await Promise.all(
      selectedIds.map(async (id) => {
        try {
          const result = await tokenizeWithModel(id, text);
          setResults((prev) => ({ ...prev, [id]: { status: 'done', result } }));
        } catch (err) {
          setResults((prev) => ({
            ...prev,
            [id]: {
              status: 'error',
              message: err instanceof Error ? err.message : String(err),
            },
          }));
        }
      }),
    );

    setIsProcessing(false);
  }, [text, selectedIds]);

  const orderedSelectedIds = useMemo(
    () => MODELS.map((m) => m.id).filter((id) => selectedIds.includes(id)),
    [selectedIds],
  );

  const doneEntries = useMemo(
    () =>
      orderedSelectedIds
        .map((id) => ({ id, state: results[id] }))
        .filter(
          (e): e is { id: string; state: Extract<ResultState, { status: 'done' }> } =>
            e.state?.status === 'done',
        )
        .map(({ id, state }) => ({ model: getModel(id), tokenCount: state.result.tokenCount })),
    [orderedSelectedIds, results],
  );

  const hasResults = orderedSelectedIds.some((id) => results[id] !== undefined);

  return {
    text,
    setText: updateText,
    selectedIds,
    toggleModel,
    canProcess,
    process,
    orderedSelectedIds,
    doneEntries,
    hasResults,
    results,
  };
}
