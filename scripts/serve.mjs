// Servidor estático mínimo para ver dist/ no navegador: http://localhost:4321
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const tipos = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml" };
const porta = Number(process.env.PORT) || 4321;

createServer(async (req, res) => {
  const rota = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const arquivo = path.join(dist, rota.endsWith("/") ? rota + "index.html" : rota);
  if (!arquivo.startsWith(dist)) return res.writeHead(403).end();
  try {
    const corpo = await readFile(arquivo);
    res.writeHead(200, { "content-type": tipos[path.extname(arquivo)] ?? "application/octet-stream" }).end(corpo);
  } catch {
    res.writeHead(404).end("Não encontrado");
  }
}).listen(porta, () => console.log(`Apostila em http://localhost:${porta}`));
