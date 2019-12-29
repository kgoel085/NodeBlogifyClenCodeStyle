const { isRequired, validateEmail, validateString } = require('./../../helpers')

const validateObj = ({
  username = isRequired('username'),
  email = isRequired('email'),
  createdAt = new Date().getTime(),
  modifiedAt = null,
  isActive = true,
  ...OtherInfo
} = {}) => {
  username = validateString('username', username)
  email = validateEmail('email', email)

  return {
    username,
    email,
    createdAt,
    modifiedAt,
    isActive,
    ...OtherInfo
  }
}

const normalizeObj = ({
  username,
  email,
  createdAt,
  modifiedAt,
  confirmPassword,
  password,
  isActive,
  ...otherInfo
} = {}) => {
  // username = normalizeString(username)
  if (createdAt) createdAt = createdAt.toString()
  if (modifiedAt) modifiedAt = modifiedAt.toString()

  return {
    username,
    email,
    createdAt,
    modifiedAt,
    isActive,
    ...otherInfo
  }
}

module.exports = (userObj) => {
  // Validate Object
  const validObj = validateObj(userObj)

  // Normalize Object
  const normalizedObj = normalizeObj(validObj)

  return normalizedObj
}
