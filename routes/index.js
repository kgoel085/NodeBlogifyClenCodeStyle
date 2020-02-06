const express = require('express')
const router = express.Router()
const { isLoggedIn, checkInputs } = require('./../middlewares')
const { hasOwnProperty } = require('./../helpers')

// Check for inputs
router.use(checkInputs)

// User routes
const UserRoutes = require('./user')
router.use('/user', UserRoutes)

// Category routes
const CategoryRoutes = require('./category')
router.use('/category', isLoggedIn, CategoryRoutes)

// Posts routes
const PostRoutes = require('./post')
router.use('/post', isLoggedIn, PostRoutes)

// -------------------------------------------------- Error Handling

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
  return res.json(errorObj)
})

module.exports = router
