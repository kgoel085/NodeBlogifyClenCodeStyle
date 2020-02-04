const express = require('express')
const router = express.Router()
const { createPost } = require('./../controllers/Post')

// Create post
router.post('/create', createPost)

module.exports = router
