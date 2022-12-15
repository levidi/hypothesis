require('./config/k8s')

const express = require('express')
const routers = require('./routers')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routers)

module.exports = app
