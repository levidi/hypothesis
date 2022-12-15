const { editDeploymentPropertys, editServicePropertys } = require('./editPropertys')

const resources = {
  create: require('./createResources'),
  delete: require('./deleteResources')
}

const createABtesting = async (data) => {

  const service = editServicePropertys(data.service, data.ports)
  const deployment = editDeploymentPropertys(data.deployment, data.containerName, data.imageName)

  const newObjK8S = await resources.create.createDeployService(data.namespace, deployment, service)

  if (!newObjK8S.success)
    return newObjK8S

  const virtualService = await resources.create.createABtestingVirtualService(data)
  if (!virtualService.success)
    return virtualService

  return { success: true }
}

const deleteABtesting = async (data) => {
  const virtualService = await resources.delete.deleteVirtualService(data)
  if (!virtualService.success)
    return virtualService

  const removeObjK8S = await resources.delete.deleteDeployService(data)

  if (!removeObjK8S.success)
    return removeObjK8S

  return { success: true }
}

module.exports = { createABtesting, deleteABtesting }
