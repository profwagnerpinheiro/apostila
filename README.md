# Apostila de Física — Prof. Wagner Pinheiro

Material didático de Física escrito uma vez em HTML e publicado em dois formatos:

- **PDF A4** para impressão, no formato de livro didático (abertura de capítulo, boxes na margem, exercícios resolvidos e propostos) → [`pdf/`](pdf/)
- **Versão web** para ler no celular, com sumário e modo estudo (o aluno marca a alternativa e recebe a correção na hora)

O guia visual completo (cores, fontes, grade, componentes e como escrever cada um) está em **[DESIGN.md](DESIGN.md)**.

## Capítulos

| Nº | Capítulo | PDF |
|---|---|---|
| 1 | Conceitos básicos de Física | [cap01-conceitos-basicos.pdf](pdf/cap01-conceitos-basicos.pdf) |
| 2 | Vetores | [cap02-vetores.pdf](pdf/cap02-vetores.pdf) |
| 3 | Cinemática e movimento uniforme | [cap03-movimento-uniforme.pdf](pdf/cap03-movimento-uniforme.pdf) |
| 4 | Movimento uniformemente variado | [cap04-muv.pdf](pdf/cap04-muv.pdf) |
| 5 | Movimento vertical | [cap05-movimento-vertical.pdf](pdf/cap05-movimento-vertical.pdf) |

## Como usar

Requer Node.js 20 ou mais recente.

```bash
npm install
npx playwright install chromium   # só na primeira vez, para gerar PDF

npm run build   # gera a versão web em dist/
npm run pdf     # gera a versão web e os PDFs em pdf/
npm run dev     # gera e abre em http://localhost:4321
```

## Estrutura

```
src/
  capitulos/        um arquivo HTML por capítulo (conteúdo + bloco meta)
  layout.html       abertura do capítulo, moldura das páginas, sumário e rodapé
  styles/
    tokens.css      cores, fontes, escala — a fonte da verdade do design
    apostila.css    componentes e versão web
    print.css       A4 de livro: coluna de texto + margem, abertura e moldura
  scripts/apostila.js   modo estudo (web)
  assets/figuras/   imagens dos capítulos
scripts/
  build.mjs         monta o HTML, numera seções/tabelas/figuras, renderiza as fórmulas (KaTeX), gera sumário e respostas
  figuras.mjs       figuras vetoriais (setas, ângulos) e ilustrações das aberturas
  pdf.mjs           imprime abertura, moldura e miolo com o Chromium e junta tudo num PDF
  serve.mjs         servidor local para a versão web
pdf/                PDFs gerados (versionados para download direto)
```

## Novo capítulo

1. Copie `src/capitulos/02-vetores.html` para `src/capitulos/03-<assunto>.html`.
2. Ajuste o bloco `<!-- meta { … } -->` do topo: `numero`, `titulo`, `arquivo`, `ilustracao`, `paraComecar` e `objetivos`.
3. Escreva o conteúdo com os componentes do [DESIGN.md](DESIGN.md). Fórmulas em LaTeX entre `$…$` ou `$$…$$`.
4. Rode `npm run pdf` e confira o resultado em `pdf/` e em `dist/`.
