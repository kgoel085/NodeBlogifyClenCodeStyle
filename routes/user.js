const express = require('express')
const router = express.Router()

const { signup, login, refreshToken } = require('../controllers/User')
const { isLoggedIn } = require('./../middlewares')

router.post('/signup', signup) // User signup
router.post('/login', login) // User login
router.post('/refresh', refreshToken)
router.get('/secret', isLoggedIn, (req, res, nxt) => {
  res.send('Welcome logged in')
})

module.exports = router
