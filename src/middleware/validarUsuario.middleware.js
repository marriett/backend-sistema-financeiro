const bancoDeDados = require('../database/bancodedados')
const utils = require('../utils')

const verificarSenhaBanco = (req, res, next) => {
    const { senha_banco } = req.query

    if (!senha_banco) return res.status(400).json({ mensagem: 'Informar a senha é obrigatório' })

    if (senha_banco !== bancoDeDados.banco.senha) return res.status(401).json({ mensagem: 'Senha incorreta' })

    next()
}

const verificarUsuarioBody = (req, res, next) => {
    const { senha, numero_conta } = req.body

    if (!senha) return res.status(400).json({ mensagem: 'Informar a senha é obrigatório' })

    if (!numero_conta) return res.status(400).json({ mensagem: 'Informar a conta é obrigatório' })

    const conta = utils.encontrarConta(numero_conta, bancoDeDados)

    if (!conta) return res.status(404).json({ mensagem: 'Conta inexistente' })

    if (senha !== conta.usuario.senha) return res.status(401).json({ mensagem: 'Senha incorreta' })

    next()
}

const verificarContaOrigem = (req, res, next) => {
    const { senha, numero_conta_origem } = req.body

    if (!senha) return res.status(400).json({ mensagem: 'Informar a senha é obrigatório' })

    if (!numero_conta_origem) return res.status(400).json({ mensagem: 'Informar a conta de origem é obrigatório' })

    const conta = utils.encontrarConta(numero_conta_origem, bancoDeDados)

    if (!conta) return res.status(404).json({ mensagem: 'Conta inexistente' })

    if (senha !== conta.usuario.senha) return res.status(401).json({ mensagem: 'Senha incorreta' })

    next()
}

const verificarUsuarioQuery = (req, res, next) => {
    const { senha, numero_conta } = req.query

    if (!senha) return res.status(400).json({ mensagem: 'Informar a senha é obrigatório' })

    if (!numero_conta) return res.status(400).json({ mensagem: 'Informar o numero da conta é obrigatório' })

    const conta = utils.encontrarConta(numero_conta, bancoDeDados)

    if (!conta) return res.status(404).json({ mensagem: 'Conta inexistente' })

    if (senha !== conta.usuario.senha) return res.status(401).json({ mensagem: 'Senha incorreta' })

    next()
}

const verificarDados = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    const validar = ['nome', 'cpf', 'data de nascimento', 'telefone', 'e-mail', 'senha']
    const array = [nome, cpf, data_nascimento, telefone, email, senha]

    for (let i = 0; i < array.length; i++) {
        if (!array[i]) {
            return res.status(400).json({ mensagem: `Obrigatório informar ${validar[i]}` })
        }
    }

    if (cpf.length !== 11) return res.status(401).json({ mensagem: 'CPF deve conter exatamente 11 dígitos.' })

    next()
}

module.exports = {
    verificarSenhaBanco,
    verificarUsuarioBody,
    verificarContaOrigem,
    verificarUsuarioQuery,
    verificarDados
}