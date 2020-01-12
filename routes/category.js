const express = require('express')
const router = express.Router()
const { createCategory } = require('./../controllers/Category')

// Create category
router.post('/create', createCategory)

module.exports = router
