const bancoDeDados = require('../database/bancodedados')
const utils = require('../utils')

let id_conta = 1

const listarContas = (req, res) => {
    try {
        return res.status(200).json(bancoDeDados.contas)
    } catch (err) {
        return res.status(500).json({ mensagem: err.message })
    }
}

const criarConta = (req, res) => {
    try {
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
        const numero_conta = id_conta.toString().padStart(5, '0')

        const cpfUnico = bancoDeDados.contas.find((item) => {
            return cpf === item.usuario.cpf
        })

        if (cpfUnico) return res.status(400).json({ mensagem: 'Cpf já existe' })

        const emailUnico = bancoDeDados.contas.find((item) => {
            return email === item.usuario.email
        })

        if (emailUnico) return res.status(400).json({ mensagem: 'Email já existe' })

        const novaConta = {
            numero_conta,
            saldo: 0,
            usuario: {
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                senha
            }
        }

        bancoDeDados.contas.push(novaConta)
        id_conta++

        return res.status(201).json({ mensagem: 'Conta cadastrada com sucesso.' })
    } catch (err) {
        return res.status(500).json({ mensagem: err.message })
    }
}

const atualizarConta = (req, res) => {
    try {
        const { numero_conta } = req.params
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

        const atualizarUsuario = utils.encontrarConta(numero_conta, bancoDeDados)

        if (!atualizarUsuario) return res.status(404).json({ mensagem: 'Conta informada não existe' })

        const cpfUnico = bancoDeDados.contas.find((item) => {
            return cpf === item.usuario.cpf
        })

        if (cpfUnico && cpfUnico.usuario.cpf !== atualizarUsuario.usuario.cpf) return res.status(400).json({ mensagem: 'Cpf já existe' })

        const emailUnico = bancoDeDados.contas.find((item) => {
            return email === item.usuario.email
        })

        if (emailUnico && atualizarUsuario.usuario.email !== emailUnico.usuario.email) return res.status(400).json({ mensagem: 'Email já existe' })

        atualizarUsuario.usuario = {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }

        return res.status(204).json()
    } catch (err) {
        return res.status(500).json({ mensagem: err.message })
    }
}

const deletarConta = (req, res) => {
    try {
        const { numero_conta } = req.params

        const conta = utils.encontrarConta(numero_conta, bancoDeDados)

        if (!conta) return res.status(404).json({ mensagem: 'Conta informada não existe' })

        if (conta.saldo !== 0) return res.status(400).json({ mensagem: 'Impossível encerrar uma conta que tem saldo diferente de zero.' })

        const excluirConta = bancoDeDados.contas.filter((conta) => {
            return conta.numero_conta !== numero_conta.padStart(5, '0')
        })

        bancoDeDados.contas = excluirConta

        return res.status(204).json()
    } catch (err) {
        return res.status(500).json({ mensagem: err.message })
    }
}

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    deletarConta
}