const express = require('express')
const routers = require('./routers')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routers)

const host = process.env.HOST
const port = process.env.PORT

app.listen(3000, () => console.error(`${host}:${port}`))
