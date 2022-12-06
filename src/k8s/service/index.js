const request = require('request')

const baseURL = process.env.URL_K8S
const resource = (namespace) => `/api/v1/namespaces/${namespace}/services`

const serviceAccount = { ca: process.env.CA, auth: { bearer: process.env.AUTH } }

const create = ({ namespace, service }) => new Promise((resolve, reject) => {

  const options = {
    ...serviceAccount,
    json: service,
  }
  request.post(
    `${baseURL}${resource(namespace)}`,
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

const get = (data) => new Promise((resolve, reject) => {
  const { namespace, name } = data
  const options = {
    ...serviceAccount,
    json: true,
  }
  request.get(
    `${baseURL}${resource(namespace)}/${name}`,
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

const remove = (data) => new Promise((resolve, reject) => {
  const { namespace, name } = data
  const options = {
    ...serviceAccount,
    json: true,
  }
  request.delete(
    `${baseURL}${resource(namespace)}/${name}`,
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

module.exports = { create, get, remove }
