# Design System — Apostila de Física · Prof. Wagner Pinheiro

Padrão visual de **livro didático**. O mesmo HTML gera duas saídas:

| Saída | Para quem | Como é |
|---|---|---|
| **PDF A4** (`pdf/*.pdf`) | impressão | fundo branco; página de abertura do capítulo, texto em coluna única com coluna de margem para os boxes, cabeçalho corrido, aba lateral com o número do capítulo |
| **Versão web** (`dist/*.html`) | leitura no celular e no computador | fundo branco, mesma abertura, sumário lateral, boxes na margem em telas largas e **modo estudo** (o aluno marca a alternativa e vê se acertou) |

---

## 1. Princípios

1. **Fundo sempre branco.** Página, abertura e versão web são brancas; a cor aparece só em títulos, faixas de exercícios, boxes e figuras.
2. **Cor organiza, não enfeita.** O azul-marinho da marca é a cor do volume (seções, faixas, aba lateral); o laranja marca os exercícios propostos e o número do capítulo; o verde é usado no box "Lembre-se" e no vetor resultante.
3. **Texto sóbrio e confortável.** Corpo em serifa (Source Serif 4), títulos e elementos de apoio em sem serifa (Source Sans 3). Linha de ~70 caracteres.
4. **Tudo tem lugar fixo.** Teoria na coluna principal, curiosidades e lembretes na margem, exercícios em faixas próprias, respostas no fim da lista.
5. **Numeração de livro.** Seções numeradas (1, 2, 3…), tabelas e figuras como "Tabela 2.1" e "Figura 2.3", exercícios resolvidos como R1, R2… O build numera sozinho.

---

## 2. Estrutura de um capítulo

1. **Página de abertura:** fundo branco com filete azul no topo, número grande do capítulo em laranja, título em azul e uma ilustração ligada ao assunto; abaixo, "Para começar" (texto de motivação) e "Neste capítulo você vai" (objetivos).
2. **Seções de teoria** numeradas, com subtítulos (`h3`), definições em destaque e boxes na margem.
3. **Exercícios resolvidos** (faixa azul) depois de cada bloco de teoria: R1, R2…, com resolução em fundo azul-claro.
4. **Exercícios propostos** (faixa laranja), sempre em página nova, em duas colunas, com o aviso "Faça no caderno".
5. **Respostas** no fim da lista, geradas automaticamente.

---

## 3. Tokens

Em `src/styles/tokens.css`. Os componentes usam os **papéis** (`--titulo`, `--faixa`…), nunca a cor crua. Há um único tema, claro, com fundo branco.

### Cores

| Token | Valor | Uso |
|---|---|---|
| `--marinho` | `#03407C` | cor do volume: títulos, faixas, número das seções, aba |
| `--laranja` | `#F2721C` | número do capítulo na abertura, marcadores |
| `--laranja-escuro` | `#B8500A` | laranja para texto; número dos exercícios propostos |
| `--faixa-2` | `#C2560C` | faixa "Exercícios propostos" |
| `--ceu` | `#E9F0F8` | fundo de definição, cabeçalho de tabela, resolução, objetivos |
| `--verde` | `#1F6F4A` | box "Lembre-se", vetor resultante nas figuras |
| `--tinta` / `--tinta-2` | `#1A1F29` / `#525C6B` | texto e legendas |
| `--vet-1` / `--vet-2` / `--vet-r` | azul / laranja / verde | cores fixas dos vetores nas figuras |

### Tipografia

| Papel | Fonte | Onde |
|---|---|---|
| Texto | **Source Serif 4** | parágrafos, enunciados, número grande do capítulo |
| Títulos e apoio | **Source Sans 3** | títulos, boxes, tabelas, legendas, alternativas |
| Marca | **Nunito** 900 | só em "WAGNER PINHEIRO Física" |
| Matemática | **KaTeX** | todas as fórmulas, renderizadas no build |

Impresso: corpo 9,8 pt, entrelinha 1,5; títulos de seção 13,5 pt; boxes 8 pt. As fontes vêm do npm e são copiadas para `dist/fontes` (o PDF não depende de internet).

---

## 4. Grade do impresso

- **Papel:** A4. **Margens:** 24 mm topo · 20 mm esquerda · 14 mm direita · 20 mm pé.
- **Coluna de texto:** 124 mm. **Coluna de margem:** 46 mm, à direita, com 6 mm de intervalo.
- **Cabeçalho corrido:** "CAPÍTULO 2 · Vetores" à esquerda e a marca à direita, sobre um fio azul.
- **Aba lateral:** retângulo azul na borda direita com o número do capítulo; desce 24 mm a cada capítulo, como o índice de dedo de um livro.
- **Rodapé:** contatos à esquerda, número da página à direita (começa em 1 depois da abertura).
- **Exercícios propostos:** ocupam as duas colunas (texto + margem) e são diagramados em duas colunas.

---

## 5. Componentes

Escreva em `src/capitulos/*.html`. Fórmulas entre `$…$` (na linha) ou `$$…$$` (em destaque). Dentro das fórmulas, use `&lt;` e `&gt;` no lugar de `<` e `>`, e `{,}` para a vírgula decimal (`2{,}4`).

### Seção de teoria
O número é colocado pelo build.
```html
<section class="secao" id="decomposicao">
  <h2>Decomposição de um vetor</h2>
  <p>…</p>
  <h3>Subtítulo</h3>
</section>
```

