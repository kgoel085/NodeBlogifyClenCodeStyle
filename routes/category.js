const express = require('express')
const router = express.Router()
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('./../controllers/Category')

// Mark category as inActive
router.delete('/:id', deleteCategory)

// Update single category
router.post('/:id', updateCategory)

// Create category
router.post('/create', createCategory)

// Get all categories
router.get('/all', getAllCategories)

// Get specific category
router.get('/:id', getCategoryById)

module.exports = router
