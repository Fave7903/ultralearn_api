const _ = require('lodash')
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

exports.allUsers = (req, res) => {
    User.find((err, users) => {
      if (err) {
        return res.status(400).json({error: err})
      }
      res.json(users)
    }).select("fullName username email location gender dateOfBirth bio skillInterests updated created")
  }

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
  }

exports.allUsers = (req, res) => {
User.find((err, users) => {
    if (err) {
    return res.status(400).json({error: err})
    }
    res.json(users)
}).select("fullName username email updated created dateOfBirth location gender bio skillInterests")
}

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id
    if (!authorized) {
      return res.status(403).json({
        error: "User is not authorized to perform this action"
      })
    }
  }

exports.updateUser = (req, res, next) => {
let user = req.profile
user = _.extend(user, req.body)
user.updated = Date.now()
user.save((err) => {
    if(err) {
    return res.status(400).json({error: "You are not authorized to perform this action"})
    }
    user.hashed_password = undefined
    user.salt = undefined
    res.json({ user })
})
}