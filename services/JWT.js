const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('./../config')

module.exports = {
  // Generate new token
  generate: (data = {}) => jsonwebtoken.sign(data, secret),

  // Verify token
  verify: async (data = false) => {
    const result = await jsonwebtoken.verify(data, secret)
    return result
  },

  // Decode token
  decode: token => jsonwebtoken.decode(token)
}
