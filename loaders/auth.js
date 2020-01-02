const passport = require('passport')
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')
const { secret } = require('./../config')
const UserModel = require('./../modules/User')

module.exports = async app => {
  // JWT Passport Strategy
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
  }, async (payload, done) => {
    try {
      const user = await UserModel.findOne({ _id: payload.sub })
      if (!user) return done(null, false) // If user is not present

      done(null, user)
    } catch (err) {
      done(err, false)
    }
  }))

  return app
}
