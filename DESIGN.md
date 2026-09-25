# Design System — Apostila de Física · Prof. Wagner Pinheiro

Guia visual e de componentes da apostila. O mesmo HTML gera duas saídas:

| Saída | Para quem | Como é |
|---|---|---|
| **PDF A4** (`pdf/*.pdf`) | impressão, envio por WhatsApp | capa de página inteira, miolo em duas colunas, cabeçalho e rodapé da marca em toda página |
| **Versão web** (`dist/*.html`) | leitura no celular e no computador | uma coluna, sumário lateral, tema escuro automático e **modo estudo** (o aluno marca a alternativa e vê se acertou) |

---

## 1. Princípios

1. **A marca é laranja + azul-marinho.** As formas geométricas inclinadas da capa e das páginas vêm do material original; mantenha-as.
2. **Texto de estudo é para ler, não para enfeitar.** Corpo em serifa legível, parágrafos justificados só no impresso, largura de ~68 caracteres na tela.
3. **Cada elemento visual ensina algo.** A régua da capa está em escala real (10 cm), as setas da regra de três mostram se a proporção é direta ou inversa, os selos marcam onde o aluno pratica.
4. **Uma cor de destaque por vez.** Laranja marca numeração, marcadores e gabarito; azul marca títulos e estrutura. Verde e vermelho aparecem só no modo estudo (certo/errado).

---

## 2. Marca

- **Logo:** átomo (três órbitas azuis, núcleo e elétrons laranja) + "WAGNER PINHEIRO" (Nunito 900, maiúsculas, azul) + "Física" (Nunito 900, laranja). Está em SVG no `scripts/build.mjs` (`atomo`) — nítido em qualquer tamanho.
- **Formas:** faixa laranja inclinada no topo, triângulo azul na lateral. Na capa, os dois cantos opostos; no miolo, faixa no topo, triângulo à esquerda e filete laranja no pé.
- **Contatos no rodapé:** Instagram `@prof.wagnerpinheiro`, WhatsApp `(81) 99546-3198`, YouTube `Física Club`. Editar em `scripts/build.mjs` (`contatos`).

---

## 3. Tokens

Todos em `src/styles/tokens.css`. Componentes usam os **papéis** (`--titulo`, `--acento`…), nunca a cor crua — assim o tema escuro funciona sozinho.

### Cores

| Token | Valor | Uso |
|---|---|---|
| `--marinho` | `#03407C` | títulos, cabeçalho de tabela, logo |
| `--laranja` | `#F2721C` | marcadores, número da questão (fundo), formas da marca |
| `--laranja-escuro` | `#C4560B` | laranja **para texto** (contraste AA sobre branco) |
| `--ceu` | `#E8EFF8` | fundo de fórmula, resolução, zebra de tabela |
| `--ceu-forte` | `#C9D8EC` | bordas suaves, sombra do título da capa |
| `--pessego` | `#FDEADB` | fundo das letras do gabarito |
| `--tinta` | `#17202E` | texto corrido (quase preto puxado para o azul) |
| `--tinta-2` | `#4A5568` | legendas e metadados |
| `--regra` | `#D5DDE8` | fios e divisórias |
| `--certo` / `--errado` | `#1F7A4D` / `#B42318` | só no modo estudo |

O tema escuro redefine os papéis em `@media screen and (prefers-color-scheme: dark)` e em `:root[data-theme="dark"]`. **O PDF é sempre claro.**

### Tipografia

| Papel | Fonte | Onde |
|---|---|---|
| Display | **Lilita One** | título da capa, selos "Hora de praticar!" e "Lista de exercícios" |
| Títulos e rótulos | **Nunito** 600–900 | h2, h3, tabelas, numeração, alternativas, rodapé |
| Texto | **Source Serif 4** 400/600/700 | parágrafos e enunciados |
| Matemática | **KaTeX** (Computer Modern) | toda fórmula, renderizada no build |

As fontes vêm do npm (`@fontsource/*`) e são copiadas para `dist/fontes` — o PDF não depende de internet.

Escala: tela em `rem` (`--t-xs` 0,78 → `--t-xl` 2), impresso em `pt` (7,2 / 8,6 / **9,8** / 11 / 12,5 / 15). Corpo do impresso: 9,8 pt com entrelinha 1,45.

