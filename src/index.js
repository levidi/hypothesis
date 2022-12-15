const app = require('./app')

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
