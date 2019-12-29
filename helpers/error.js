module.exports = {
  InvalidParam: class InvalidParam extends Error {
    constructor (param) {
      super(`${param}`)

      this.statusCode = 400
      this.error = true
      if (Error.captureStack) Error.captureStackTrace(this, InvalidParam)
    }
  },

  RequiredParam: class RequiredParam extends Error {
    constructor (param) {
      super(`${param} cannot be either null or undefined`)

      this.statusCode = 400
      this.error = true
      if (Error.captureStack) Error.captureStackTrace(this, RequiredParam)
    }
  },

  UniqueConstraint: class UniqueConstraint extends Error {
    constructor (param) {
      super(param)

      this.statusCode = 409
      this.error = true
      if (Error.captureStack) Error.captureStackTrace(this, UniqueConstraint)
    }
  }
}
