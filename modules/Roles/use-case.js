const CRUD = require('../../services/CRUD')
const { UniqueConstraint } = require('./../../helpers/error')

class Role extends CRUD {
  constructor (db, schema) {
    super(db, 'roles', schema)
  }

  // Create a role
  async createRole (dataObj = {}) {
    const roleObj = this.schema(dataObj) // Validate data
    const { role } = roleObj

    // Check if role already exists or not
    await this.checkRole(role)

    // Store permission in db
    const result = await this.insert(roleObj)
    return result
  }

  // Check if a role exists
  async checkRole (role = false) {
    const { data } = await this.findOne({ role })
    if (data) throw new UniqueConstraint(`${role} (role) already exists !`)

    return data
  }

  // Get role by id
  async getRoleById (id = false) {
    const result = await this.findById(id)
    return result
  }
}

module.exports = Role
