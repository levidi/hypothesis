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

const update = async ({ body }, res) => {
  const { metadata: { namespace, name } } = body
  return configMap.update(namespace, name, body)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
}

const remove = async ({ body }, res) => (
  configMap.remove(body)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

module.exports = {
  create,
  get,
  update,
  remove
}