### Espaço e forma

- Espaços `--e-1` a `--e-7` (0,25 → 3 rem).
- Cantos **retos** em caixas de conteúdo; pílulas (`--raio-pilula`) só em rótulos pequenos (número da questão, letra do gabarito, tópicos da capa).
- `--sombra-selo`: sombra laranja deslocada, sem desfoque. Usada só nos selos, no cartão "grandeza vetorial" e nos cartões do índice.

---

## 4. Grade do impresso

- **Papel:** A4 (210 × 297 mm).
- **Margens:** 31 mm topo · 14 mm laterais · 23 mm pé. O cabeçalho (logo + faixa) e o rodapé (contatos + número) vivem nas margens.
- **Colunas:** 2, com 9 mm de intervalo e fio azul de 0,8 pt entre elas.
- **Numeração:** começa em 1 na primeira página do miolo (a capa não conta), canto inferior direito, Nunito 900 azul.
- **Quebras:** títulos nunca ficam sozinhos no fim da coluna; tabelas, fórmulas, alternativas, figuras e o gabarito não se partem.

---

## 5. Componentes

Todos os exemplos abaixo são o HTML que se escreve em `src/capitulos/*.html`. Fórmulas vão entre `$…$` (na linha) ou `$$…$$` (em destaque). Dentro de fórmulas, escreva `<` e `>` como `&lt;` e `&gt;`, e a vírgula decimal como `{,}` (ex.: `2{,}4`).

### Abertura do capítulo
Título que atravessa as duas colunas no topo do miolo (só no impresso; na tela a capa já cumpre esse papel).
```html
<header class="abertura">
  <p class="abertura-rotulo">Capítulo 02</p>
  <h1 class="abertura-titulo">Cinemática escalar</h1>
</header>
```

### Seção
Todo `h2` ganha o marcador quadrado laranja e entra no sumário automaticamente.
```html
<section class="secao" id="velocidade-media">
  <h2>Velocidade média</h2>
  <p>…</p>
  <h3>Subtítulo</h3>
</section>
```

### Rótulo
Pequeno título laranja em caixa-alta para listas curtas ("Exemplos", "Regras").
```html
<p class="rotulo">Exemplos</p>
```

### Tabela
Cabeçalho azul, linhas zebradas. `caption` opcional vira rótulo laranja. Use `class="simbolo"` na coluna de símbolos de unidade.
```html
<div class="tabela">
  <table>
    <caption>Grandezas fundamentais do SI</caption>
    <thead><tr><th scope="col">Grandeza</th><th scope="col">Unidade</th><th scope="col">Símbolo</th></tr></thead>
    <tbody><tr><th scope="row">Massa</th><td>quilograma</td><td class="simbolo">kg</td></tr></tbody>
  </table>
</div>
```
Variação `tabela--relacao` para tabelas de conversão ("Unidade · Relação com o SI").

### Classificação (árvore com dois ramos)
Compara duas categorias, com a lista do que cada uma exige. `li.nao` aparece riscado.
```html
<figure class="classificacao">
  <p class="classificacao-raiz">Grandeza física</p>
  <div class="classificacao-ramos">
    <div class="classe">
      <p class="classe-nome">Grandeza escalar</p>
      <p class="classe-def">…</p>
      <ul class="requisitos"><li>valor numérico</li><li>unidade</li><li class="nao">direção</li></ul>
      <p class="classe-exemplos">Ex.: massa $m$.</p>
    </div>
    <div class="classe classe--vetor">…</div>
  </div>
</figure>
```

### Proporção (regra de três)
Duas linhas, dois valores por linha, ligados por tracejado laranja. As setas mostram o tipo:
`proporcao--direta` (↓ ↓) ou `proporcao--inversa` (↓ ↑). Sem modificador, sem setas.
```html
<div class="proporcao proporcao--direta">
  <span>1 min</span><span>60 s</span>
  <span>2,4 min</span><span>$x$</span>
</div>
```

### Fórmula em destaque
A fórmula-chave do assunto, com legenda das variáveis.
```html
<div class="formula">
  $$X = N \cdot 10^{L}$$
  <dl class="formula-legenda">
    <div><dt>$N$</dt><dd>valor numérico, com $1 \le N &lt; 10$</dd></div>
  </dl>
</div>
```

