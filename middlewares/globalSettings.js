const cls = require('continuation-local-storage')
const { globalNamespace } = require('./../config')
module.exports = (req, res, nxt) => {
  const namespace = cls.getNamespace(globalNamespace || 'reqGlobals')

  namespace.bindEmitter(req)
  namespace.bindEmitter(res)

  namespace.run(function () {
    namespace.set('IP', req.ip)
    nxt()
  })
}
