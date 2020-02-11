const CRUD = require('../../services/CRUD')
const { UniqueConstraint, InvalidParam } = require('../../helpers/error')
// const { isType } = require('../../helpers')

class Tag extends CRUD {
  constructor (db = null, schema = null) {
    super(db, 'tags', schema)
  }

  // Create tags
  async createTag (obj = {}) {
    obj = this.schema(obj, true)

    const { name } = obj

    // Check if tag already exists
    const { data: nameExists } = await this.checkForValue(name, 'name', false, true)
    if (nameExists) throw new UniqueConstraint(`Tag with name (${name}) already exists !`)

    const result = this.insert(obj)
    return result
  }

  // Get all the tags
  async getTags () {
    const result = await this.findAll({})
    return result
  }

  // Get all the matching tags
  async getMatchingTags (name = null) {
    if (!name) throw new InvalidParam('Please provide a term to search !')

    const qry = new RegExp(name, 'i')
    const result = await this.findAll({ name: qry })
    return result
  }

  // Get tag details by ID
  async getTagById (id = null) {
    if (!id) throw new InvalidParam('Please provide a id to proceed !')

    // Get the tag with id
    const result = await this.checkForValue(id, 'tag', true, false)
    return result
  }
}

module.exports = Tag
