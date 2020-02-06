const Post = require('./../modules/Post')
module.exports = {
  // Create post
  createPost: async (req, res, nxt) => {
    return Post.createPost(req.body)
      .then(resp => res.status(resp.statusCode).json(resp))
      .catch(err => nxt(err))
  }
}
