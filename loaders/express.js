const bodyParser = require('body-parser')
const routes = require('./../routes')

module.exports = app => {
  // Body parser
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // Express routes
  app.use(routes)

  return app
}
