const express = require('express')
const router = express.Router()
const User = require('../controllers/user')

// User signup
router.post('/signup', User.signup)

module.exports = router
