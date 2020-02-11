const express = require('express')
const router = express.Router()
const { createPost, getPostById, getPostByCategory, updatePostData, getAllPost } = require('./../controllers/Post')

// Create post
router.post('/create', createPost)

// Get post by category
router.get('/category/:id', getPostByCategory)

// Get all posts
router.get('/all', getAllPost)

// Get post by id
router.get('/:id', getPostById)

// Update post data
router.put('/:id', updatePostData)

module.exports = router
