const deployment = require('./deployment')
const pod = require('./pod')
const configMap = require('./configMap')
const service = require('./service')
const namespace = require('./namespcace')

module.exports = {
  deployment,
  pod,
  configMap,
  service,
  namespace,
}
