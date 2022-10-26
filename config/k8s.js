const env = process.env.NODE_ENV || 'development'

if (env === 'production') {
  const { readFileSync } = require('fs')

  const ca = readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/ca.crt')
    .toString()

  const auth = {
    bearer: readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token')
      .toString(),
  }

  if (ca && auth) {
    process.env.CA = ca
    process.env.AUTH = auth
  } else {
    console.error('ca and token must be valid')
  }
}
