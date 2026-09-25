// Gera o PDF A4 de cada capítulo em dist/ a partir da versão web.
// Três passadas, unidas com pdf-lib:
//   1. abertura do capítulo (página inteira, sem margens)
//   2. moldura (cabeçalho, rodapé e formas da marca numa A4 transparente)
//   3. miolo (duas colunas, numerado a partir de 1)
// Cada página do miolo recebe a moldura por baixo, como um papel timbrado.
//
//   npm run pdf   ->  pdf/<capitulo>.pdf
//
// Em outra máquina, instale o navegador uma vez: npx playwright install chromium

import { readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(raiz, "dist");
const saida = path.join(raiz, "pdf");
await mkdir(saida, { recursive: true });

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
await pagina.addInitScript(() => { window.__PDF__ = true; });
await pagina.emulateMedia({ media: "print" });

async function imprimir(url, classe) {
  await pagina.goto(url, { waitUntil: "load" });
  await pagina.evaluate(async (c) => {
    document.documentElement.classList.add(c);
    await document.fonts.ready;
  }, classe);
  return pagina.pdf({ preferCSSPageSize: true, printBackground: true });
}

const capitulos = (await readdir(dist)).filter((f) => f.endsWith(".html") && f !== "index.html" && !f.startsWith("artifact"));
for (const arquivo of capitulos) {
  const url = pathToFileURL(path.join(dist, arquivo)).href;
  const abertura = await imprimir(url, "imprimir-abertura");
  const moldura = await imprimir(url, "imprimir-moldura");
  const miolo = await imprimir(url, "imprimir-conteudo");

  const final = await PDFDocument.create();
  const [paginaAbertura] = await final.copyPages(await PDFDocument.load(abertura), [0]);
  final.addPage(paginaAbertura);

  const [timbre] = await final.embedPdf(moldura, [0]);
  const docMiolo = await PDFDocument.load(miolo);
  const paginasMiolo = await final.embedPdf(miolo, docMiolo.getPageIndices());
  for (const conteudo of paginasMiolo) {
    const p = final.addPage([timbre.width, timbre.height]);
    p.drawPage(timbre);
    p.drawPage(conteudo);
  }
  final.setTitle(await pagina.title());
  final.setAuthor("Prof. Wagner Pinheiro");
  const destino = path.join(saida, arquivo.replace(/\.html$/, ".pdf"));
  await writeFile(destino, await final.save());
  console.log(`✓ ${path.relative(raiz, destino)} (${final.getPageCount()} páginas)`);
}

await navegador.close();
