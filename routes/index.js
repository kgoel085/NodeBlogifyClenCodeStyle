const express = require('express')
const router = express.Router()
const { isLoggedIn, checkInputs } = require('./../middlewares')

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

// Error Handling
const Errors = require('./errors')
router.use(Errors)

router.get('/', (req, res, nxt) => {
  res.send('Welcome back....!')
})

module.exports = router
