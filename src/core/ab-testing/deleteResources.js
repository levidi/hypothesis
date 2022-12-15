const k8s = {
    crd: require('../../k8s/customResourceDefinition'),
    deploy: require('../../k8s/deployment'),
    svc: require('../../k8s/service'),
}

const tagAB = '-ab-testing'
const resourceName = '/networking.istio.io/v1alpha3/namespaces'

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

module.exports = { deleteDeployService, deleteVirtualService }