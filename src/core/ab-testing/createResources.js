const k8s = {
    crd: require('../../k8s/customResourceDefinition'),
    deploy: require('../../k8s/deployment'),
    svc: require('../../k8s/service'),
}

const istioVsTemplate = require('../../istio/template/virtual-service')

const tagAB = '-ab-testing'
const resourceName = '/networking.istio.io/v1alpha3/namespaces'

const createDeployService = (namespace, deployment, service) => {
    return Promise.all([
        k8s.deploy.create({ namespace, deployment }),
        k8s.svc.create({ namespace, service }),
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

module.exports = { createDeployService, createABtestingVirtualService }