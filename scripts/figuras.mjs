// Figuras vetoriais da apostila, desenhadas em SVG no build.
//
// No capítulo, escreva {{fig:nome}} dentro de um <figure>; o build troca pelo SVG abaixo.
// As cores vêm de classes (.v1, .v2, .vr, .eixo) definidas em apostila.css, então as
// figuras acompanham o tema claro/escuro e saem nítidas no PDF.

const n = (v) => Math.round(v * 100) / 100;

// Seta de (x1,y1) a (x2,y2). A ponta é um triângulo calculado na direção da seta.
function seta(x1, y1, x2, y2, classe, { ponta = 8, largura = 4.4, tracejada = false } = {}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const L = Math.hypot(dx, dy);
  const ux = dx / L;
  const uy = dy / L;
  const bx = x2 - ux * ponta;
  const by = y2 - uy * ponta;
  const px = -uy * largura;
  const py = ux * largura;
  const traco = tracejada ? ' stroke-dasharray="5 4"' : "";
  return `<g class="${classe}"><line x1="${n(x1)}" y1="${n(y1)}" x2="${n(bx)}" y2="${n(by)}"${traco}/><polygon points="${n(x2)},${n(y2)} ${n(bx + px)},${n(by + py)} ${n(bx - px)},${n(by - py)}"/></g>`;
}

