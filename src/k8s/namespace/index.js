const request = require('request')

const baseURL = process.env.URL_K8S

const serviceAccount = { ca: process.env.CA, auth: process.env.AUTH }

const get = (name) => new Promise((resolve, reject) => {
  const options = {
    ...serviceAccount,
    json: true,
  }
  request.get(
    `${baseURL}/api/v1/namespaces/${name}`,
    options,
    (error, response, body) => {
      if (error) {
        console.error(`error: ${error}`)
        return reject(error)
      }
      return resolve({
        body,
        statusCode: response.statusCode,
      })
    },
  )
})

const create = ({ name, labels }) => new Promise((resolve, reject) => {
  const options = {
    ...serviceAccount,
    json: {
      apiVersion: 'v1',
      kind: 'Namespace',
      metadata: {
        name,
        labels,
      },
    },
  }
  request.post(
    `${baseURL}/api/v1/namespaces`,
    options,
    (error, response, body) => {
      if (error) {
        console.error(`error POST: ${error}`)
        return reject(error)
      }
      return resolve({
        body,
        statusCode: response.statusCode,
      })
    },
  )
})

const remove = ({ name }) => new Promise((resolve, reject) => {
  const options = {
    ...serviceAccount,
    json: true,
  }
  request.delete(
    `${baseURL}/api/v1/namespaces/${name}`,
    options,
    (error, response, body) => {
      if (error) {
        console.error(`error POST: ${error}`)
        return reject(error)
      }
      return resolve({
        body,
        statusCode: response.statusCode,
      })
    },
  )
})

module.exports = { get, create, remove }
