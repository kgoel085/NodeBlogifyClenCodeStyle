const Post = require('./../modules/Post')
module.exports = {
  // Create post
  createPost: (req, res, nxt) => {
    return Post.createPost(req.body)
      .then(resp => res.status(resp.statusCode).json(resp))
      .catch(err => nxt(err))
  },

  // Get post details from id
  getPostById: (req, res, nxt) => {
    return Post.getPostById(req.params.id)
      .then(resp => res.status(resp.statusCode).json(resp))
      .catch(err => nxt(err))
  },

  // Get all post for given category
  getPostByCategory: async (req, res, nxt) => {
    return Post.getCategoryPost(req.params.id)
      .then(resp => res.status(resp.statusCode).json(resp))
      .catch(err => nxt(err))
  }
}
