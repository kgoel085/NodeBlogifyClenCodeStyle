const Category = require('../modules/Category')

module.exports = {
  // Create category
  createCategory: (req, res, nxt) => {
    const { body } = req

    return Category
      .createCategory(body)
      .then(result => res.status(result.statusCode).json(result))
      .catch(err => nxt(err))
  },

  // Get all categories
  getAllCategories: async (req, res, nxt) => {
    return Category
      .getCategories()
      .then(result => res.status(result.statusCode).json(result))
      .catch(err => nxt(err))
  }
}
