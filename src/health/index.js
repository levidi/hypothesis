const { Router } = require('express')

const router = Router()

const healthcheck = async (_req, res) => {

  const data = {
    uptime: process.uptime(),
    responsetime: process.hrtime(),
    message: 'OK',
    timestamp: Date.now(),
  }
  try {
    res.send(data)
  } catch (error) {
    data.message = error
    res.status(503).send(data)
  }
}

router.get('/health', healthcheck)

module.exports = router
