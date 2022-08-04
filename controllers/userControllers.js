const db = require('../models')


exports.userByUsername = async (req, res, next, username) => {
    const user = await db.user.findOne({where: {username: req.params.username}})
    if (user === null) {
      return res.status(403).json({
        error: "This user does not exist"
      })
    }
    req.profile = user
    next()
}

exports.allUsers = async (req, res) => {
    try {
    const users = await db.user.findAll({attributes: {exclude: ['password']}})
    return res.status(200).json(users)
    } catch (error) {
      return res.json({error})
    }    
  }

exports.getUser = (req, res) => {
    req.profile.password = undefined
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

exports.updateUser = async (req, res, next) => {
let user = req.profile
try {
  await user.update(req.body)
  user.password = undefined
  return res.status(200).json(user)
} catch (error) {
  return res.json(error)
}

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
//         user.password = undefined
//         user.salt = undefined
//         res.json(user)
//       })
//     })
// }

exports.deleteUser = async (req, res, next) => {
  let user = req.profile
  try {
    await user.destroy()
    return res.status(200).json({
      message: "Your account has been deleted successfully"
    })
  } catch (error) {
    return res.json(error)
  }
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
    result.password = undefined
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
    result.password = undefined
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
  }).select('username fullName imgId')
}