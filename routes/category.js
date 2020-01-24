const express = require('express')
const router = express.Router()
const { createCategory, getAllCategories, getCategoryById, updateCategories } = require('./../controllers/Category')

// Update category
router.post('/:id', updateCategories)

// Create category
router.post('/create', createCategory)

// Get all categories
router.get('/all', getAllCategories)

// Get specific category
router.get('/:id', getCategoryById)

module.exports = router
