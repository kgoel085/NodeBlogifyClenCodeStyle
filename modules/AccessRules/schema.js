const { isRequired, validateString, isType } = require('../../helpers')

const validateObj = ({
  role = isRequired('role'),
  permission = isRequired('permission'),
  createdBy = isRequired('createdBy'),
  isActive = true,
  createdAt = new Date().getTime(),
  modifiedAt = null,
  inherit = [],
  attributes = [],
  ...otherInfo
} = {}) => {
  role = validateString('role', role)
  permission = isType('array', permission, 'permission', true)
  attributes = isType('array', attributes, 'attributes')
  inherit = isType('array', inherit, 'inherit')
  createdBy = validateString('createdBy', createdBy)
  return {
    role,
    permission,
    isActive,
    createdAt,
    modifiedAt,
    inherit,
    createdBy,
    attributes,
    ...otherInfo
  }
}

const normalizeObj = ({
  permission,
  isActive,
  createdAt,
  modifiedAt,
  createdBy,
  ...otherInfo
} = {}) => {
  return {
    permission,
    isActive,
    createdAt,
    createdBy,
    modifiedAt,
    ...otherInfo
  }
}

module.exports = roleObj => {
  const validObj = validateObj(roleObj)
  const finalObj = normalizeObj(validObj)

  return finalObj
}
