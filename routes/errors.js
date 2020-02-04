const express = require('express')
const router = express.Router()
const { hasOwnProperty } = require('./../helpers')

// *** Not found page
router.use((req, res, nxt) => {
  const error = new Error('Not Found !')
  error.status = 404

  nxt(error)
})

// *** Unexpected errors
router.use((error, req, res, nxt) => {
  res.status(error.statusCode || 500)

  const errorObj = {
    error: true,
    message: (hasOwnProperty(error, 'message') && error.message) ? error.message : 'Error Occurred !'
  }

  // If any error data is there
  if (hasOwnProperty(error, 'data')) errorObj.data = error.data

  // Return error
  res.json(errorObj)
})

module.exports = router
