const { Router } = require('express')
const {
  configMap,
  pod,
  deployment,
  service,
  namespace,
} = require('../handlers')

const router = Router()

router.get('/pod/:namespace', pod.get)

router.post('/configMap', configMap.create)
router.get('/configMap/:namespace/:name', configMap.get)
router.put('/configMap', configMap.update)

router.post('/namespace', namespace.create)
router.get('/namespace/:name?', namespace.get)
router.delete('/namespace/:name', namespace.remove)
router.put('/namespace/:name', namespace.update)

router.post('/deployment', deployment.create)
router.put('/deployment/:name', deployment.update)
router.delete('/deployment', deployment.remove)
router.get('/deployment/:namespace/:name?', deployment.get)

router.post('/service', service.create)
router.delete('/service', service.remove)
router.get('/service/:namespace/:name', service.get)

module.exports = router
