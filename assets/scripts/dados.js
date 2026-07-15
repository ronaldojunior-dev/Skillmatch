import { VagaFrontEnd } from "./motor.js";

export async function carregarVagasDoArquivo(avisarEstadoNaTela) {
    try {
        avisarEstadoNaTela("carregando", "Buscando vagas no catálogo, por favor aguarde...");

        let resposta = await fetch("./assets/dados/vagas.json");

        if (resposta.ok === false) {
            throw new Error("Não foi possível conectar com o arquivo de dados.");
        }

        let dadosBrutos = await resposta.json();

        if (dadosBrutos.length === 0) {
            avisarEstadoNaTela("vazio", "Nenhuma vaga cadastrada no momento.");
            return [];
        }

        let vagasInstanciadas = dadosBrutos.map(v =>
            new VagaFrontEnd(v.id, v.empresa, v.cargo, v.requisitos, v.salario, v.modalidade)
        );

        avisarEstadoNaTela("sucesso", "");
        return vagasInstanciadas;

    } catch (erro) {
        console.error(erro);
        avisarEstadoNaTela("erro", "Erro ao carregar as vagas. Verifique sua conexão de rede.");
        return [];
    }
}

export function guardarPerfilNoNavegador(objetoPerfil) {
    localStorage.setItem("perfil_usuario_skillmatch", JSON.stringify(objetoPerfil));
}

export function pegarPerfilDoNavegador() {
    let dadosSalvos = localStorage.getItem("perfil_usuario_skillmatch");
    if (dadosSalvos === null) {
        return null;
    }
    return JSON.parse(dadosSalvos);
}

export function apagarPerfilDoNavegador() {
    localStorage.removeItem("perfil_usuario_skillmatch");
}