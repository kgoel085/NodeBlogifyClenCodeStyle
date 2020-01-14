const express = require('express')
const router = express.Router()
const { createCategory, getAllCategories } = require('./../controllers/Category')

// Create category
router.post('/create', createCategory)
router.get('/all', getAllCategories)

module.exports = router
