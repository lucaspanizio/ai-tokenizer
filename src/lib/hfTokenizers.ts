import type { PreTrainedTokenizer } from "@huggingface/transformers";
import type { DisplayToken, TokenizeResult } from "./types";

const HF_REPO_BY_MODEL: Record<string, string> = {
  "deepseek-r1": "deepseek-ai/DeepSeek-R1",
};

let envConfigured = false;
const tokenizerCache = new Map<string, Promise<PreTrainedTokenizer>>();

// @huggingface/transformers é uma dependência pesada (ONNX runtime + wasm),
// então só é baixada quando o usuário de fato usa um modelo multilíngue.
async function loadTokenizer(modelId: string): Promise<PreTrainedTokenizer> {
  const repo = HF_REPO_BY_MODEL[modelId];
  if (!repo) {
    throw new Error(`Modelo HF desconhecido: ${modelId}`);
  }
  let promise = tokenizerCache.get(modelId);
  if (!promise) {
    promise = (async () => {
      const { AutoTokenizer, env } = await import("@huggingface/transformers");
      if (!envConfigured) {
        // Nada de modelos locais: sempre busca do Hugging Face Hub público
        // (CDN), sem necessidade de chave de API. Fica em cache no navegador
        // após o primeiro carregamento.
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        envConfigured = true;
      }
      return AutoTokenizer.from_pretrained(repo);
    })();
    tokenizerCache.set(modelId, promise);
  }
  return promise;
}

/** Dispara o download/carregamento do tokenizador em segundo plano. */
export function preloadHfTokenizer(modelId: string): void {
  if (modelId in HF_REPO_BY_MODEL) {
    void loadTokenizer(modelId);
  }
}

const REPLACEMENT_CHAR = "�";

/**
 * Tokenizadores byte-level BPE (estilo GPT-2) fatiam caracteres multi-byte
 * (emojis, acentos, CJK) em vários tokens "crus": cada um representa bytes
 * individuais, não o caractere final. Decodificamos ids acumulados até o
 * texto parar de conter o caractere de substituição (U+FFFD), que é o que o
 * decoder emite enquanto a sequência de bytes UTF-8 ainda está incompleta.
 */
function decodeGrouped(tokenizer: PreTrainedTokenizer, ids: number[]): DisplayToken[] {
  const groups: DisplayToken[] = [];
  let i = 0;
  while (i < ids.length) {
    let j = i + 1;
    let decoded = tokenizer.decode_single(ids.slice(i, j), { clean_up_tokenization_spaces: false });
    while (decoded.includes(REPLACEMENT_CHAR) && j < ids.length) {
      j += 1;
      decoded = tokenizer.decode_single(ids.slice(i, j), { clean_up_tokenization_spaces: false });
    }
    groups.push({
      text: decoded,
      ids: ids.slice(i, j),
      isFragmentGroup: j - i > 1,
    });
    i = j;
  }
  return groups;
}

export async function tokenizeHf(modelId: string, text: string): Promise<TokenizeResult> {
  const tokenizer = await loadTokenizer(modelId);
  const ids = tokenizer.encode(text, { add_special_tokens: false }) as number[];
  const tokens = decodeGrouped(tokenizer, ids);

  return {
    modelId,
    tokens,
    tokenCount: ids.length,
    charCount: text.length,
  };
}
