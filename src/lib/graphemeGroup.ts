import type { DisplayToken } from "./types";

const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

/**
 * Emojis compostos (ex.: "☀️" = sol + seletor de variação, "👨‍💻" = pessoa +
 * ZWJ + laptop) são vários codepoints Unicode que o usuário enxerga como um
 * único caractere. O tokenizador frequentemente fatia cada codepoint em um
 * token à parte, então sem esse agrupamento o chip de exibição mostra pedaços
 * soltos (ex.: o laptop aparecendo sozinho) em vez do caractere completo que
 * foi digitado. Agrupamos os tokens por cluster de grafema (via
 * Intl.Segmenter) só para a exibição. A contagem real de tokens do modelo
 * não muda.
 */
export function groupTokensByGrapheme(tokens: DisplayToken[]): DisplayToken[] {
  const fullText = tokens.map((t) => t.text).join("");
  const clusterStarts = new Set<number>();
  for (const { index } of segmenter.segment(fullText)) {
    clusterStarts.add(index);
  }

  const grouped: DisplayToken[] = [];
  let buffer: DisplayToken[] = [];
  let offset = 0;

  function flush() {
    if (buffer.length === 0) return;
    grouped.push({
      text: buffer.map((t) => t.text).join(""),
      ids: buffer.flatMap((t) => t.ids),
      isFragmentGroup: buffer.length > 1 || buffer.some((t) => t.isFragmentGroup),
    });
    buffer = [];
  }

  for (const token of tokens) {
    if (clusterStarts.has(offset) && buffer.length > 0) {
      flush();
    }
    buffer.push(token);
    offset += token.text.length;
  }
  flush();

  return grouped;
}
