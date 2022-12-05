const crd = require('../customResourceDefinition')

const get = async ({ body }, res) => (
  crd.get(body)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

module.exports = {
  get,
}
