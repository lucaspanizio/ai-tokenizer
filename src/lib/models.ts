import type { TokenizerModel } from './types';

export const MODELS: TokenizerModel[] = [
  {
    id: 'gpt2',
    label: 'GPT-2',
    shortLabel: 'GPT-2',
    description:
      'Codificação mais antiga, treinada quase só em texto em inglês. Costuma fragmentar bastante acentos e outros idiomas.',
    family: 'gpt',
    vocabSize: 50_257,
    color: '#199e70',
  },
  {
    id: 'gpt-4o',
    label: 'GPT-4o',
    shortLabel: 'GPT-4o',
    description:
      'Codificação mais recente da OpenAI, com vocabulário maior e melhor cobertura de idiomas além do inglês.',
    family: 'gpt',
    vocabSize: 200_019,
    color: '#3987e5',
  },
  {
    id: 'deepseek-r1',
    label: 'DeepSeek-R1',
    shortLabel: 'DeepSeek-R1',
    description:
      'Tokenizador BPE do modelo de raciocínio da DeepSeek, com vocabulário grande e foco multilíngue.',
    family: 'hf',
    vocabSize: 129_280,
    color: '#c98500',
  },
];

export function getModel(id: string): TokenizerModel {
  const model = MODELS.find((m) => m.id === id);
  if (!model) {
    throw new Error(`Modelo desconhecido: ${id}`);
  }
  return model;
}
