const service = require('../service')

const create = async ({ body }, res) => (
  service.create(body)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

const get = async ({ params }, res) => (
  service.get(params)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

const remove = async ({ body }, res) => (
  service.remove(body)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

module.exports = {
  create,
  get,
  remove,
}
