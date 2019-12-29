const CRUD = require('../../services/CRUD')
const { RequiredParam, InvalidParam, UniqueConstraint } = require('./../../helpers/error')

class User extends CRUD {
  constructor (db, schema, encrypt) {
    // Set all the DB & Schema interface
    super(db, 'users', schema)
    // this.schema = schema
    this.encrypt = encrypt
  }

  // Register / Signup user to the system
  async signup (obj) {
    // Perform validations
    const userObj = await this.validateObj('signup', obj)

    // Encrypt password
    userObj.password = this.encrypt.makeHash(obj.password)

    // Register user with the system
    const { success, statusCode, data } = await this.insert(userObj)
    const returnData = { success, statusCode, data: null, message: 'Error Occurred' }

    // If operation was success
    if (success && data.length === 1) {
      returnData.data = data[0]
      returnData.message = 'Signup was successful'

      return returnData
    }

    throw new Error({ ...returnData })
  }

  // --------------------------------------------------------- //
  // Validate whole object for user related process
  async validateObj (callFrom, userObj) {
    switch (callFrom) {
      case 'signup':
        // Check for required password vars
        this.validatePassword(userObj, true)

        // Check for unique entry
        await this.checkUniqueEntry(userObj)
        break
    }

    return this.mapSchema(userObj)
  }

  // Check for password
  validatePassword (obj, signUp = false) {
    const { password, confirmPassword } = obj
    if (!password) throw new RequiredParam('password')

    // if request is from signup
    if (signUp) {
      // Check for confirm password
      if (!confirmPassword) throw new RequiredParam('Confirm password')

      // Check whether password matched
      if (password.toString() !== confirmPassword.toString()) throw new InvalidParam('Password doesn\'t match')
    }
  }

  // Check whether the entry is unique or not
  async checkUniqueEntry (obj) {
    const { username, email } = obj

    // Check records
    const { success: USuccess, data: UData } = await this.findOne({ username })
    if (USuccess && UData) throw new UniqueConstraint('Username already exists')

    const { success: ESuccess, data: EData } = await this.findOne({ email })
    if (ESuccess && EData) throw new UniqueConstraint('Email already exists')

    return true
  }
}

module.exports = User
