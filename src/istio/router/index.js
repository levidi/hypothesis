const { Router } = require('express')
const { create } = require('../handlers')

const router = Router()

router.post('/virtualService', create)

module.exports = router
