const express = require('express')
const router = require('./routers/router')

const app = express()
const PORT = 3000

app.use(express.json())
app.use(router)

app.listen(PORT, console.log(`Servidor rodando em: http://localhost:${PORT} 🚀`))