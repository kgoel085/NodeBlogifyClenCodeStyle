const { isRequired, validateString } = require('../../../helpers')

const validateObj = ({
  permission = isRequired('permission'),
  createdBy = isRequired('createdBy'),
  isActive = true,
  createdAt = new Date().getTime(),
  modifiedAt = null,
  ...otherInfo
} = {}) => {
  permission = validateString('permission', permission)
  createdBy = validateString('createdBy', createdBy)
  return {
    permission,
    isActive,
    createdAt,
    modifiedAt,
    createdBy,
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
