const abTesting = require('../ab-testing')

const k8s = {
  cm: require('../../k8s/configMap'),
  crd: require('../../k8s/customResourceDefinition'),
  deploy: require('../../k8s/deployment'),
  po: require('../../k8s/pod'),
  svc: require('../../k8s/service'),
}

const getDeployAndService = ({ namespace, deploymentName, serviceName }) => (
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

  try {

    const currentObjK8S = await getDeployAndService(body)
    if (!currentObjK8S.success)
      return res.status(500).send(currentObjK8S)

    const { deployment, service } = currentObjK8S
    const data = { ...body, deployment, service }

    const result = await Promise.resolve(abTesting.createABtesting(data))
    if (!result.success)
      return res.status(500).send(result)

    return res.status(201).send({ message: 'ab-testing created' })

  } catch (error) {
    return res.status(500).send(error)
  }
}

const deleteABtesting = async ({ body }, res) => {

  try {

    const result = await Promise.resolve(abTesting.deleteABtesting(body))
    if (!result.success)
      return res.status(500).send(result)

    return res.status(204).send()

  } catch (error) {
    return res.status(500).send(error)
  }
}

module.exports = { createABtesting, deleteABtesting }
