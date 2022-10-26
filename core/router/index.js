const { Router } = require('express')
const { createABtesting } = require('../handlers')

const router = Router()

router.post('/core/ab-testing', createABtesting)

module.exports = router
