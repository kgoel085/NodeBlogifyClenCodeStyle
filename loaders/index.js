// Database loader
const DbLoader = require('./database')

// Express app loader
const ExpressLoader = require('./express')

// Passport auth loader
const PassportAuthLoader = require('./auth')

module.exports = async app => {
  // Load database
  await DbLoader()
  console.log('Database Initialized')

  // Init. Passport auth
  await PassportAuthLoader()
  console.log('Passport Auth Initialized')

  // Init. Express related methods
  await ExpressLoader(app)
  console.log('Express Initialized')
}
