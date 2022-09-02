const db = require('../models')
const userService = require("../services/userService")
const { Op } = require('sequelize')

exports.userByUsername = async (req, res, next, username) => {
  const user = await db.user.findOne({ where: { username: username }, include: [
    {model: db.user, as: 'myfollowers', attributes: ['id', 'fullName', 'username', 'imgId']},
    {model: db.user, as: 'myfollowings', attributes: ['id', 'fullName', 'username', 'imgId']}
  ] })
  if (user === null) {
    return res.status(403).json({
      error: "This user does not exist"
    })
  }
  const userFollowers = await db.follower.findAll({where: {userId: user.id}})
  const userFollowing = await db.follower.findAll({where: {followerId: user.id}})
  user.update({
    followers_len: userFollowers.length,
    following_len: userFollowing.length
  })
  req.profile = user
  next()
}

exports.allUsers = async (req, res) => {
  try {
    const users = await db.user.findAll({ attributes: { exclude: ['password'] } })
    return res.status(200).json(users)
  } catch (error) {
    return res.json({ error })
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

exports.follow = async (req, res, next) => {
  const followed_userid = req.params.userid


  const userid = req.body.userId; 


  // verify user can be followed 
  let status_check = await userService.isFollowed(followed_userid, userid)
  if (status_check) {
    console.log(status_check)
    res.status(200).json({
      status: false,
      message: "user already followed"
    })

  } else {
    const newUser = await db.user.findOne({where: {id: followed_userid}, include: [
      {model: db.user, as: 'myfollowers', attributes: ['id', 'fullName', 'username', 'imgId']},
      {model: db.user, as: 'myfollowings', attributes: ['id', 'fullName', 'username', 'imgId']}
    ]})

    
    userService.followable(followed_userid, userid).then(
      async (user) => {

        if (user) {
          let add_user = await userService.addFollower(followed_userid, userid)
          const userFollowers = await db.follower.findAll({where: {userId: followed_userid}})
          const userFollowing = await db.follower.findAll({where: {followerId: followed_userid}})
          newUser.update({
            followers_len: userFollowers.length,
            following_len: userFollowing.length
          })
          res.status(200).json(newUser)
        } else {
          return res.status(401).json({
            status: false,
            message: "Cannot follow user at this time."
          })
        }
      }
    )

  }
}


exports.unfollow = async (req, res, next) => {
  const followed_userid = req.params.userid
  const token = req.header('token')


  const userid = req.body.userId;
  const newUser = await db.user.findOne({where: {id: followed_userid}, include: [
    {model: db.user, as: 'myfollowers', attributes: ['id', 'fullName', 'username', 'imgId']},
    {model: db.user, as: 'myfollowings', attributes: ['id', 'fullName', 'username', 'imgId']}
  ]})
    let unfollow_user = await userService.doUnFollower(followed_userid, userid)
    const userFollowers = await db.follower.findAll({where: {userId: followed_userid}})
    const userFollowing = await db.follower.findAll({where: {followerId: followed_userid}})
    newUser.update({
      followers_len: userFollowers.length,
      following_len: userFollowing.length
    })

    if (unfollow_user) {

      res.status(200).json(newUser)
    } else {
      return res.status(401).json({
        status: false,
        message: "failed to unfollow user at this time."
      })
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

// exports.addFollowing = (req, res, next) => {
//   User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId } }, (err, result) => {
//     if (err) {
//       return res.status(400).json({
//         error: err
//       })
//     }
//     next()
//   })
// }


// remove follow unfollow

// exports.removeFollowing = (req, res, next) => {
//   User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId } }, (err, result) => {
//     if (err) {
//       return res.status(400).json({
//         error: err
//       })
//     }
//     next()
//   })
// }

exports.findPeople = async (req, res) => {
  let followingArr = []
  let following = req.profile.myfollowings
  following.forEach(user => {
    followingArr.push(user.id)
  });
  followingArr.push(req.profile.id)
  let users = await db.user.findAll({where: {
      id: {[Op.notIn]: followingArr}
  }, attributes: ['id', 'fullName', 'username', 'imgId', 'bio']})
  return res.json(users)


  // User.find({ _id: { $nin: following } }, (err, users) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: err
  //     })
  //   }
  //   res.json(users)
  // }).select('username fullName imgId')
}