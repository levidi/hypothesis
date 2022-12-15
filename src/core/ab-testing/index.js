const jsonpatch = require('jsonpatch')
const istioVsTemplate = require('../../istio/template/virtual-service')

const k8s = {
  cm: require('../../k8s/configMap'),
  crd: require('../../k8s/customResourceDefinition'),
  deploy: require('../../k8s/deployment'),
  po: require('../../k8s/pod'),
  svc: require('../../k8s/service'),
}

const { editDeploymentPropertys, editServicePropertys } = require('./editPropertys')

const tagAB = '-ab-testing'
const resourceName = '/networking.istio.io/v1alpha3/namespaces'
const renameObjectPropertys = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) obj[key] += tagAB
  }
  return obj
}

// const editDeploymentPropertys = (deployment, containerName, imageName) => {
//   const patch = [
//     { op: 'remove', path: '/metadata/uid' },
//     { op: 'remove', path: '/metadata/resourceVersion' },
//     { op: 'remove', path: '/metadata/generation' },
//     { op: 'remove', path: '/metadata/creationTimestamp' },
//     { op: 'remove', path: '/metadata/managedFields' },

//     { op: 'remove', path: '/spec/revisionHistoryLimit' },
//     { op: 'remove', path: '/spec/progressDeadlineSeconds' },
//     { op: 'remove', path: '/status' },

//     { op: 'replace', path: '/metadata/name', value: `${deployment.metadata.name += tagAB}` },
//     {
//       op: 'replace',
//       path: '/spec/selector/matchLabels',
//       value: renameObjectPropertys(deployment.spec.selector.matchLabels),
//     },
//     {
//       op: 'replace',
//       path: '/spec/template/metadata/labels',
//       value: renameObjectPropertys(deployment.spec.template.metadata.labels),
//     },
//   ]
//   deployment.spec.template.spec.containers
//     .forEach((container) => {
//       if (container.name === containerName) {
//         container.image = imageName
//       }
//     })
//   return jsonpatch.apply_patch(deployment, patch)
// }

// const editServicePropertys = (service, ports) => {
//   renameObjectPropertys(service.spec.selector)
//   service.metadata.name += tagAB
//   service.spec.ports = ports
//   const patch = [
//     { op: 'remove', path: '/metadata/uid' },
//     { op: 'remove', path: '/metadata/resourceVersion' },
//     { op: 'remove', path: '/metadata/creationTimestamp' },
//     { op: 'remove', path: '/metadata/managedFields' },

//     { op: 'remove', path: '/spec/clusterIP' },
//     { op: 'remove', path: '/spec/clusterIPs' },
//     { op: 'remove', path: '/status' },
//   ]
//   return jsonpatch.apply_patch(service, patch)
// }

const createNewDeployment = async (namespace, deployment, containerName, imageName) => {
  deployment = editDeploymentPropertys(deployment, containerName, imageName)
  return k8s.deploy.create({ namespace, deployment })
}

const createNewService = async (namespace, service, ports) => {
  service = editServicePropertys(service, ports)
  return k8s.svc.create({ namespace, service })
}

const createDeployService = (data) => {
  const { namespace, deployment, service, ports, containerName, imageName } = data
  return Promise.all([
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
}

const createABtestingVirtualService = async ({ namespace, hosts, serviceName, headers }) => {
  const virtualServiceName = `vs-${serviceName}${tagAB}`
  const data = istioVsTemplate.make(namespace, hosts, serviceName, headers, virtualServiceName)
  return k8s.crd.create(`${resourceName}/${namespace}/virtualservices`, data)
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

const deleteVirtualService = async ({ namespace, serviceName }) => (
  k8s.crd.remove(`${resourceName}/${namespace}/virtualservices/vs-${serviceName}${tagAB}`)
    .then((result) => {
      if (result.statusCode !== 200) {
        return {
          success: false,
          message: 'error deleting CRD virtual service',
          resultsK8S: { virtualService: result },
        }
      }
      return { success: true, virtualService: result.body }
    }).catch(() => ({ success: false }))
)

const createABtesting = async (data) => {

  const newObjK8S = await createDeployService(data)
  if (!newObjK8S.success)
    return newObjK8S

  const virtualService = await createABtestingVirtualService(data)
  if (!virtualService.success)
    return virtualService

  return { success: true }
}

const deleteDeployService = (data) => {
  const { namespace, deploymentName, serviceName } = data
  return Promise.all([
    k8s.deploy.remove({ namespace, name: `${deploymentName}${tagAB}` }),
    k8s.svc.remove({ namespace, name: `${serviceName}${tagAB}` }),
  ]).then((results) => {
    if (results[0].statusCode !== 200 || results[1].statusCode !== 200) {
      return {
        success: false,
        message: 'error deleting resources ab testing',
        resultsK8S: { deployment: results[0], service: results[1] },
      }
    }
    return { success: true, deployment: results[0].body, service: results[1].body }
  }).catch((error) => ({ success: false, error }))
}

const deleteABtesting = async (data) => {
  const virtualService = await deleteVirtualService(data)
  if (!virtualService.success)
    return virtualService

  const removeObjK8S = await deleteDeployService(data)

  if (!removeObjK8S.success)
    return removeObjK8S

  return { success: true }
}

module.exports = { createABtesting, deleteABtesting }
