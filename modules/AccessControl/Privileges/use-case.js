const CRUD = require('../../../services/CRUD')
const defaults = require('./defaults')
const { isArray } = require('../../../helpers')

class Role extends CRUD {
  constructor (db, schema) {
    super(db, 'permissions', schema)
    this.checkDefaults(defaults)
  }

  async checkDefaults (defaults = []) {
    if (!defaults || !isArray(defaults)) return false

    // Add the default roles that are not present
    defaults.forEach(async permission => {
      const { data } = await this.findOne({ permission })
      if (!data) await this.insert(this.schema({ permission, createdBy: 'default' }))
    })
  }
}

module.exports = Role
