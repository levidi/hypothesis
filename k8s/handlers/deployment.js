const deployment = require('../deployment')

const create = async ({ body }, res) => (
  deployment.create(body)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

const update = async ({ body, params }, res) => (
  deployment.update(body, params.name)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

const get = async ({ params }, res) => {
  const name = params.name ? params.name : ''
  const { namespace } = params
  deployment.get({ namespace, name })
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
}

const remove = async ({ body }, res) => (
  deployment.remove(body)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

module.exports = {
  create,
  get,
  remove,
  update,
}
