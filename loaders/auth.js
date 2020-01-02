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
    // Database Object
    const { makeId } = await UserModel.db
    const UserId = makeId(payload.sub)

    try {
      const { data: user } = await UserModel.findOne({ _id: UserId })
      if (!user) done(null, false)

      done(null, user)
    } catch (err) {
      done(err, false)
    }
  }))

  return app
}
