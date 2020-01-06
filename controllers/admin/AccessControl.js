const AccessControl = require('./../../modules/AccessRules')

module.exports = {
  // Create a privilege
  createPrivilege: (req, res, nxt) => {
    const { _id: userId } = req.user
    const userInput = { ...req.body, createdBy: userId.toString() }

    return AccessControl.privileges.createPrivilege(userInput)
      .then(data => res.status(data.statusCode).send(data))
      .catch(err => nxt(err))
  },

  // Create a role
  createRole: (req, res, nxt) => {
    const { _id: userId } = req.user
    const userInput = { ...req.body, createdBy: userId.toString() }

    return AccessControl.roles.createRole(userInput)
      .then(data => res.status(data.statusCode).send(data))
      .catch(err => nxt(err))
  },

  // Create a role rule
  createRule: async (req, res, nxt) => {
    const { _id: userId } = req.user
    const userInput = { ...req.body, createdBy: userId.toString() }

    return AccessControl
      .createRule(userInput)
      .then(data => {
        console.log(data)
      })
      .catch(err => nxt(err))
  }
}
