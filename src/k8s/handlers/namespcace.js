const namespace = require('../namespace')

const create = async ({ body }, res) => (
  namespace.create(body)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

const get = async ({ params }, res) => {
  const name = params.name ? params.name : ''
  return namespace.get(name)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
}

const remove = async ({ params }, res) => (
  namespace.remove(params)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

const update = async ({ body, params }, res) => (
  namespace.update(body, params.name)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

module.exports = { create, get, remove, update }
