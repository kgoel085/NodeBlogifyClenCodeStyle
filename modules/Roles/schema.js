const { isRequired, validateString } = require('../../helpers')

const validateObj = ({
  role = isRequired('role'),
  createdBy = isRequired('createdBy'),
  isActive = true,
  createdAt = new Date().getTime(),
  modifiedAt = null,
  ...otherInfo
} = {}) => {
  role = validateString('role', role)
  createdBy = validateString('createdBy', createdBy)
  return {
    role,
    isActive,
    createdAt,
    modifiedAt,
    createdBy,
    ...otherInfo
  }
}

const normalizeObj = ({
  role,
  isActive,
  createdAt,
  modifiedAt,
  createdBy,
  ...otherInfo
} = {}) => {
  return {
    role,
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
