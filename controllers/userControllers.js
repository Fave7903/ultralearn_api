const _ = require('lodash')
const User = require('../models/user')
const formidable = require('formidable')
const fs = require('fs')

exports.userByUsername = (req, res, next, username) => {
    User.findOne({username: req.params.username})
    .populate('following', '_id username fullName bio, imgId')
    .populate('followers', '_id username fullName bio, imgId')
    .exec((err, user) => {
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
    }).select("fullName username email location gender dateOfBirth bio skillInterests updated created, imgId")
  }

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
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


// exports.updateUser = (req, res, next) => {
//     let form = new formidable.IncomingForm()
//     form.keepExtensions = true
//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         res.status(400).json({
//           error: "Photo could not be uploaded"
//         })
//       }
//       // save user
//       let user = req.profile
//       user = _.extend(user, fields)
//       user.updated = Date.now()

//       if(files.photo) {
//         user.photo.data = fs.readFileSync(files.photo.path)
//         user.photo.contentType = files.photo.type
//       }
//       user.save((err, result) => {
//         if (err) {
//           return res.status(400).json({
//             error: err
//           })
//         }
//         user.hashed_password = undefined
//         user.salt = undefined
//         res.json(user)
//       })
//     })
// }

exports.deleteUser = (req, res, next) => {
  let user = req.profile
  user.remove((err, user) => {
    if (err) {
      return res.status(400).json({error: err})
    }
    user.hashed_password = undefined
    user.salt = undefined
    res.json({ message: "Your account has been deleted successfully!" })
  })
}

// follow unfollow

exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(req.body.userId, {$push: {following: req.body.followId}}, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }
    next()
  })
}

exports.addFollower = (req, res) => {
  User.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}}, {new:true})
  .populate('following', '_id username fullName bio, imgId')
  .populate('followers', '_id username fullName bio, imgId')
  .exec((err, result) => {
    if (err) {
      return  res.status(400).json({
        error: err
      })
    }
    result.hashed_password = undefined
    result.salt = undefined
    res.json(result)
  })
}


// remove follow unfollow

exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}}, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }
    next()
  })
}

exports.removeFollower = (req, res) => {
  User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}}, {new:true})
  .populate('following', '_id username fullName bio, imgId')
  .populate('followers', '_id username fullName bio, imgId')
  .exec((err, result) => {
    if (err) {
      return  res.status(400).json({
        error: err
      })
    }
    result.hashed_password = undefined
    result.salt = undefined
    res.json(result)
  })
}


exports.findPeople = (req, res) => {
  let following = req.profile.following
  following.push(req.profile._id)
  User.find({_id: {$nin: following}}, (err, users) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }
    res.json(users)
  }).select('username fullName, imgId')
}