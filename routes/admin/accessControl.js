const express = require('express')
const router = express.Router()

// Controller
const { createPrivilege, createRole, createRule } = require('./../../controllers/admin/AccessControl')

// Create a privilege
router.post('/createPrivilege', createPrivilege)

// Create a role
router.post('/createRole', createRole)

// Create a role rule
router.post('/createRule', createRule)

module.exports = router
