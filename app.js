const express = require('express')
const loaders = require('./loaders')
const config = require('./config')

const startServer = async () => {
  // Main app
  const app = express()

  // Load modules one by one
  await loaders(app)

  app.listen(config.PORT, '0.0.0.0', err => {
    if (err) return console.log('Error starting app')

    console.log(`Your app is ready to server on port ${config.PORT}`)
  })
}

// Start the server
startServer()
