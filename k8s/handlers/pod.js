const pod = require('../pod')

const get = async ({ params }, res) => (
  pod.get(params)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
)

module.exports = {
  get,
}