### Listas de exemplos e regras
`ol.exemplos` numera com a) b) c); `ol.regras` com I, II, III.

### Vírgula que anda (notação científica)
Seta sobre o número: `virgula--esquerda` (azul, expoente positivo) ou `virgula--direita` (laranja, negativo). Para colorir parte da fórmula: `\htmlClass{sinal sinal--mais}{(+)}`.
```html
<div class="virgula virgula--esquerda">$24.000.000 = 2{,}4 \cdot 10^{\htmlClass{sinal sinal--mais}{(+)}7}$</div>
```

### Decisão (dois casos)
Dois cartões lado a lado para regras do tipo "se… então…".
```html
<div class="decisao">
  <div class="decisao-caso">
    <p class="decisao-condicao">$N &lt; \sqrt{10}$</p>
    <p class="decisao-resultado">$\text{OG} = 10^{L}$</p>
    <p class="decisao-nota">L não muda</p>
  </div>
  <div class="decisao-caso">…</div>
</div>
```

### Figura
```html
<figure class="figura">
  <img src="assets/figuras/cap02-grafico.png" width="400" height="300" alt="Descrição do que a figura mostra">
  <figcaption>Fonte: …</figcaption>
</figure>
```
Coloque o arquivo em `src/assets/figuras/` com prefixo do capítulo. Sempre escreva o `alt`.

### Selo de seção
Transforma o `h2` num carimbo (Lilita One, borda azul, sombra laranja). Use para **Hora de praticar!** (exercícios resolvidos) e **Lista de exercícios**.
```html
<section class="secao pratica" id="pratica-1">
  <h2 class="selo">Hora de praticar!</h2>
  …
</section>
```

### Questão
`data-gabarito` com a letra correta (minúscula) liga o modo estudo na web e alimenta o gabarito. Deixe vazio (`data-gabarito=""`) em questões abertas.
```html
<article class="questao" data-gabarito="c">
  <p class="questao-cab"><span class="questao-num">1</span><span class="questao-fonte">Unesp</span></p>
  <p>Enunciado…</p>
  <ol class="alternativas">
    <li>24 segundos.</li>
    <li>124 segundos.</li>
    <li>144 segundos.</li>
  </ol>
  <details class="resolucao">
    <summary>Resolução</summary>
    <p>…</p>
    <p class="gabarito-linha">Gabarito: <strong>C</strong></p>
  </details>
</article>
```
- Na **web**, a resolução começa fechada ("Ver") para o aluno tentar antes.
- No **PDF**, todas as resoluções saem abertas.

### Gabarito da lista
Não escreva à mão: coloque este marcador no fim da seção `secao lista` e o build monta a grade a partir dos `data-gabarito`.
```html
<aside class="gabarito" data-gerar-gabarito></aside>
```

---

## 6. Versão web

- **Barra fixa** com o átomo e o número/título do capítulo.
- **Capa** vira abertura compacta; a régua continua lá.
- **Sumário** lateral (≥ 1024 px) ou no topo (celular), gerado a partir dos `h2`.
- **Modo estudo** (`src/scripts/apostila.js`): cada alternativa vira botão; ao tocar, a escolhida fica verde ou vermelha, a correta é indicada e aparece uma mensagem curta.
- **Tema escuro** automático pelo sistema do aluno.
- Funciona sem JavaScript: sem ele, as alternativas ficam como lista comum.

---

## 7. Checklist antes de publicar um capítulo

- [ ] `npm run pdf` roda sem erro (fórmula com erro interrompe o build e mostra qual é).
- [ ] Nenhuma fórmula em destaque passa da largura da coluna no PDF — quebre com `\begin{aligned} … \\ … \end{aligned}`.
- [ ] Todo `data-gabarito` confere com a resolução e com o enunciado.
- [ ] Símbolos de unidade em minúsculas quando o SI manda (`kg`, `mol`, `kelvin`).
- [ ] Toda figura tem `alt` e fonte.
- [ ] Olhar o PDF página a página: título sozinho no pé de coluna, tabela partida, figura estourando.
