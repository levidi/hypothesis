require('./config/k8s')

const express = require('express')
const routers = require('./routers')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routers)

const host = process.env.HOST
const port = process.env.PORT

if (host && port)
  app.listen(port, host, () => console.error(`${host}:${port}`))
else {
  console.error(`HOST and PORT parameters must be configured correctly 
    values: 
        HOST=${host}
        PORT=${port}`)
  process.exit()
}
