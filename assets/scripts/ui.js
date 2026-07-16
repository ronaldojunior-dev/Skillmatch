export function desenharCardsDeVagas(caixaGrid, listaDeResultados) {
    caixaGrid.innerHTML = "";

    listaDeResultados.forEach(item => {
        let elementoCard = document.createElement("article");
        elementoCard.classList.add("vaga-card");

        let tagTitulo = document.createElement("h3");
        tagTitulo.textContent = item.vaga.obterTextoExibicao();

        let tagInfo = document.createElement("p");
        tagInfo.textContent = `Modalidade: ${item.vaga.modalidade} | Salário: R$ ${item.vaga.salario}`;

        let tagPorcentagem = document.createElement("p");
        tagPorcentagem.innerHTML = `Compatibilidade: <strong>${item.percentual}%</strong>`;

        let tagBadge = document.createElement("span");
        tagBadge.classList.add("badge-status", `status-${item.classificacao.toLowerCase()}`);
        tagBadge.textContent = `Aderência ${item.classificacao}`;

        let tagTem = document.createElement("p");
        tagTem.innerHTML = `<small style="color: green;">Você possui: ${item.encontradas.join(", ") || "Nenhuma"}</small>`;

        let tagFalta = document.createElement("p");
        tagFalta.innerHTML = `<small style="color: red;">Falta estudar: ${item.faltantes.join(", ") || "Nenhuma"}</small>`;

        elementoCard.appendChild(tagTitulo);
        elementoCard.appendChild(tagInfo);
        elementoCard.appendChild(tagPorcentagem);
        elementoCard.appendChild(tagBadge);
        elementoCard.appendChild(tagTem);
        elementoCard.appendChild(tagFalta);

        caixaGrid.appendChild(elementoCard);
    });
}

export function desenharCaixaDestaque(caixaDestaque, melhorMatch, dicaEstudo) {
    caixaDestaque.innerHTML = "";

    if (melhorMatch === null) {
        caixaDestaque.hidden = true;
        return;
    }
    caixaDestaque.hidden = false;

    let tituloDestaque = document.createElement("h3");
    tituloDestaque.textContent = "🎯 Recomendação Técnica Ideal para Você";

    let textoResumo = document.createElement("p");
    textoResumo.innerHTML = `A vaga mais compatível com seu perfil atual é a de <strong>${melhorMatch.vaga.cargo}</strong> com <strong>${melhorMatch.percentual}%</strong> de match.`;

    let textoDica = document.createElement("p");
    textoDica.style.fontStyle = "italic";
    textoDica.style.marginTop = "10px";
    textoDica.textContent = dicaEstudo;

    caixaDestaque.appendChild(tituloDestaque);
    caixaDestaque.appendChild(textoResumo);
    caixaDestaque.appendChild(textoDica);
}

export function mostrarAvisosDeRede(caixaStatus, tipoDeEstado, mensagemDeTexto) {
    caixaStatus.innerHTML = "";

    if (tipoDeEstado === "sucesso" || mensagemDeTexto === "") {
        caixaStatus.style.display = "none";
        return;
    }

    caixaStatus.style.display = "block";
    let textoAlerta = document.createElement("p");
    textoAlerta.textContent = `[Aviso do Sistema] ${mensagemDeTexto}`;

    if (tipoDeEstado === "erro") {
        textoAlerta.style.color = "red";
    } else {
        textoAlerta.style.color = "blue";
    }

    caixaStatus.appendChild(textoAlerta);
}