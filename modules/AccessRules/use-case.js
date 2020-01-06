const CRUD = require('./../../services/CRUD')
const { InvalidParam } = require('./../../helpers/error')

class AccessRules extends CRUD {
  constructor (db, schema, roles = null, privileges = null) {
    super(db, 'accessRules', schema)
    this.roles = roles
    this.privileges = privileges
  }

  // Create role rule
  async createRule (dataObj = {}) {
    const roleObj = this.schema(dataObj) // Validate object
    const { role, permission } = roleObj

    // Check if role is valid or not
    await this.checkRole(role)

    // What permissions role have
    await this.checkPermissions(permission)

    // What further role can this role inherit
    // Conditional permission ( Optional ), user can perform actions on public or it's own created resource
    // Attributes ( Optional ), user can only perform actions on these properties
  }

  // Check if all the permissions are valid or not
  async checkPermissions (permissions = []) {
    for (const permission of permissions) {
      const { data } = await this.privileges.getPrivilegeById(permission.toString())
      if (!data) throw new InvalidParam('Invalid privileges provided')
    }
  }

  // Check if role is valid or not
  async checkRole (roleId = false) {
    const { data } = await this.roles.getRoleById(roleId)
    if (!data) throw new InvalidParam('Role is invalid')
  }
}

module.exports = AccessRules
