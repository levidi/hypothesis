const k8sRouter = require('../k8s/router')
const istioRouter = require('../istio/router')
const coreRouter = require('../core/router')

module.exports = [k8sRouter, istioRouter, coreRouter]
