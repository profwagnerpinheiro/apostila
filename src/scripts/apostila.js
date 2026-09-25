// Modo estudo da versão web: o aluno escolhe uma alternativa e vê na hora se acertou.
// Não roda na geração do PDF (scripts/pdf.mjs define window.__PDF__ e abre todas as resoluções).
(() => {
  if (window.__PDF__) {
    document.querySelectorAll("details").forEach((d) => (d.open = true));
    return;
  }

  for (const questao of document.querySelectorAll(".questao[data-gabarito]")) {
    const correta = questao.dataset.gabarito;
    const lista = questao.querySelector(".alternativas");
    if (!correta || !lista) continue;

    const retorno = document.createElement("p");
    retorno.className = "retorno";
    retorno.setAttribute("role", "status");
    lista.after(retorno);
    lista.classList.add("alternativas--interativas");

    const botoes = [...lista.children].map((li, i) => {
      const letra = String.fromCharCode(97 + i);
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "alt";
      botao.dataset.letra = letra;
      botao.innerHTML = `<span class="alt-letra">${letra})</span><span class="alt-texto">${li.innerHTML}</span>`;
      li.replaceChildren(botao);
      return botao;
    });

    lista.addEventListener("click", (evento) => {
      const escolhido = evento.target.closest(".alt");
      if (!escolhido) return;
      const acertou = escolhido.dataset.letra === correta;
      for (const b of botoes) {
        b.dataset.estado = b === escolhido ? (acertou ? "certo" : "errado") : b.dataset.letra === correta && !acertou ? "certo" : "";
        b.setAttribute("aria-pressed", String(b === escolhido));
      }
      retorno.dataset.estado = acertou ? "certo" : "errado";
      retorno.textContent = acertou
        ? "Certo! Muito bem."
        : `Não foi dessa vez. A resposta é a letra ${correta.toUpperCase()}.`;
    });
  }
})();
