export function criarContadorDeAnalises() {
    let totalAnalises = 0;
    return function() {
        totalAnalises++;
        return totalAnalises;
    };
}

export class Vaga {
    constructor(id, empresa, cargo, requisitos, salario, modalidade) {
        this.id = id;
        this.empresa = empresa;
        this.cargo = cargo;
        this.requisitos = requisitos;
        this.salario = salario;
        this.modalidade = modalidade;
    }

    calcularCompatibilidade(habilidadesDoCandidato) {
        let skillsDoCandidatoMinuscuto = habilidadesDoCandidato.map(item => item.toLowerCase());

        let encontradas = this.requisitos.filter(req =>
            skillsDoCandidatoMinuscuto.includes(req.toLowerCase())
        );

        let faltantes = this.requisitos.filter(req =>
            !skillsDoCandidatoMinuscuto.includes(req.toLowerCase())
        );

        let percentual = Math.round((encontradas.length / this.requisitos.length) * 100);

        let classificacao = "Baixa";
        if (percentual >= 80) {
            classificacao = "Alta";
        } else if (percentual >= 50) {
            classificacao = "Média";
        }

        return {
            percentual: percentual,
            classificacao: classificacao,
            encontradas: encontradas,
            faltantes: faltantes
        };
    }

    obterTextoExibicao() {
        return `${this.cargo} na empresa ${this.empresa}`;
    }
}

export class VagaFrontEnd extends Vaga {
    constructor(id, empresa, cargo, requisitos, salario, modalidade, senioridade = "Júnior") {
        super(id, empresa, cargo, requisitos, salario, modalidade);
        this.senioridade = senioridade;
    }

    obterTextoExibicao() {
        return `[${this.senioridade}] ${this.cargo} - Vaga na ${this.empresa}`;
    }
}

export function analisarTodoOCatalogo(listaDeVagas, perfilDoCandidato) {
    let resultados = listaDeVagas.map(vaga => {
        let analise = vaga.calcularCompatibilidade(perfilDoCandidato.habilidades);
        return {
            vaga: vaga,
            percentual: analise.percentual,
            classificacao: analise.classificacao,
            encontradas: analise.encontradas,
            faltantes: analise.faltantes
        };
    });

    let melhorOpcao = resultados.reduce((melhor, atual) => {
        if (melhor === null) {
            return atual;
        }
        if (atual.percentual > melhor.percentual) {
            return atual;
        }

        if (atual.percentual === melhor.percentual) {
            if (perfilDoCandidato.experienciaMeses > 12) {
                return atual;
            }
        }
        return melhor;
    }, null);

    let dicaDeEstudo = "Parabéns! Você tem todas as habilidades para essa vaga.";
    if (melhorOpcao && melhorOpcao.faltantes.length > 0) {
        dicaDeEstudo = `Estude mais os seguintes pontos para conquistar essa vaga: ${melhorOpcao.faltantes.join(", ")}.`;
    }

    return {
        resultadosCompleto: resultados,
        melhorMatch: melhorOpcao,
        recomendacao: dicaDeEstudo
    };
}