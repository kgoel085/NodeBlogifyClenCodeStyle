const { isRequired, validateString } = require('../../helpers')

const validateObj = ({
  privilege = isRequired('privilege'),
  createdBy = isRequired('createdBy'),
  isActive = true,
  createdAt = new Date().getTime(),
  modifiedAt = null,
  ...otherInfo
} = {}) => {
  privilege = validateString('privilege', privilege)
  createdBy = validateString('createdBy', createdBy)
  return {
    privilege,
    isActive,
    createdAt,
    modifiedAt,
    createdBy,
    ...otherInfo
  }
}

const normalizeObj = ({
  privilege,
  isActive,
  createdAt,
  modifiedAt,
  createdBy,
  ...otherInfo
} = {}) => {
  return {
    privilege,
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
