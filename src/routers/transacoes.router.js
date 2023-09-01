const express = require('express')

const {
    verificarUsuarioBody,
    verificarContaOrigem,
    verificarUsuarioQuery
} = require('../middleware/validarUsuario.middleware')

const {
    fazerDeposito,
    fazerSaque,
    fazerTransferencia,
    consultarSaldo,
    consultarExtrato
} = require('../controller/transacoes.controller')

const transacoes = express()

transacoes.post('/transacoes/depositar', fazerDeposito)
transacoes.post('/transacoes/sacar', verificarUsuarioBody, fazerSaque)
transacoes.post('/transacoes/transferir', verificarContaOrigem, fazerTransferencia)
transacoes.get('/contas/saldo', verificarUsuarioQuery, consultarSaldo)
transacoes.get('/contas/extrato', verificarUsuarioQuery, consultarExtrato)

module.exports = transacoes