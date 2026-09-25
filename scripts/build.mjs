// Gera a versão web (dist/) de cada capítulo em src/capitulos.
//
//   node scripts/build.mjs             -> dist/<capitulo>.html + dist/index.html
//   node scripts/build.mjs --artifact  -> também dist/artifact*.html (sem <html>/<head>, para publicar como Artifact)
//
// O capítulo é escrito em HTML com fórmulas LaTeX entre $…$ (inline) e $$…$$ (destaque).
// O build cuida da parte "de livro": numera seções, tabelas e figuras, monta o sumário
// e o gabarito, desenha as figuras vetoriais e converte as fórmulas com KaTeX.

import { readFile, writeFile, mkdir, readdir, cp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import katex from "katex";
import { substituirFiguras, ilustracoes } from "./figuras.mjs";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(raiz, "src");
const dist = path.join(raiz, "dist");
const nm = path.join(raiz, "node_modules");
const gerarArtifact = process.argv.includes("--artifact");

// ---------------------------------------------------------------- matemática

const decodificar = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

function renderizar(tex, displayMode, origem) {
  try {
    return katex.renderToString(decodificar(tex.trim()), {
      displayMode,
      throwOnError: true,
      strict: "ignore",
      // \htmlClass é usado para colorir partes de fórmulas via CSS (ex.: sinais do expoente).
      trust: (ctx) => ctx.command === "\\htmlClass",
    });
  } catch (erro) {
    throw new Error(`Fórmula inválida em ${origem}:\n  ${tex.trim()}\n  ${erro.message}`);
  }
}

function renderizarMatematica(html, origem) {
  return html
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => renderizar(tex, true, origem))
    .replace(/\$([^$\n]+?)\$/g, (_, tex) => renderizar(tex, false, origem));
}

// ---------------------------------------------------------------- marca e rodapé

const atomo = `<svg class="atomo" viewBox="0 0 64 64" role="img" aria-label="Logo: átomo">
  <g class="atomo-orbitas" fill="none" stroke-width="3.2">
    <ellipse cx="32" cy="32" rx="28" ry="10.5"/>
    <ellipse cx="32" cy="32" rx="28" ry="10.5" transform="rotate(60 32 32)"/>
    <ellipse cx="32" cy="32" rx="28" ry="10.5" transform="rotate(-60 32 32)"/>
  </g>
  <circle class="atomo-nucleo" cx="32" cy="32" r="6.5"/>
  <circle class="atomo-eletron" cx="4.6" cy="30.5" r="3.2"/>
  <circle class="atomo-eletron" cx="45.5" cy="56.4" r="3.2"/>
  <circle class="atomo-eletron" cx="46" cy="7.8" r="3.2"/>
</svg>`;

