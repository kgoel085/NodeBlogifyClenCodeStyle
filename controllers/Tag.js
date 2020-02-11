const Tag = require('./../modules/Tag')
module.exports = {
  // Create tag
  createTag: async (req, res, nxt) => {
    try {
      const tagData = req.body
      const result = await Tag.createTag(tagData)
      console.log(result)
    } catch (err) {
      console.log(err)
      nxt(err)
    }
  }
}
