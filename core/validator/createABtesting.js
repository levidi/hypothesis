const Ajv = require('ajv')

const ajv = new Ajv()
require('ajv-keywords')(ajv, 'transform')

const schema = {
  type: 'object',
  properties: {
    namespace: { type: 'string' },
    deploymentName: { type: 'string' },
    serviceName: { type: 'string' },
    imageName: { type: 'string' },
    containerName: { type: 'string' },
    hosts: {
      type: 'array',
      items: {
        type: 'string',
        transform: ['trim'],
      },
    },
    headers: {
      type: 'object',

    },
    ports: { type: 'array' },
  },
  required: [
    'namespace',
    'deploymentName',
    'serviceName',
    'imageName',
    'containerName',
    'headers',
  ],
  additionalProperties: false,
}

const validate = ajv.compile(schema)

const createABtesting = async (req, res, next) => {
  const data = req.body
  const valid = validate(data)
  if (!valid)
    return res.status(400).send(validate.errors)
  return next()
}

module.exports = createABtesting
