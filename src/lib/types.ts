export type TokenizerFamily = "gpt" | "hf";

export interface TokenizerModel {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  family: TokenizerFamily;
  vocabSize: number;
  color: string;
}

export interface DisplayToken {
  /** Texto exibido para esse token (ou grupo de tokens de byte) */
  text: string;
  /** IDs reais do modelo que compõem esse texto exibido */
  ids: number[];
  /** true quando o texto não é um caractere completo sozinho (fragmento de byte) */
  isFragmentGroup?: boolean;
}

export interface TokenizeResult {
  modelId: string;
  tokens: DisplayToken[];
  /** Quantidade real de tokens que o modelo processaria (soma de ids) */
  tokenCount: number;
  charCount: number;
}
