const express = require('express')
const router = express.Router()

// Access Control routes
const AccessControl = require('./accessControl')
router.use('/roles', AccessControl)

module.exports = router
