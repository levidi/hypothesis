const k8s = {
  cm: require('../../k8s/configMap'),
  crd: require('../../k8s/customResourceDefinition'),
  deploy: require('../../k8s/deployment'),
  po: require('../../k8s/pod'),
  svc: require('../../k8s/service'),
}

const istioVsTemplate = require('../../istio/template/virtual-service')
const abTesting = require('../ab-testing')

const createNewDeployment = async (namespace, deployment, containerName, imageName) => {
  deployment = abTesting.editDeploymentPropertys(deployment, containerName, imageName)
  return k8s.deploy.create({ namespace, deployment })
}

const createNewService = async (namespace, service, ports) => {
  service = abTesting.editServicePropertys(service, ports)
  return k8s.svc.create({ namespace, service })
}

const createABtestingVirtualService = async (namespace, hosts, serviceName, headers) => {
  const resourceName = `/networking.istio.io/v1alpha3/namespaces/${namespace}/virtualservices`
  const data = istioVsTemplate.make(namespace, hosts, serviceName, headers)
  return k8s.crd.create(resourceName, data)
    .then((result) => {
      if (result.statusCode !== 201) {
        return {
          success: false,
          message: 'error creating CRD virtual service to build ab testing',
          resultsK8S: { virtualService: result },
        }
      }
      return { success: true, virtualService: result.body }
    }).catch(() => ({ success: false }))
}

const createDeployService = (namespace, deployment, service, ports, containerName, imageName) => (
  Promise.all([
    createNewDeployment(namespace, deployment, containerName, imageName),
    createNewService(namespace, service, ports),
  ]).then((results) => {
    if (results[0].statusCode !== 201 || results[1].statusCode !== 201) {
      return {
        success: false,
        message: 'error creating new resources to build ab testing',
        resultsK8S: { deployment: results[0], service: results[1] },
      }
    }
    return { success: true, deployment: results[0].body, service: results[1].body }
  }).catch((error) => ({ success: false, error }))
)

const getDeployAndService = (namespace, deploymentName, serviceName) => (
  Promise.all([
    k8s.deploy.get({ namespace, name: deploymentName }),
    k8s.svc.get({ namespace, name: serviceName }),
  ]).then((results) => {
    if (results[0].statusCode !== 200 || results[1].statusCode !== 200) {
      return {
        success: false,
        message: 'to build ab testing it is necessary to find resource deployment and service primaries',
        resultsK8S: { deployment: results[0], service: results[1] },
      }
    }
    return { success: true, deployment: results[0].body, service: results[1].body }
  }).catch(() => ({ success: false }))
)

const createABtesting = async ({ body }, res) => {

  const { namespace,
    imageName, serviceName,
    deploymentName, containerName,
    headers, ports, hosts } = body

  try {

    const currentObjK8S = await getDeployAndService(namespace, deploymentName, serviceName)
    if (!currentObjK8S.success)
      return res.status(500).send(currentObjK8S)

    const { deployment, service } = currentObjK8S
    const newObjK8S = (
      await createDeployService(namespace, deployment, service, ports, containerName, imageName))

    if (!newObjK8S.success)
      return res.status(500).send(newObjK8S)

    const virtualService = (
      await createABtestingVirtualService(namespace, hosts, serviceName, headers))
    if (!virtualService.success)
      return res.status(500).send(virtualService)

    return res.status(201).send({ message: 'ab-testing created' })

  } catch (error) {
    return res.status(500).send(error)
  }
}

module.exports = {
  createABtesting,
}
