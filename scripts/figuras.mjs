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


// ---------------------------------------------------------------- gráficos de cinemática (capítulos 3 e 4)

// Eixos cartesianos com origem em (ox, oy), largura w e altura h (para cima).
function eixos(ox, oy, w, h, rotuloX, rotuloY, { negativo = 0 } = {}) {
  return [
    seta(ox, oy + negativo, ox, oy - h, "eixo", { ponta: 7, largura: 3.5 }),
    seta(ox - 4, oy, ox + w, oy, "eixo", { ponta: 7, largura: 3.5 }),
    texto(ox + w - 2, oy + 16, rotuloX, "eixo-rotulo", "end"),
    texto(ox + 6, oy - h + 4, rotuloY, "eixo-rotulo"),
    texto(ox - 6, oy + 14, "0", "legenda-fig", "end"),
  ].join("");
}
const curva = (d, classe = "v1") => `<g class="${classe}"><path class="curva" d="${d}"/></g>`;
const area = (d) => `<path class="area" d="${d}"/>`;
const tracejado = (x1, y1, x2, y2) => linha(x1, y1, x2, y2, "guia tracejada");

const graficos = {
  mruSxtCrescente: () =>
    svg(230, 160, "Gráfico da posição em função do tempo no MRU progressivo", [
      eixos(30, 135, 190, 125, "t (s)", "S (m)"),
      tracejado(30, 45, 170, 45), tracejado(170, 45, 170, 135),
      curva("M30 105L170 45"),
      texto(24, 109, "S₀", "legenda-fig", "end"), texto(24, 49, "S", "legenda-fig", "end"),
      texto(170, 150, "t", "legenda-fig", "middle"), texto(120, 40, "v &gt; 0", "legenda-fig"),
    ].join("")),

  mruSxtDecrescente: () =>
    svg(230, 160, "Gráfico da posição em função do tempo no MRU retrógrado", [
      eixos(30, 135, 190, 125, "t (s)", "S (m)"),
      tracejado(30, 105, 170, 105), tracejado(170, 105, 170, 135),
      curva("M30 45L170 105", "v2"),
      texto(24, 49, "S₀", "legenda-fig", "end"), texto(24, 109, "S", "legenda-fig", "end"),
      texto(170, 150, "t", "legenda-fig", "middle"), texto(120, 60, "v &lt; 0", "legenda-fig"),
    ].join("")),

  mruTangente: () =>
    svg(240, 165, "A inclinação da reta no gráfico S × t dá a velocidade", [
      eixos(30, 140, 200, 130, "t (s)", "S (m)"),
      tracejado(30, 110, 170, 110), tracejado(170, 45, 170, 140), tracejado(30, 45, 170, 45),
      curva("M30 110L170 45"),
      angulo(52, 99.8, 22, 0, 24.9),
      `<path class="cota" d="M178 45h5v65h-5"/>`, texto(188, 81, "ΔS", "eixo-rotulo"),
      `<path class="cota" d="M52 118v5h118v-5"/>`, texto(111, 136, "Δt", "eixo-rotulo", "middle"),
      texto(24, 114, "S₀", "legenda-fig", "end"), texto(24, 49, "S", "legenda-fig", "end"),
    ].join("")),

  mruVxt: () =>
    svg(240, 165, "Gráfico da velocidade em função do tempo no MRU: a área é o deslocamento", [
      eixos(30, 125, 200, 115, "t (s)", "v (m/s)"),
      area("M30 60H170V125H30Z"),
      curva("M30 60H170"),
      tracejado(170, 60, 170, 125),
      texto(100, 98, "A = ΔS", "eixo-rotulo", "middle"),
      texto(24, 64, "v", "legenda-fig", "end"), texto(170, 140, "t", "legenda-fig", "middle"),
    ].join("")),

  mruVxtNegativo: () =>
    svg(240, 150, "Gráfico da velocidade em função do tempo no MRU retrógrado", [
      eixos(30, 55, 200, 45, "t (s)", "v (m/s)", { negativo: 85 }),
      curva("M30 115H170", "v2"),
      tracejado(170, 55, 170, 115),
      texto(24, 119, "−v", "legenda-fig", "end"), texto(120, 108, "v &lt; 0", "legenda-fig"),
    ].join("")),

  muvVxtCrescente: () =>
    svg(240, 165, "Gráfico v × t no MUV com aceleração positiva: a inclinação dá a aceleração", [
      eixos(30, 140, 200, 130, "t (s)", "v (m/s)"),
      tracejado(30, 40, 170, 40), tracejado(170, 40, 170, 140), tracejado(30, 100, 170, 100),
      curva("M30 100L170 40"),
      angulo(30, 100, 24, 0, 23.2),
      `<path class="cota" d="M178 40h5v60h-5"/>`, texto(188, 74, "Δv", "eixo-rotulo"),
      `<path class="cota" d="M30 108v5h140v-5"/>`, texto(100, 128, "Δt", "eixo-rotulo", "middle"),
      texto(24, 104, "v₀", "legenda-fig", "end"), texto(24, 44, "v", "legenda-fig", "end"),
      texto(96, 60, "a &gt; 0", "legenda-fig"),
    ].join("")),

  muvVxtDecrescente: () =>
    svg(230, 160, "Gráfico v × t no MUV com aceleração negativa", [
      eixos(30, 135, 190, 125, "t (s)", "v (m/s)"),
      tracejado(30, 105, 170, 105), tracejado(170, 105, 170, 135),
      curva("M30 40L170 105", "v2"),
      texto(24, 44, "v₀", "legenda-fig", "end"), texto(24, 109, "v", "legenda-fig", "end"),
      texto(110, 60, "a &lt; 0", "legenda-fig"),
    ].join("")),

  muvArea: () =>
    svg(230, 160, "No gráfico v × t, a área sob a reta é o deslocamento", [
      eixos(30, 135, 190, 125, "t (s)", "v (m/s)"),
      area("M30 100L170 40V135H30Z"),
      curva("M30 100L170 40"),
      texto(100, 118, "A = ΔS", "eixo-rotulo", "middle"),
    ].join("")),

  muvAxt: () =>
    svg(230, 150, "Gráfico da aceleração em função do tempo no MUV: a área é a variação da velocidade", [
      eixos(30, 125, 190, 115, "t (s)", "a (m/s²)"),
      area("M30 60H165V125H30Z"),
      curva("M30 60H190", "vr"),
      texto(24, 64, "a", "legenda-fig", "end"),
      texto(98, 98, "A = Δv", "eixo-rotulo", "middle"),
    ].join("")),

  muvParabolas: () =>
    svg(300, 150, "Gráfico S × t no MUV: parábola com concavidade para cima (a > 0) ou para baixo (a < 0)", [
      eixos(20, 120, 120, 110, "t", "S"),
      curva("M20 110Q70 125 130 25"),
      texto(80, 145, "a &gt; 0", "legenda-fig", "middle"),
      eixos(170, 120, 120, 110, "t", "S"),
      curva("M170 110Q220 5 280 60", "v2"),
      texto(230, 145, "a &lt; 0", "legenda-fig", "middle"),
    ].join("")),

  // Semáforos da questão do Enem 2020, redesenhados.
  semaforos: () =>
    svg(300, 70, "Avenida com quatro semáforos, O, A, B e C, separados por 500 m", [
      linha(10, 38, 290, 38, "guia"),
      ...["O", "A", "B", "C"].map((l, i) => {
        const x = 30 + i * 80;
        return seta(x, 60, x, 42, "v1", { ponta: 6, largura: 3 }) + texto(x, 30, l, "eixo-rotulo", "middle");
      }),
      ...[0, 1, 2].map((i) => `<path class="cota" d="M${34 + i * 80} 12v4h72v-4"/>` + texto(70 + i * 80, 9, "500 m", "legenda-fig", "middle")),
    ].join("")),
};
Object.assign(figuras, graficos);

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