const icones = {
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8.2c.3-.4.8-.4 1 0l.8 1.7c.1.3 0 .6-.2.8l-.5.5a6 6 0 0 0 2.7 2.7l.5-.5c.2-.2.5-.3.8-.2l1.7.8c.4.2.4.7 0 1-.8.8-2 1-3 .5a9.2 9.2 0 0 1-4.3-4.3c-.5-1-.3-2.2.5-3z" fill="currentColor"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9v6l5.2-3z" fill="currentColor"/></svg>`,
};

const contatos = [
  ["instagram", "@prof.wagnerpinheiro"],
  ["whatsapp", "(81) 99546-3198"],
  ["youtube", "Física Club"],
]
  .map(([icone, texto]) => `<li class="contato contato--${icone}">${icones[icone]}<span>${texto}</span></li>`)
  .join("");

// ---------------------------------------------------------------- estrutura de livro

function lerMeta(html, arquivo) {
  const m = html.match(/<!--\s*meta\s*([\s\S]*?)-->/);
  if (!m) throw new Error(`${arquivo}: faltou o bloco <!-- meta {...} --> no topo.`);
  return { meta: JSON.parse(m[1]), corpo: html.slice(m.index + m[0].length) };
}

const semTags = (s) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

// Divide o corpo em <section class="secao ..."> para tratar teoria e exercícios de forma diferente.
function secoes(corpo) {
  return [...corpo.matchAll(/<section class="secao([^"]*)" id="([^"]+)">[\s\S]*?<\/section>/g)].map((m) => ({
    html: m[0],
    exercicios: /\bexercicios\b/.test(m[1]),
    id: m[2],
  }));
}

// Seções de teoria recebem número (1, 2, 3…); tabelas e figuras da teoria, "Tabela 2.1", "Figura 2.3".
function numerar(corpo, cap) {
  let secao = 0;
  let tabela = 0;
  let figura = 0;
  for (const s of secoes(corpo)) {
    let html = s.html;
    if (!s.exercicios) {
      secao += 1;
      html = html.replace(/<h2>/, `<h2><span class="secao-num">${secao}</span> `);
    }
    html = html.replace(/<caption>/g, () => `<caption><span class="legenda-num">Tabela ${cap}.${++tabela}</span> `);
    if (!s.exercicios) {
      html = html.replace(/(<figure class="(?:figura|esquema)[^"]*">[\s\S]*?)<figcaption>/g, (_, antes) => `${antes}<figcaption><span class="legenda-num">Figura ${cap}.${++figura}</span> `);
    }
    corpo = corpo.replace(s.html, () => html); // função: o HTML tem "$" das fórmulas
  }
  return corpo;
}

function gerarSumario(corpo) {
  return secoes(corpo)
    .map((s) => {
      const h2 = s.html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
      const num = h2[1].match(/<span class="secao-num">(\d+)<\/span>/);
      const titulo = semTags(h2[1].replace(/<span class="secao-num">\d+<\/span>/, ""));
      const marcador = num ? num[1] : "•";
      return `<li class="${s.exercicios ? "sumario-exercicios" : ""}"><a href="#${s.id}"><span class="sumario-num">${marcador}</span>${titulo}</a></li>`;
    })
    .join("");
}

function gerarGabarito(corpo) {
  const inicio = corpo.indexOf("exercicios--propostos");
  if (inicio < 0) return corpo;
  const lista = corpo.slice(inicio);
  const itens = [...lista.matchAll(/data-gabarito="([a-e]?)"[^>]*>[\s\S]*?<span class="questao-num">(\w+)<\/span>/g)]
    .map(([, letra, num]) => `<li><span class="gabarito-num">${num}.</span> <span class="gabarito-letra">${letra || "—"}</span></li>`)
    .join("");
  const bloco = `<details class="gabarito"><summary>Respostas</summary><ol>${itens}</ol></details>`;
  return corpo.replace(/<aside class="gabarito" data-gerar-gabarito><\/aside>/, bloco);
}

// Alternativas curtas (potências de 10, números) ficam lado a lado em colunas alinhadas;
// as médias, em linha corrida; as longas, uma por linha.
function marcarAlternativasCurtas(corpo) {
  return corpo.replace(/<ol class="alternativas">([\s\S]*?)<\/ol>/g, (bloco, itens) => {
    // comprimento aproximado do que aparece na página (sem comandos LaTeX, $, chaves etc.)
    const visivel = (t) => semTags(t).replace(/\\cdot/g, "·").replace(/\\[a-zA-Z]+/g, "").replace(/[${}^_\\]/g, "").replace(/\s+/g, " ").trim();
    const textos = [...itens.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => visivel(m[1]));
    const maior = Math.max(...textos.map((t) => t.length));
    const tipo = maior <= 10 ? "curtas" : maior <= 24 ? "medias" : "";
    return tipo ? bloco.replace('class="alternativas"', `class="alternativas alternativas--${tipo}"`) : bloco;
  });
}

function preencher(modelo, dados) {
  return modelo.replace(/\{\{(\w+)\}\}/g, (_, chave) => {
    if (!(chave in dados)) throw new Error(`Placeholder sem valor: {{${chave}}}`);
    return dados[chave];
  });
}

async function construirCapitulo(arquivo, layout) {
  const bruto = await readFile(path.join(src, "capitulos", arquivo), "utf8");
  const { meta, corpo: original } = lerMeta(bruto, arquivo);
  const ilustrar = ilustracoes[meta.ilustracao];
  if (!ilustrar) throw new Error(`${arquivo}: "ilustracao" deve ser uma de: ${Object.keys(ilustracoes).join(", ")}`);

  let corpo = numerar(original, meta.numero);
  const sumario = gerarSumario(corpo);
  corpo = gerarGabarito(corpo);
  corpo = marcarAlternativasCurtas(corpo);
  corpo = substituirFiguras(corpo, arquivo);
  corpo = renderizarMatematica(corpo, arquivo);

  const html = preencher(layout, {
    tituloPagina: `Capítulo ${meta.numero} · ${meta.titulo} — Física Prof. Wagner Pinheiro`,
    numero: meta.numero,
    titulo: meta.titulo,
    paraComecar: meta.paraComecar,
    objetivosHtml: meta.objetivos.map((t) => `<li>${t}</li>`).join(""),
    ilustracao: ilustrar(),
    legendaIlustracao: meta.legendaIlustracao,
    volume: meta.volume,
    ano: meta.ano,
    atomo,
    contatos,
    sumario,
    conteudo: corpo,
  });

  await writeFile(path.join(dist, `${meta.arquivo}.html`), html);
  console.log(`✓ dist/${meta.arquivo}.html`);
  return { ...meta, html };
}

// Página de entrada: sumário geral do volume.
function indice(capitulos) {
  const itens = capitulos
    .map(
      (c) => `<li class="indice-item">
        <span class="indice-num">${c.numero}</span>
        <a class="indice-titulo" href="${c.arquivo}.html">${c.titulo}</a>
        <span class="indice-topicos">${c.objetivos.map((o) => o.replace(/[;.]$/, "")).join(" · ")}</span>
      </li>`,
    )
    .join("");
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Apostila de Física — Prof. Wagner Pinheiro</title>
<link rel="stylesheet" href="styles/fontes.css">
<link rel="stylesheet" href="styles/tokens.css">
<link rel="stylesheet" href="styles/apostila.css">
</head>
<body class="pagina-indice">
<main class="indice">
  <div class="marca">${atomo}<p class="marca-nome">Wagner Pinheiro <span>Física</span></p></div>
  <h1 class="indice-cabecalho">Física · ${capitulos[0]?.volume ?? ""}</h1>
  <p class="sumario-rotulo">Sumário</p>
  <ol class="indice-lista">${itens}</ol>
</main>
</body>
</html>`;
}

