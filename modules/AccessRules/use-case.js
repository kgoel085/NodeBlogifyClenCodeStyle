const CRUD = require('./../../services/CRUD')
const { InvalidParam, UniqueConstraint } = require('./../../helpers/error')
const { isArray } = require('./../../helpers')

class AccessRules extends CRUD {
  constructor (db, schema, roles = null, privileges = null) {
    super(db, 'accessRules', schema)
    this.roles = roles
    this.privileges = privileges
  }

  // Create role rule
  async createRule (dataObj = {}) {
    const ruleObj = this.schema(dataObj) // Validate object

    // Validate the received data
    await this.validateData(ruleObj)

    const result = await this.insert(ruleObj)
    return result

    // Conditional permission ( Optional ), user can perform actions on public or it's own created resource
    // Attributes ( Optional ), user can only perform actions on these properties
  }

  // Perform the required checks
  async validateData (ruleObj = {}) {
    const { role, permission, inherit } = ruleObj

    // Check if role is valid or not
    await this.checkRole(role)

    // What permissions role have
    await this.checkPermissions(permission)

    // What further role can this role inherit
    await this.checkInheritance(inherit)

    // Check if rule already exists or not
    await this.checkRule(ruleObj)
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

  // Check if values in inheritance are valid or not
  async checkInheritance (inheritanceArr = []) {
    if (inheritanceArr && isArray(inheritanceArr, true)) {
      for (const role of inheritanceArr) {
        const { data } = await this.roles.getRoleById(role)
        if (!data) throw new InvalidParam('Invalid roles for Inheritance provided')
      }
    }
  }

  // Check if same rule already exists or not
  async checkRule (ruleObj) {
    const { permission, role } = ruleObj
    const { data } = await this.findOne({ role, permission })
    if (data) throw new UniqueConstraint('Same rule already exists')
  }
}

module.exports = AccessRules
