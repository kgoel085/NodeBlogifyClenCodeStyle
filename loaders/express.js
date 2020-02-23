const bodyParser = require('body-parser')
const routes = require('./../routes')
const helmet = require('helmet')

module.exports = app => {
  // Helmet secure http headers
  app.use(helmet())

  // Body parser
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // Express routes
  app.use(routes)

  return app
}
