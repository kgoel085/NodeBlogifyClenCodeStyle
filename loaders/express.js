const bodyParser = require('body-parser')

module.exports = app => {
  // Body parser
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  return app
}
