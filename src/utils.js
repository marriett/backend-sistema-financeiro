function encontrarConta(contaInformada, bancoDeDados) {
    return bancoDeDados.contas.find((conta) => contaInformada.padStart(5, '0') === conta.numero_conta)
}

function filtrarHistorico(contaInformada, bancoDeDados) {
    const resultado = bancoDeDados.filter((conta) => {
        return contaInformada.numero_conta === conta.numero_conta
    })

    return resultado
}

module.exports = {
    encontrarConta,
    filtrarHistorico
}