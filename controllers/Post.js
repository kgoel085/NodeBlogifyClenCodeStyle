const Post = require('./../modules/Post')
module.exports = {
  // Create post
  createPost: (req, res, nxt) => {
    return Post.createPost(req.body)
      .then(resp => res.status(resp.statusCode).json(resp))
      .catch(err => nxt(err))
  },

  // get all posts
  getAllPost: (req, res, nxt) => {
    return Post.getAllPost()
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
  getPostByCategory: (req, res, nxt) => {
    return Post.getCategoryPost(req.params.id)
      .then(resp => res.status(resp.statusCode).json(resp))
      .catch(err => nxt(err))
  },

  // Update post data
  updatePostData: async (req, res, nxt) => {
    const postId = req.params.id
    const data = { ...req.body, _id: postId }
    return Post.updatePost(data)
      .then(resp => res.status(resp.statusCode).json(resp))
      .catch(err => nxt(err))
  }
}
