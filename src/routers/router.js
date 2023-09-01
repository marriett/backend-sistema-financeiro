const express = require('express')
const contas = require('./contas.router')
const transacoes = require('./transacoes.router')

const router = express()

router.use(contas, transacoes)

module.exports = router