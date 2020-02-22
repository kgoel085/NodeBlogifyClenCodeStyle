const { globalNamespace } = require('./../config')
const bodyParser = require('body-parser')
const routes = require('./../routes')
const helmet = require('helmet')
const cls = require('continuation-local-storage')

module.exports = app => {
  // Helmet secure http headers
  app.use(helmet())

  // Body parser
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // Global namespace
  cls.createNamespace(globalNamespace || 'reqGlobals')

  // Express routes
  app.use(routes)

  return app
}
