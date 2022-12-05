const { Router } = require('express')
const { createABtesting, deleteABtesting } = require('../handlers')
const validator = require('../validator')

const router = Router()

router.post('/core/ab-testing', validator.createABtesting, createABtesting)
router.delete('/core/ab-testing', validator.deleteABtesting, deleteABtesting)
module.exports = router
