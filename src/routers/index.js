const k8sRouter = require('../k8s/router')
const istioRouter = require('../istio/router')
const coreRouter = require('../core/router')
const health = require('../health')

module.exports = [k8sRouter, istioRouter, coreRouter, health]
