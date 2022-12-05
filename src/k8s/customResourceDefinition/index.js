const request = require('request')

const baseURL = process.env.URL_K8S
const serviceAccount = { ca: process.env.CA, auth: process.env.AUTH }

const create = (resourceName, data) => new Promise((resolve, reject) => {
  const options = {
    ...serviceAccount,
    json: data,
  }
  request.post(
    `${baseURL}/apis${resourceName}`,
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

const remove = (resourceName) => new Promise((resolve, reject) => {
  const options = {
    ...serviceAccount,
    json: true,
  }
  request.delete(
    `${baseURL}/apis${resourceName}`,
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

module.exports = { create, remove }
