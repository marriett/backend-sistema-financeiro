const bancoDeDados = require('../database/bancodedados')
const utils = require('../utils')

const fazerDeposito = (req, res) => {
    try {
        const { numero_conta, valor } = req.body

        if (!numero_conta) return res.status(400).json({ mensagem: 'Obrigatório informar número da conta a ser depositado' })

        if (!valor) return res.status(400).json({ mensagem: 'Obrigatório informar valor a ser depositado' })

        const contaDeDeposito = utils.encontrarConta(numero_conta, bancoDeDados)

        if (!contaDeDeposito) return res.status(404).json({ mensagem: 'A conta informada não existe' })

        const deposito = {
            data: new Date().toLocaleString(),
            numero_conta: contaDeDeposito.numero_conta,
            valor: Number(valor)
        }

        contaDeDeposito.saldo += deposito.valor

        bancoDeDados.depositos.push(deposito)

        return res.status(201).json()
    } catch (error) {
        return res.status(500).json({ mensagem: err.message })
    }
}

const fazerSaque = (req, res) => {
    try {
        const { numero_conta, valor } = req.body

        if (!valor) return res.status(400).json({ mensagem: 'Obrigatório informar o valor de saque' })

        const contaDeSaque = utils.encontrarConta(numero_conta, bancoDeDados)

        if (contaDeSaque.saldo < Number(valor)) return res.status(400).json({ mensagem: 'Saldo insuficiente' })

        const saque = {
            data: new Date().toLocaleString(),
            numero_conta: contaDeSaque.numero_conta,
            valor: Number(valor)
        }

        contaDeSaque.saldo -= saque.valor

        bancoDeDados.saques.push(saque)

        return res.status(201).json()
    } catch (error) {
        return res.status(500).json({ mensagem: err.message })
    }
}

const fazerTransferencia = (req, res) => {
    try {
        const { numero_conta_origem, numero_conta_destino, valor } = req.body

        if (!numero_conta_destino) return res.status(400).json({ mensagem: 'Obrigatório informar conta de destino' })

        if (!valor) return res.status(400).json({ mensagem: 'Obrigatório informar valor a ser transferido' })

        const contaDeOrigem = utils.encontrarConta(numero_conta_origem, bancoDeDados)
        const contaDeDestino = utils.encontrarConta(numero_conta_destino, bancoDeDados)

        if (!contaDeDestino) return res.status(404).json({ mensagem: 'A conta de destino informada não existe' })

        if (contaDeOrigem === contaDeDestino) return res.status(404).json({ mensagem: 'Para fazer a transferência, as contas de origem e destino devem ser diferentes' })

        if (contaDeOrigem.saldo < Number(valor)) return res.status(400).json({ mensagem: 'Saldo insuficiente' })

        const transferir = {
            data: new Date().toLocaleString(),
            numero_conta_origem: contaDeOrigem.numero_conta,
            numero_conta_destino: contaDeDestino.numero_conta,
            valor: Number(valor)
        }

        contaDeOrigem.saldo -= transferir.valor
        contaDeDestino.saldo += transferir.valor

        bancoDeDados.transferencias.push(transferir)

        return res.status(201).json()
    } catch (error) {
        return res.status(500).json({ mensagem: err.message })
    }
}

const consultarSaldo = (req, res) => {
    try {
        const { numero_conta } = req.query

        const consultarSaldo = utils.encontrarConta(numero_conta, bancoDeDados)

        return res.status(200).json({ saldo: consultarSaldo.saldo })
    } catch (error) {
        return res.status(500).json({ mensagem: err.message })
    }

}

const consultarExtrato = (req, res) => {
    try {
        const { numero_conta } = req.query

        const consultarExtrato = utils.encontrarConta(numero_conta, bancoDeDados)

        const depositos = utils.filtrarHistorico(consultarExtrato, bancoDeDados.depositos)

        const saques = utils.filtrarHistorico(consultarExtrato, bancoDeDados.saques)

        const transferenciasEnviadas = bancoDeDados.transferencias.filter((conta) => {
            return consultarExtrato.numero_conta === conta.numero_conta_origem
        })

        const transferenciasRecebidas = bancoDeDados.transferencias.filter((conta) => {
            return consultarExtrato.numero_conta === conta.numero_conta_destino
        })

        const extrato = { depositos, saques, transferenciasEnviadas, transferenciasRecebidas }

        return res.status(200).json(extrato)
    } catch (error) {
        return res.status(500).json({ mensagem: err.message })
    }

}

module.exports = {
    fazerDeposito,
    fazerSaque,
    fazerTransferencia,
    consultarSaldo,
    consultarExtrato
}