// Carrinho simples para as aberturas de cinemática.
const carro = (x, y) =>
  `<g class="ab-carro"><path d="M${x - 7} ${y - 1.4}h14v-2.6l-3-2.4h-7l-3 2.4z"/><circle cx="${x - 4}" cy="${y - 0.6}" r="1.3"/><circle cx="${x + 4}" cy="${y - 0.6}" r="1.3"/></g>`;

// Posições do móvel a cada 1 s sobre uma estrada; distâncias iguais (MRU) ou crescentes (MUV).
function estrada(posicoes, rotulo, unidade = "m") {
  const x0 = 14;
  const escala = 150 / posicoes[posicoes.length - 1];
  const partes = [`<line class="esc-eixo" x1="6" y1="36" x2="176" y2="36"/>`];
  posicoes.forEach((s, t) => {
    const x = n(x0 + s * escala);
    partes.push(carro(x, 32));
    partes.push(`<line class="esc-traco" x1="${x}" y1="34.5" x2="${x}" y2="37.5"/>`);
    partes.push(`<text class="esc-pot" x="${x}" y="42" text-anchor="middle">${s} ${unidade}</text>`);
    partes.push(`<text class="esc-nome" x="${x}" y="22" text-anchor="middle">t = ${t} s</text>`);
  });
  partes.push(`<text class="esc-pot" x="176" y="47" text-anchor="end">${rotulo}</text>`);
  return `<svg class="ilustracao" viewBox="0 0 180 48" role="img" aria-label="Posições de um carro a cada segundo">${partes.join("")}</svg>`;
}
const uniforme = () => estrada([0, 20, 40, 60, 80], "velocidade constante: 20 m a cada segundo");
const acelerado = () => estrada([0, 5, 20, 45, 80], "aceleração constante: 5 m, 15 m, 25 m, 35 m a cada segundo");

// Capítulo 5: bola em queda livre fotografada a cada 1 s (g = 10 m/s²).
function queda() {
  const alturas = [0, 5, 20, 45];
  const partes = [`<line class="esc-eixo" x1="60" y1="3" x2="60" y2="46"/>`];
  alturas.forEach((h, t) => {
    const y = n(5 + h * 0.88);
    partes.push(`<circle class="ab-bola" cx="72" cy="${y}" r="1.8"/>`);
    partes.push(`<line class="esc-traco" x1="58.5" y1="${y}" x2="61.5" y2="${y}"/>`);
    partes.push(`<text class="esc-pot" x="56" y="${n(y + 0.9)}" text-anchor="end">${h} m</text>`);
    partes.push(`<text class="esc-nome" x="78" y="${n(y + 0.9)}">t = ${t} s · v = ${10 * t} m/s</text>`);
  });
  partes.push(seta(140, 8, 140, 30, "ab-correnteza", { ponta: 4, largura: 2 }));
  partes.push(`<text class="esc-nome" x="145" y="21">g = 10 m/s²</text>`);
  return `<svg class="ilustracao" viewBox="0 0 180 48" role="img" aria-label="Bola em queda livre fotografada a cada segundo">${partes.join("")}</svg>`;
}

export const ilustracoes = { escala, barco, uniforme, acelerado, queda };
