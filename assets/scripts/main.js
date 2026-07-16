import { criarContadorDeAnalises, analisarTodoOCatalogo } from "./motor.js";
import {
    carregarVagasDoArquivo,
    guardarPerfilNoNavegador,
    pegarPerfilDoNavegador
} from "./dados.js";
import { desenharCardsDeVagas, desenharCaixaDestaque, mostrarAvisosDeRede } from "./ui.js";

let formulario = document.getElementById("form-perfil");
let campoNome = document.getElementById("input-nome");
let campoArea = document.getElementById("input-area");
let campoExperiencia = document.getElementById("input-experiencia");
let campoHabilidades = document.getElementById("input-habilidades");
let divErrosDoForm = document.getElementById("form-erro");
let divStatusRede = document.getElementById("status-rede");
let secaoDeResultados = document.getElementById("section-resultados");
let divMelhorVaga = document.getElementById("container-destaque");
let divGridVagas = document.getElementById("grid-vagas");
let botaoLimpar = document.getElementById("btn-limpar");

let bancoDeVagasLocal = [];

let registrarNovaAnalise = criarContadorDeAnalises();

function resetarEstadoDaTela() {
    secaoDeResultados.hidden = true;
    divMelhorVaga.innerHTML = "";
    divGridVagas.innerHTML = "";
    divErrosDoForm.hidden = true;
    divErrosDoForm.textContent = "";
    campoNome.value = "";
    campoArea.value = "";
    campoExperiencia.value = "";
    campoHabilidades.value = "";
}

if (botaoLimpar) {
    botaoLimpar.addEventListener("click", function() {
        resetarEstadoDaTela();
        mostrarAvisosDeRede(divStatusRede, "sucesso", "");
    });
}

async function iniciarSite() {
    resetarEstadoDaTela();

    bancoDeVagasLocal = await carregarVagasDoArquivo((estado, msg) => {
        mostrarAvisosDeRede(divStatusRede, estado, msg);
    });

    let perfilJaSalvo = pegarPerfilDoNavegador();
    if (perfilJaSalvo !== null) {
        campoNome.value = perfilJaSalvo.nome;
        campoArea.value = perfilJaSalvo.area;
        campoExperiencia.value = perfilJaSalvo.experienciaMeses;
        campoHabilidades.value = perfilJaSalvo.habilidades.join(", ");

        executarCalculosEVisualizacao(perfilJaSalvo);
    }
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    divErrosDoForm.hidden = true;
    divErrosDoForm.textContent = "";

    let nomeInformado = campoNome.value.trim();
    let areaInformada = campoArea.value.trim();
    let experienciaInformada = campoExperiencia.value.trim();
    let habilidadesInformadas = campoHabilidades.value.trim();

    if (nomeInformado === "" || areaInformada === "" || experienciaInformada === "" || habilidadesInformadas === "") {
        divErrosDoForm.textContent = "Por favor, preencha todos os campos vazios antes de analisar.";
        divErrosDoForm.hidden = false;
        return;
    }

    let listaHabilidadesTratadas = habilidadesInformadas.split(",")
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

    let dadosCandidato = {
        nome: nomeInformado,
        area: areaInformada,
        experienciaMeses: parseInt(experienciaInformada) || 0,
        habilidades: listaHabilidadesTratadas
    };

    guardarPerfilNoNavegador(dadosCandidato);

    executarCalculosEVisualizacao(dadosCandidato);
});

function executarCalculosEVisualizacao(perfil) {
    if (bancoDeVagasLocal.length === 0) return;

    let analiseGeral = analisarTodoOCatalogo(bancoDeVagasLocal, perfil);

    let totalConsultas = registrarNovaAnalise();
    console.log(`[Contador Local] Análises efetuadas nesta sessão: ${totalConsultas}`);

    secaoDeResultados.hidden = false;

    desenharCardsDeVagas(divGridVagas, analiseGeral.resultadosCompleto);
    desenharCaixaDestaque(divMelhorVaga, analiseGeral.melhorMatch, analiseGeral.recomendacao);
}

iniciarSite();