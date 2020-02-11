const Tag = require('./../modules/Tag')

module.exports = {
  // Create tag
  createTag: (req, res, nxt) => {
    return Tag.createTag(req.body)
      .then(resp => res.status(resp.statusCode).json(resp))
      .catch(err => { console.log(err); nxt(err) })
  },

  // Get all the tags
  getTags: (req, res, nxt) => {
    return Tag.getTags()
      .then(resp => res.status(resp.statusCode).json(resp))
      .catch(err => nxt(err))
  },

  // Get all the matching tags
  getMatchingTags: (req, res, nxt) => {
    return Tag.getMatchingTags(req.params.qry)
      .then(resp => res.status(resp.statusCode).json(resp))
      .catch(err => nxt(err))
  },

  // Get tag by id
  getTagById: (req, res, nxt) => {
    return Tag.getTagById(req.params.id)
      .then(resp => res.status(resp.statusCode).json(resp))
      .catch(err => nxt(err))
  }
}
