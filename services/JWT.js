const jsonwebtoken = require('jsonwebtoken')
const { secret, expiryTime } = require('./../config')

module.exports = {
  // Generate new token
  generate: (data = {}, options = {}) => jsonwebtoken.sign({ ...data }, secret, { ...options, expiresIn: expiryTime }),

  // Verify token
  verify: (data = false) => jsonwebtoken.verify(data, secret),

  // Decode token
  decode: token => jsonwebtoken.decode(token)
}
