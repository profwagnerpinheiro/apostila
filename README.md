# Apostila de Física — Prof. Wagner Pinheiro

Material didático de Física escrito uma vez em HTML e publicado em dois formatos:

- **PDF A4** para impressão, com capa, duas colunas e a identidade visual da marca → [`pdf/`](pdf/)
- **Versão web** para ler no celular, com sumário, tema escuro e modo estudo (o aluno marca a alternativa e recebe a correção na hora)

O guia visual completo (cores, fontes, grade, componentes e como escrever cada um) está em **[DESIGN.md](DESIGN.md)**.

## Capítulos

| Nº | Capítulo | PDF |
|---|---|---|
| 01 | Conceitos Básicos de Física | [cap01-conceitos-basicos.pdf](pdf/cap01-conceitos-basicos.pdf) |

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
  layout.html       capa, moldura das páginas, sumário e rodapé
  styles/
    tokens.css      cores, fontes, escala — a fonte da verdade do design
    apostila.css    componentes e versão web
    print.css       A4, duas colunas, capa e moldura
  scripts/apostila.js   modo estudo (web)
  assets/figuras/   imagens dos capítulos
scripts/
  build.mjs         monta o HTML, renderiza as fórmulas (KaTeX), gera sumário e gabarito
  pdf.mjs           imprime capa, moldura e miolo com o Chromium e junta tudo num PDF
  serve.mjs         servidor local para a versão web
pdf/                PDFs gerados (versionados para download direto)
```

## Novo capítulo

1. Copie `src/capitulos/01-conceitos-basicos.html` para `src/capitulos/02-<assunto>.html`.
2. Ajuste o bloco `<!-- meta { … } -->` do topo: `numero`, `titulo`, `tituloCapa` (linhas do título da capa), `arquivo` e `topicos`.
3. Escreva o conteúdo com os componentes do [DESIGN.md](DESIGN.md). Fórmulas em LaTeX entre `$…$` ou `$$…$$`.
4. Rode `npm run pdf` e confira o resultado em `pdf/` e em `dist/`.
