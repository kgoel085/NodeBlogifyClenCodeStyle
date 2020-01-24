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
  getAllCategories: (req, res, nxt) => {
    return Category
      .getCategories()
      .then(result => res.status(result.statusCode).json(result))
      .catch(err => nxt(err))
  },

  // Get category by id
  getCategoryById: (req, res, nxt) => {
    const dataObj = { ...req.params, ...req.query }
    return Category
      .getCategoriesById(dataObj)
      .then(data => res.status(data.statusCode).json(data))
      .catch(err => nxt(err))
  },

  // Update categories
  updateCategories: async (req, res, nxt) => {
    const { id: categoryId } = req.params
    const updateData = { ...req.body, _id: categoryId }
    try {
      const result = await Category.updateCategory(updateData)
      console.log(result)
    } catch (err) {
      console.log(err)
      nxt(err)
    }
  }
}
