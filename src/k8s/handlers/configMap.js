const configMap = require('../configMap')

const create = async ({ body }, res) => (
  configMap.create(body)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

const get = async ({ params }, res) => (
  configMap.get(params)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

const update = async ({ body }, res) => (
  configMap.update(body)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

module.exports = {
  create,
  get,
  update,
}
