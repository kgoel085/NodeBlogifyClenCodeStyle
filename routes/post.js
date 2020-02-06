const express = require('express')
const router = express.Router()
const { createPost, getPostById, getPostByCategory } = require('./../controllers/Post')

// Create post
router.post('/create', createPost)

// Get post by category
router.get('/category/:id', getPostByCategory)

// Get post by id
router.get('/:id', getPostById)
module.exports = router
