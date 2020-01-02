const jsonwebtoken = require('jsonwebtoken')
const { secret, expiryTime } = require('./../config')

module.exports = {
  // Generate new token
  generate: (data = {}, options = {
    expiresIn: expiryTime
  }) => jsonwebtoken.sign(data, secret, { ...options }),

  // Verify token
  verify: (data = false) => jsonwebtoken.verify(data, secret),

  // Decode token
  decode: token => jsonwebtoken.decode(token)
}
