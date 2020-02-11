const express = require('express')
const router = express.Router()

const { createTag } = require('./../controllers/Tag')

// Create tag
router.post('/create', createTag)

module.exports = router
