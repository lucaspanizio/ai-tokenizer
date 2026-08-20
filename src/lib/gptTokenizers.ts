import type { DisplayToken, TokenizeResult } from "./types";

interface GptCodec {
  encode: (text: string) => number[];
  decodeGenerator: (tokens: Iterable<number>) => Generator<string, void, void>;
}

// Cada codificação embute sua própria tabela de merges BPE (centenas de KB a
// alguns MB), então só é baixada quando o modelo correspondente é usado.
const CODEC_LOADERS: Record<string, () => Promise<GptCodec>> = {
  "gpt-4o": () => import("gpt-tokenizer/model/gpt-4o"),
  gpt2: () => import("gpt-tokenizer/model/gpt2"),
};

const codecCache = new Map<string, Promise<GptCodec>>();

function loadCodec(modelId: string): Promise<GptCodec> {
  const loader = CODEC_LOADERS[modelId];
  if (!loader) {
    throw new Error(`Modelo GPT desconhecido: ${modelId}`);
  }
  let promise = codecCache.get(modelId);
  if (!promise) {
    promise = loader();
    codecCache.set(modelId, promise);
  }
  return promise;
}

/** Dispara o download/carregamento da codificação em segundo plano. */
export function preloadGptCodec(modelId: string): void {
  if (modelId in CODEC_LOADERS) {
    void loadCodec(modelId);
  }
}

/**
 * O decodeGenerator do gpt-tokenizer só emite um chunk de texto quando os bytes
 * acumulados formam caracteres UTF-8 completos. Isso significa que caracteres
 * acentuados/não-latinos frequentemente exigem 2+ tokens "crus" para formar um
 * único caractere visível. Alimentamos os tokens um a um contando quantos foram
 * consumidos até cada yield, para agrupar visualmente esses fragmentos.
 */
function decodeGrouped(codec: GptCodec, tokenIds: number[]): DisplayToken[] {
  let consumed = 0;
  const countingIterable: Iterable<number> = {
    [Symbol.iterator]() {
      let i = 0;
      return {
        next(): IteratorResult<number> {
          if (i >= tokenIds.length) {
            return { done: true, value: undefined };
          }
          const value = tokenIds[i];
          i += 1;
          consumed = i;
          return { done: false, value };
        },
      };
    },
  };

  const groups: DisplayToken[] = [];
  let prevConsumed = 0;
  const gen = codec.decodeGenerator(countingIterable);
  let result = gen.next();
  while (!result.done) {
    const ids = tokenIds.slice(prevConsumed, consumed);
    groups.push({
      text: result.value,
      ids,
      isFragmentGroup: ids.length > 1,
    });
    prevConsumed = consumed;
    result = gen.next();
  }
  return groups;
}

export async function tokenizeGpt(modelId: string, text: string): Promise<TokenizeResult> {
  const codec = await loadCodec(modelId);
  const ids = codec.encode(text);
  const tokens = decodeGrouped(codec, ids);
  return {
    modelId,
    tokens,
    tokenCount: ids.length,
    charCount: text.length,
  };
}
