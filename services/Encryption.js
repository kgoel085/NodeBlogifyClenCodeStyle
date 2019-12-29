const bcrypt = require('bcryptjs')

module.exports = {
  // Encrypt / Hash a string
  makeHash: str => {
    return bcrypt.hashSync(str, 12)
  },

  // Compare string with hashed string
  compareString: (str, hashedStr) => {
    return bcrypt.compareSync(str, hashedStr)
  }
}
