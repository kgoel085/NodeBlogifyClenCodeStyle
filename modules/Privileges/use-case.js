const CRUD = require('../../services/CRUD')
const { UniqueConstraint } = require('./../../helpers/error')

class Privilege extends CRUD {
  constructor (db, schema) {
    super(db, 'permissions', schema)
  }

  // Create a privilege
  async createPrivilege (dataObj = {}) {
    const prevObj = this.schema(dataObj) // Validate data
    const { privilege } = prevObj

    // Check if privilege already exists or not
    const prvExists = await this.checkPrivilege(privilege, true)
    if (prvExists) throw new UniqueConstraint(`${privilege} (permission) already exists !`)

    // Store permission in db
    const result = await this.insert(prevObj)
    return result
  }

  // Check if a privilege exists
  async checkPrivilege (privilege = false, insertCase = true) {
    const { data } = await this.findOne({ privilege })
    if (data) return true

    return false
  }

  // Get privilege by id
  async getPrivilegeById (id = false) {
    const result = await this.findById(id)
    return result
  }
}

module.exports = Privilege
