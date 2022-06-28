const User = require('../models/user')

exports.userByUsername = (req, res, next, username) => {
    User.findOne({username: req.params.username}).exec((err, user) => {
        if (err || !user) {
            return res.status(403).json({
                error: "This user does not exist"
            })
        }
        req.profile = user
        next()
    })
}

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
  }

exports.tempEmails = (req, res) => {
    User.find((err, users) => {
        if (err) {
          return res.status(400).json({error: err})
        }
        res.json(users)
      }).select("-_id email")
}