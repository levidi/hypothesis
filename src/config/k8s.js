const { readFileSync } = require('fs')

const env = process.env.NODE_ENV || 'development'

const path = env === 'production' ? '/var/run/secrets/kubernetes.io/serviceaccount' : __dirname

const ca = readFileSync(`${path}/ca.crt`).toString()

const auth = readFileSync(`${path}/token`).toString()

if (ca && auth) {
  process.env.CA = ca
  process.env.AUTH = auth
} else {
  console.error('ca and token must be valid')
}
