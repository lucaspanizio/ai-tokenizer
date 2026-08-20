# AI Tokenizer

Demonstração interativa de como diferentes modelos de IA tokenizam texto. Digite uma frase, escolha os modelos e veja, com cores, como cada um deles quebra seu input em tokens.

Tokenização é o primeiro passo de qualquer modelo de linguagem: antes de "entender" um texto, o modelo precisa fatiá-lo em pedaços (tokens) que ele conhece. Modelos diferentes usam vocabulários diferentes, então a mesma frase pode virar 16 tokens em um modelo e 31 em outro, o que impacta diretamente custo e limite de contexto. Esse projeto torna esse processo visível.

## ✨ Funcionalidades

- **Tokenização em tempo real** de qualquer texto digitado, com visualização colorida token a token.
- **Comparação lado a lado** entre múltiplos modelos, incluindo contagem de caracteres, tokens e a razão chars/token de cada um.
- **Gráfico comparativo** mostrando quantos tokens cada modelo "gasta" para representar a mesma frase: quanto maior a barra, mais cara a frase é para aquele modelo.
- **IDs reais dos tokens**, exibidos sob demanda para quem quiser ver o que o modelo recebe por baixo dos panos.
- Frases de exemplo prontas (português, inglês, japonês, emoji + acentos) para explorar rapidamente como cada tokenizador lida com idiomas e caracteres especiais.

## 🧠 Modelos suportados

| Modelo          | Vocabulário  | Observação                                                                             |
| ---------------- | ------------ | --------------------------------------------------------------------------------------- |
| **GPT-2**       | 50.257 tokens | Codificação mais antiga, treinada quase só em inglês; fragmenta bastante acentos e outros idiomas. |
| **GPT-4o**      | 200.019 tokens | Codificação mais recente da OpenAI, com vocabulário maior e melhor cobertura multilíngue. |
| **DeepSeek-R1** | 129.280 tokens | Tokenizador BPE do modelo de raciocínio da DeepSeek, com foco multilíngue.               |

## 🚀 Como usar

1. Digite uma frase no campo de texto (ou escolha um dos exemplos prontos).
2. Selecione um ou mais modelos que deseja comparar.
3. Clique em **Tokenizar**.

O resultado mostra, para cada modelo, os tokens coloridos, as estatísticas (caracteres, tokens, chars/token) e um gráfico comparando o custo em tokens entre os modelos escolhidos.

<img width="1920" height="912" alt="chrome_DA1P5zjsU9" src="https://github.com/user-attachments/assets/2f14f2ce-5925-4094-82bc-d1f0ca658610" />
<img width="1920" height="1080" alt="chrome_ke591bET74" src="https://github.com/user-attachments/assets/7ade242f-bb5e-4c72-83a0-e35407d768f9" />


## 🛠️ Rodando localmente

```bash
yarn install
yarn dev
```

Outros scripts disponíveis:

```bash
yarn build     # build de produção (type-check + vite build)
yarn preview   # serve o build de produção localmente
```

## 📦 Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [`gpt-tokenizer`](https://www.npmjs.com/package/gpt-tokenizer) para os modelos da família GPT
- [`@huggingface/transformers`](https://www.npmjs.com/package/@huggingface/transformers) para tokenizadores do Hugging Face (ex.: DeepSeek-R1)

## 👨🏻‍💻 Autor

Feito com 💗 por [Lucas Panizio](https://github.com/lucaspanizio).