### Definição
```html
<div class="definicao">
  <p class="definicao-titulo">Vetor</p>
  <p>É um segmento de reta orientado…</p>
</div>
```

### Boxes de margem
Coloque o `aside` **antes** do parágrafo ao qual ele se refere. Tipos: `nota--saiba` (Saiba mais, azul), `nota--lembre` (Lembre-se, verde), `nota--atencao` (Atenção, laranja), `nota--glossario` (Glossário, cinza).
```html
<aside class="nota nota--saiba">
  <p class="nota-titulo">Saiba mais</p>
  <p>O SI foi adotado em 1960…</p>
</aside>
```

### Tabela
A legenda ganha "Tabela N.n" automaticamente.
```html
<div class="tabela">
  <table>
    <caption>Grandezas de base do SI e suas unidades.</caption>
    <thead><tr><th scope="col">Grandeza</th><th scope="col">Unidade</th></tr></thead>
    <tbody><tr><th scope="row">massa</th><td>quilograma</td></tr></tbody>
  </table>
</div>
```

### Figura
Na teoria, a legenda ganha "Figura N.n". Nos exercícios, não é numerada.
```html
<figure class="figura">
  <img src="assets/figuras/cap03-grafico.png" width="600" height="400" alt="O que a figura mostra">
  <figcaption>Legenda. Fonte: …</figcaption>
</figure>
```
`figura--larga` deixa a imagem ocupar a coluna inteira (mapas, gráficos grandes).

### Figura vetorial (desenhada pelo build)
As figuras de vetores ficam em `scripts/figuras.mjs` e são chamadas pelo nome. Cores: `v1` azul, `v2` laranja, `vr` verde (resultante).
```html
<figure class="figura figura--vetorial">
  {{fig:paralelogramo}}
  <figcaption>Regra do paralelogramo.</figcaption>
</figure>
```
Disponíveis: `vetor`, `poligono`, `mesmoSentido`, `sentidosOpostos`, `pitagoras`, `paralelogramo`, `diferenca`, `produto`, `decomposicao`. Para criar outra, use os auxiliares `seta`, `rotulo`, `angulo` e `linha` do mesmo arquivo.

### Fórmula em destaque
```html
<div class="formula">
  $$V_R^2 = V_1^2 + V_2^2 + 2\,V_1 V_2 \cos\theta$$
</div>
```
Com legenda de variáveis, acrescente `<dl class="formula-legenda">…</dl>` (ver Capítulo 1).

### Outros recursos
- `ol.exemplos` (a, b, c), `ol.regras` e `ol.itens-romanos` (I, II, III), `ul.topicos`.
- `.proporcao` com `proporcao--direta` ou `proporcao--inversa` para a regra de três.
- `.virgula--esquerda` / `.virgula--direita` para notação científica.
- `.decisao` com dois `.decisao-caso` para regras "se… então…".
- `.classificacao` para o esquema escalar × vetorial.
- `p.rotulo` para títulos pequenos ("Exemplos", "Observações").

### Blocos de exercícios
```html
<section class="secao exercicios exercicios--resolvidos" id="resolvidos">
  <h2>Exercícios resolvidos</h2>
  <article class="questao" data-gabarito="a">
    <p class="questao-cab"><span class="questao-num">R1</span><span class="questao-fonte">Mackenzie</span></p>
    <p>Enunciado…</p>
    <ol class="alternativas"><li>…</li></ol>
    <details class="resolucao">
      <summary>Resolução</summary>
      <p>…</p>
      <p class="resposta">Resposta: alternativa <strong>a</strong>.</p>
    </details>
  </article>
</section>

<section class="secao exercicios exercicios--propostos lista" id="propostos">
  <h2>Exercícios propostos</h2>
  <p class="caderno">Faça no caderno. Não escreva na apostila.</p>
  <article class="questao" data-gabarito="c">…</article>
  <aside class="gabarito" data-gerar-gabarito></aside>
</section>
```
- A fonte da questão vai sem parênteses; o CSS coloca.
- `data-gabarito` com a letra correta liga o modo estudo e alimenta as respostas. Deixe vazio em questões abertas.
- Texto de apoio compartilhado ("Texto para a próxima questão") vai em `<p class="texto-base">` dentro do `article`, antes do cabeçalho da questão.
- Alternativas curtas (potências de 10, números) são postas lado a lado pelo build.

---

## 6. Página de abertura

Configurada no bloco `meta` do capítulo:
```json
{
  "numero": "2",
  "titulo": "Vetores",
  "arquivo": "cap02-vetores",
  "ilustracao": "barco",
  "legendaIlustracao": "…",
  "paraComecar": "…",
  "objetivos": ["…;", "…."]
}
```
`ilustracao` escolhe o desenho da abertura, definido em `scripts/figuras.mjs` (`ilustracoes`): `escala` (potências de 10) e `barco` (soma de velocidades). Para um capítulo novo, crie uma função ali com o desenho do assunto.

---

## 7. Checklist antes de publicar

- [ ] `npm run pdf` roda sem erro (fórmula com erro interrompe o build e mostra qual é).
- [ ] Nenhuma fórmula em destaque passa da largura da coluna — quebre com `\begin{aligned} … \\ … \end{aligned}`.
- [ ] Todo `data-gabarito` confere com a resolução.
- [ ] Toda figura tem `alt`; figuras de terceiros têm fonte.
- [ ] Olhar o PDF página a página: título sozinho no pé da página, box de margem invadindo o rodapé, figura grande demais.
