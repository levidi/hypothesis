const request = require('request')

const baseURL = process.env.URL_K8S

const serviceAccount = { ca: process.env.CA, auth: process.env.AUTH }

const get = ({ namespace, name }) => new Promise((resolve, reject) => {
  const options = {
    ...serviceAccount,
    json: true,
  }
  request.get(
    `${baseURL}/api/v1/namespaces/${namespace}/configmaps/${name}`,
    options,
    (error, response, body) => {
      if (error) {
        console.error(`error: ${error}`)
        return reject(error)
      }
      console.info(`statusCode: ${response.statusCode}`)
      console.info(`body: ${body}`)
      return resolve({
        body,
        statusCode: response.statusCode,
      })
    },
  )
})

const create = ({ namespace, name }) => new Promise((resolve, reject) => {
  const options = {
    ...serviceAccount,
    json: {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        namespace,
        name,
      },
      data: {
        'validate-profile.rego':
                        'package security\n\ndefault allow = false\n',
      },
    },
  }
  request.post(
    `${baseURL}/api/v1/namespaces/${namespace}/configmaps`,
    options,
    (error, response, body) => {
      if (error) {
        console.error(`error POST: ${error}`)
        return reject(error)
      }
      console.info(`statusCode POST: ${response.statusCode}`)
      console.info(`body: ${body}`)
      return resolve({
        body,
        statusCode: response.statusCode,
      })
    },
  )
})

module.exports = { get, create }
