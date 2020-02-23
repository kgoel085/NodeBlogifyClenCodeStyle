const { globalNamespace } = require('./../config')
const { hasOwnProperty, resetNameSpace } = require('./../helpers')

module.exports = (req, res, nxt) => {
  // Request global vars
  const namespace = globalNamespace || 'reqGlobals'
  if (!hasOwnProperty(global, namespace)) global[namespace] = {}

  // Request IP
  global[namespace].IP = req.ip

  // Clear global namespace, when response is sent back
  res.on('finish', resetNameSpace)

  nxt()
}
