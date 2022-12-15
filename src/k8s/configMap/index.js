const request = require('request')

const baseURL = process.env.URL_K8S

const serviceAccount = { ca: process.env.CA, auth: { bearer: process.env.AUTH } }

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
      return resolve({
        body,
        statusCode: response.statusCode,
      })
    },
  )
})

const create = (data) => new Promise((resolve, reject) => {
  const options = {
    ...serviceAccount,
    json: data
  }
  request.post(
    `${baseURL}/api/v1/namespaces/${namespace}/configmaps`,
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

const update = ({ namespace, name, data }) => new Promise((resolve, reject) => {
  const options = {
    ...serviceAccount,
    json: data,
  }
  request.put(
    `${baseURL}/api/v1/namespaces/${namespace}/configmaps/${name}`,
    options,
    (error, response, body) => {
      if (error) {
        console.error(`error PUT: ${error}`)
        return reject(error)
      }
      return resolve({
        body,
        statusCode: response.statusCode,
      })
    },
  )
})

module.exports = { get, create, update }
