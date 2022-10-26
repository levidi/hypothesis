const virtualService = require('../template/virtual-service')
const crd = require('../../k8s/customResourceDefinition')

const baseResourceName = '/networking.istio.io/v1alpha3/namespaces'

const create = async ({ body }, res) => {
  const resourceName = `${baseResourceName}/${body.namespace}/virtualservices`
  const data = virtualService.make(body)

  crd.create(resourceName, data)
    .then((result) => res.status(result.statusCode).send(result.body))
    .catch(({ code, message }) => res.status(code).json(message))
}

module.exports = {
  create,
}
