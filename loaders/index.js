// Database loader
const DbLoader = require('./database')

// Express app loader
const ExpressLoader = require('./express')

module.exports = async app => {
  // Load database
  await DbLoader()
  console.log('Database Initialized')

  // init. Express related methods
  await ExpressLoader(app)
  console.log('Express Initialized')
}
