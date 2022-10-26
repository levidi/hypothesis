const request = require('request')

const baseURL = process.env.URL_K8S

const serviceAccount = { ca: process.env.CA, auth: process.env.AUTH }

const get = ({ namespace }) => new Promise((resolve, reject) => {
  const options = {
    ...serviceAccount,
    json: true,
  }
  request.get(
    `${baseURL}/api/v1/namespaces/${namespace}/pods`,
    options,
    (error, response, body) => {
      if (error) {
        return reject(error)
      }
      console.info(`body: ${body}`)
      return resolve({
        body,
        statusCode: response.statusCode,
      })
    },
  )
})

module.exports = { get }
