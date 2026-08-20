import { preloadGptCodec, tokenizeGpt } from "./gptTokenizers";
import { preloadHfTokenizer, tokenizeHf } from "./hfTokenizers";
import { getModel } from "./models";
import type { TokenizeResult } from "./types";

export async function tokenizeWithModel(modelId: string, text: string): Promise<TokenizeResult> {
  const model = getModel(modelId);
  if (text.length === 0) {
    return { modelId, tokens: [], tokenCount: 0, charCount: 0 };
  }
  if (model.family === "gpt") {
    return tokenizeGpt(modelId, text);
  }
  return tokenizeHf(modelId, text);
}

/** Dispara o carregamento do tokenizador (codec GPT ou modelo HF) em segundo plano. */
export function preloadTokenizer(modelId: string): void {
  const model = getModel(modelId);
  if (model.family === "gpt") {
    preloadGptCodec(modelId);
  } else {
    preloadHfTokenizer(modelId);
  }
}
