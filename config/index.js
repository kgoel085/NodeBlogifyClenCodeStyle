const EnvVar = process.env.NODE_ENV || 'development'

switch (EnvVar) {
  case 'development':
    module.exports = require('./dev')
    break
  case 'production':
    module.exports = require('./prod')
}
