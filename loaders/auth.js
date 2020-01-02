const passport = require('passport')
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')
const { secret } = require('./../config')
const UserModel = require('./../modules/User')

const errorMsg = 'Unauthorized access'
module.exports = async app => {
  // JWT Passport Strategy
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
    passReqToCallback: true
  }, async (request, payload, done) => {
    // const { req, res } = request
    try {
      // Database Object
      const { makeId } = await UserModel.db

      const UserId = makeId(payload.sub)
      const user = await UserModel.findOne({ _id: UserId })
      if (!user) done(null, false, errorMsg)

      done(null, user)
    } catch (err) {
      done(err, false, err.message)
    }
  }))

  return app
}
