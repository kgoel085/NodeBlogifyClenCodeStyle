const express = require('express')
const router = express.Router()
const User = require('../controllers/user')

router.post('/signup', User.signup) // User signup
router.post('/login', User.login) // User login

module.exports = router
