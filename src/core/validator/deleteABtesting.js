const Ajv = require('ajv')

const ajv = new Ajv()
require('ajv-keywords')(ajv, 'transform')

const schema = {
  type: 'object',
  properties: {
    namespace: { type: 'string' },
    deploymentName: { type: 'string' },
    serviceName: { type: 'string' },
  },
  required: [
    'namespace',
    'deploymentName',
    'serviceName',
  ],
  additionalProperties: false,
}

const validate = ajv.compile(schema)

const deleteABtesting = async (req, res, next) => {
  const data = req.body
  const valid = validate(data)
  if (!valid)
    return res.status(400).send(validate.errors)
  return next()
}

module.exports = deleteABtesting
