const express = require('express')

const {
    verificarSenhaBanco,
    verificarDados
} = require('../middleware/validarUsuario.middleware')

const {
    listarContas,
    criarConta,
    atualizarConta,
    deletarConta
} = require('../controller/contas.controller')

const contas = express()

contas.get('/contas', verificarSenhaBanco, listarContas)
contas.post('/contas', verificarDados, criarConta)
contas.put('/contas/:numero_conta/usuario', verificarDados, atualizarConta)
contas.delete('/contas/:numero_conta', deletarConta)

module.exports = contas