// ---------------------------------------------------------------- fontes e arquivos estáticos

const fontes = [
  // [pacote, família, peso, estilo]
  ["source-serif-4", "Source Serif 4", 400, "normal"],
  ["source-serif-4", "Source Serif 4", 400, "italic"],
  ["source-serif-4", "Source Serif 4", 600, "normal"],
  ["source-serif-4", "Source Serif 4", 700, "normal"],
  ["source-sans-3", "Source Sans 3", 400, "normal"],
  ["source-sans-3", "Source Sans 3", 600, "normal"],
  ["source-sans-3", "Source Sans 3", 700, "normal"],
  ["source-sans-3", "Source Sans 3", 900, "normal"],
  ["nunito", "Nunito", 900, "normal"], // só na marca "Wagner Pinheiro"
];

async function copiarFontes() {
  await mkdir(path.join(dist, "fontes"), { recursive: true });
  const css = [];
  for (const [pacote, familia, peso, estilo] of fontes) {
    const nome = `${pacote}-latin-${peso}-${estilo}.woff2`;
    await cp(path.join(nm, "@fontsource", pacote, "files", nome), path.join(dist, "fontes", nome));
    css.push(`@font-face{font-family:"${familia}";font-style:${estilo};font-weight:${peso};font-display:swap;src:url("../fontes/${nome}") format("woff2");}`);
  }
  await writeFile(path.join(dist, "styles", "fontes.css"), css.join("\n") + "\n");
}

async function copiarKatex() {
  const destino = path.join(dist, "katex");
  await mkdir(path.join(destino, "fonts"), { recursive: true });
  await cp(path.join(nm, "katex/dist/katex.min.css"), path.join(destino, "katex.min.css"));
  for (const f of await readdir(path.join(nm, "katex/dist/fonts"))) {
    if (f.endsWith(".woff2")) await cp(path.join(nm, "katex/dist/fonts", f), path.join(destino, "fonts", f));
  }
}

// ---------------------------------------------------------------- execução

if (!existsSync(path.join(nm, "katex"))) throw new Error("Rode `npm install` antes do build.");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(src, "styles"), path.join(dist, "styles"), { recursive: true });
await cp(path.join(src, "scripts"), path.join(dist, "scripts"), { recursive: true });
await cp(path.join(src, "assets"), path.join(dist, "assets"), { recursive: true });
await copiarFontes();
await copiarKatex();

const layout = await readFile(path.join(src, "layout.html"), "utf8");
const arquivos = (await readdir(path.join(src, "capitulos"))).filter((f) => f.endsWith(".html")).sort();
const capitulos = [];
for (const arquivo of arquivos) capitulos.push(await construirCapitulo(arquivo, layout));

await writeFile(path.join(dist, "index.html"), indice(capitulos));
console.log("✓ dist/index.html");

if (gerarArtifact) {
  // O Artifact já envolve a página com <html>/<head>/<body>: mandamos só título, estilos e corpo.
  for (const cap of capitulos) {
    const head = cap.html
      .match(/<head>([\s\S]*?)<\/head>/)[1]
      .replace(/<meta[^>]*>\n?/g, "")
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${cap.titulo}</title>`);
    const body = cap.html.match(/<body>([\s\S]*?)<\/body>/)[1];
    const destino = `artifact-${cap.arquivo}.html`;
    await writeFile(path.join(dist, destino), head.trim() + "\n" + body.trim() + "\n");
    console.log(`✓ dist/${destino}`);
  }
}