const linha = (x1, y1, x2, y2, classe = "guia") =>
  `<line class="${classe}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;

// Rótulo de vetor: letra em itálico, índice opcional e setinha por cima (ex.: V⃗₁).
function rotulo(x, y, letra, indice = "", classe = "", prefixo = "") {
  const deslocamento = prefixo ? 9 : 0;
  const largura = indice ? 13 : 9;
  const ax = x + deslocamento;
  const ay = y - 13;
  return `<g class="rotulo ${classe}">
    <text x="${x}" y="${y}">${prefixo}${letra}${indice ? `<tspan class="indice" dy="3">${indice}</tspan>` : ""}</text>
    <path d="M${ax} ${ay}h${largura}m-3 -2.3l3 2.3l-3 2.3"/>
  </g>`;
}

const texto = (x, y, conteudo, classe = "legenda-fig", ancora = "start") =>
  `<text class="${classe}" x="${x}" y="${y}" text-anchor="${ancora}">${conteudo}</text>`;

// Arco de ângulo com centro (cx,cy), entre os ângulos a1 e a2 (graus, sentido anti-horário).
function angulo(cx, cy, r, a1, a2, rotuloTexto = "θ") {
  const p = (a, raio) => [cx + raio * Math.cos((a * Math.PI) / 180), cy - raio * Math.sin((a * Math.PI) / 180)];
  const [x1, y1] = p(a1, r);
  const [x2, y2] = p(a2, r);
  const [tx, ty] = p((a1 + a2) / 2, r + 9);
  return `<path class="arco" d="M${n(x1)} ${n(y1)}A${r} ${r} 0 0 0 ${n(x2)} ${n(y2)}"/>
    <text class="angulo" x="${n(tx)}" y="${n(ty + 4)}" text-anchor="middle">${rotuloTexto}</text>`;
}

const svg = (w, h, rotuloAria, corpo) =>
  `<svg class="fig-vet" viewBox="0 0 ${w} ${h}" role="img" aria-label="${rotuloAria}">${corpo}</svg>`;

// ---------------------------------------------------------------- figuras do capítulo 2 (Vetores)

export const figuras = {
  vetor: () =>
    svg(260, 135, "Vetor: seta com origem, extremidade e reta suporte", [
      linha(11, 118, 245, 15.5, "guia tracejada"),
      seta(40, 105, 200, 35, "v1", { ponta: 11, largura: 5.5 }),
      `<circle class="ponto" cx="40" cy="105" r="3.2"/>`,
      rotulo(104, 60, "V"),
      texto(40, 128, "origem", "legenda-fig", "middle"),
      texto(206, 52, "extremidade"),
      texto(248, 38, "reta suporte (direção)", "legenda-fig legenda-fig--suave", "end"),
    ].join("")),

  mesmoSentido: () =>
    svg(260, 92, "Dois vetores de mesma direção e sentido e sua resultante", [
      seta(15, 28, 125, 28, "v1"),
      seta(125, 28, 235, 28, "v2"),
      seta(15, 66, 235, 66, "vr"),
      rotulo(62, 18, "F", "1", "v1"),
      rotulo(172, 18, "F", "2", "v2"),
      rotulo(117, 88, "F", "R", "vr"),
    ].join("")),

  sentidosOpostos: () =>
    svg(260, 92, "Dois vetores de mesma direção e sentidos opostos e sua resultante", [
      seta(15, 28, 160, 28, "v1"),
      seta(235, 28, 163, 28, "v2"),
      seta(15, 66, 90, 66, "vr"),
      rotulo(78, 18, "F", "1", "v1"),
      rotulo(192, 18, "F", "2", "v2"),
      rotulo(44, 88, "F", "R", "vr"),
    ].join("")),

  pitagoras: () =>
    svg(225, 148, "Vetores perpendiculares: a resultante é a hipotenusa do triângulo retângulo", [
      seta(20, 125, 180, 125, "v1"),
      seta(180, 125, 180, 28, "v2"),
      seta(20, 125, 180, 28, "vr"),
      `<path class="guia" d="M170 125V115H180"/>`,
      angulo(20, 125, 30, 0, 31.2),
      rotulo(92, 143, "V", "1", "v1"),
      rotulo(188, 80, "V", "2", "v2"),
      rotulo(78, 66, "V", "R", "vr"),
    ].join("")),

  poligono: () =>
    svg(240, 132, "Regra do polígono: um vetor começa onde o outro termina", [
      seta(20, 110, 110, 40, "v1"),
      seta(110, 40, 220, 90, "v2"),
      seta(20, 110, 220, 90, "vr"),
      rotulo(44, 66, "V", "1", "v1"),
      rotulo(170, 52, "V", "2", "v2"),
      rotulo(112, 124, "V", "R", "vr"),
    ].join("")),

  paralelogramo: () =>
    svg(250, 148, "Regra do paralelogramo: a resultante é a diagonal", [
      linha(170, 125, 230, 35, "guia tracejada"),
      linha(80, 35, 230, 35, "guia tracejada"),
      seta(20, 125, 170, 125, "v1"),
      seta(20, 125, 80, 35, "v2"),
      seta(20, 125, 230, 35, "vr"),
      angulo(20, 125, 26, 0, 56.3),
      rotulo(90, 143, "V", "1", "v1"),
      rotulo(22, 70, "V", "2", "v2"),
      rotulo(132, 70, "V", "R", "vr"),
    ].join("")),

  diferenca: () =>
    svg(240, 148, "Diferença entre vetores: o vetor diferença liga a extremidade de V1 à de V2", [
      seta(20, 125, 200, 125, "v1"),
      seta(20, 125, 150, 30, "v2"),
      seta(200, 125, 150, 30, "vr"),
      rotulo(100, 143, "V", "1", "v1"),
      rotulo(62, 66, "V", "2", "v2"),
      rotulo(184, 72, "V", "D", "vr"),
    ].join("")),

  produto: () =>
    svg(210, 120, "Produto de um número por um vetor", [
      seta(20, 25, 90, 25, "v1"),
      seta(20, 65, 160, 65, "v2"),
      seta(90, 105, 20, 105, "vr"),
      rotulo(102, 30, "V", "", "v1"),
      rotulo(172, 70, "B", "", "v2"),
      rotulo(102, 110, "V", "", "vr", "−"),
      texto(172, 88, "B = 2 · V", "legenda-fig legenda-fig--suave"),
    ].join("")),

  decomposicao: () =>
    svg(225, 172, "Decomposição de um vetor nos eixos x e y", [
      seta(15, 140, 212, 140, "eixo", { ponta: 7, largura: 3.5 }),
      seta(30, 162, 30, 8, "eixo", { ponta: 7, largura: 3.5 }),
      texto(206, 156, "x", "eixo-rotulo"),
      texto(38, 14, "y", "eixo-rotulo"),
      linha(170, 45, 170, 140, "guia tracejada"),
      linha(170, 45, 30, 45, "guia tracejada"),
      seta(30, 140, 170, 140, "v2"),
      seta(30, 140, 30, 45, "v2"),
      seta(30, 140, 170, 45, "v1"),
      angulo(30, 140, 32, 0, 34.2),
      rotulo(90, 84, "V", "", "v1"),
      rotulo(92, 160, "V", "x", "v2"),
      rotulo(4, 96, "V", "y", "v2"),
    ].join("")),
};

export function substituirFiguras(html, origem) {
  return html.replace(/\{\{fig:(\w+)\}\}/g, (_, nome) => {
    if (!figuras[nome]) throw new Error(`${origem}: figura desconhecida {{fig:${nome}}}`);
    return figuras[nome]();
  });
}

// ---------------------------------------------------------------- ilustrações das aberturas

// Capítulo 1: escala de potências de 10, do próton ao Universo observável.
function escala() {
  const x = (e) => 6 + ((e + 15) * 168) / 42;
  const eixoY = 27;
  const partes = [`<line class="esc-eixo" x1="4" y1="${eixoY}" x2="176" y2="${eixoY}"/>`];
  for (let e = -15; e <= 27; e++) {
    const grande = e % 3 === 0;
    partes.push(`<line class="esc-traco" x1="${n(x(e))}" y1="${eixoY - (grande ? 1.8 : 1)}" x2="${n(x(e))}" y2="${eixoY + (grande ? 1.8 : 1)}"/>`);
    if (grande) partes.push(`<text class="esc-pot" x="${n(x(e))}" y="${eixoY + 6}" text-anchor="middle">10<tspan dy="-1.4" class="esc-exp">${e}</tspan></text>`);
  }
  const marcas = [
    [-15, "próton"], [-10, "átomo"], [-7, "vírus"], [-5, "célula"], [-3, "formiga"], [0, "pessoa"],
    [4, "Everest"], [7, "Terra"], [11, "Terra–Sol"], [21, "Via Láctea"], [27, "Universo"],
  ];
  marcas.forEach(([e, nome], i) => {
    const acima = i % 2 === 0;
    const xm = n(x(e));
    partes.push(`<line class="esc-guia" x1="${xm}" y1="${acima ? 14 : eixoY + 8}" x2="${xm}" y2="${acima ? eixoY - 2.5 : eixoY + 12}"/>`);
    partes.push(`<circle class="esc-ponto" cx="${xm}" cy="${eixoY}" r="1.3"/>`);
    partes.push(`<text class="esc-nome" x="${xm}" y="${acima ? 11.5 : eixoY + 16.5}" text-anchor="middle">${nome}</text>`);
  });
  return `<svg class="ilustracao" viewBox="0 0 180 48" role="img" aria-label="Escala de potências de 10 do próton ao Universo">${partes.join("")}</svg>`;
}

// Capítulo 2: barco atravessando um rio — a velocidade resultante é a soma vetorial.
function barco() {
  const ondas = [];
  for (const [ox, oy] of [[18, 22], [118, 18], [150, 32], [128, 39], [30, 38], [160, 14], [8, 12]]) {
    ondas.push(`<path class="esc-guia" d="M${ox} ${oy}q2.5 -2 5 0t5 0"/>`);
  }
  const s = (x1, y1, x2, y2, c) => seta(x1, y1, x2, y2, c, { ponta: 4, largura: 2 });
  return `<svg class="ilustracao" viewBox="0 0 180 48" role="img" aria-label="Barco atravessando um rio: velocidade do barco, da correnteza e resultante">
    <line class="esc-eixo" x1="4" y1="6" x2="176" y2="6"/><line class="esc-eixo" x1="4" y1="44" x2="176" y2="44"/>
    ${ondas.join("")}
    <line class="esc-guia" x1="100" y1="41" x2="100" y2="11" stroke-dasharray="1.5 1.5"/>
    <line class="esc-guia" x1="46" y1="11" x2="100" y2="11" stroke-dasharray="1.5 1.5"/>
    ${s(46, 41, 46, 11, "ab-barco")}
    ${s(46, 41, 100, 41, "ab-correnteza")}
    ${s(46, 41, 100, 11, "ab-resultante")}
    <text class="esc-nome" x="42" y="27" text-anchor="end">barco</text>
    <text class="esc-nome" x="73" y="47.5" text-anchor="middle">correnteza</text>
    <text class="esc-nome" x="60" y="18" text-anchor="start">resultante</text>
    <text class="esc-nome" x="176" y="3.8" text-anchor="end">margem</text>
  </svg>`;
}

export const ilustracoes = { escala, barco };
