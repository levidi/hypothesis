const request = require('request')

const baseURL = process.env.URL_K8S
const resource = (namespace) => `/apis/apps/v1/namespaces/${namespace}/deployments`

const serviceAccount = { ca: process.env.CA, auth: process.env.AUTH }

const create = ({ namespace, deployment }) => new Promise((resolve, reject) => {
  const options = {
    ...serviceAccount,
    json: deployment,
  }
  request.post(
    `${baseURL}${resource(namespace)}`,
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

const update = ({ namespace, deployment }, name) => new Promise((resolve, reject) => {
  const options = {
    ...serviceAccount,
    json: deployment,
  }
  request.put(
    `${baseURL}${resource(namespace)}/${name}`,
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
      console.info(`statusCode: ${response.statusCode}`)
      console.info(`body: ${body}`)
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
      console.info(`statusCode POST: ${response.statusCode}`)
      console.info(`body: ${body}`)
      return resolve({
        body,
        statusCode: response.statusCode,
      })
    },
  )
})

module.exports = {
  create, get, remove, update,
}
