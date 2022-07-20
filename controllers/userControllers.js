const jwt = require('jsonwebtoken')
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
    }).select("fullName username email location gender dateOfBirth bio skillInterests updated created imgId")
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

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const { _id } = jwt.verify(token, process.env.JWT_SECRET);

  await User.findOne({_id }).exec(async (err, user) => {
    if(err){
      return res.status(401).json({
        success: false,
        message: 'An error occured, try again'
      });
    }
    const newPassword = user.encryptPassword(password)
    await User.findByIdAndUpdate(_id, {
      hashed_password: newPassword
    });
    return res.status(200).json({
      success: true,
      message: 'password updated successfully'
    });
  })  
}


exports.sendPasswordResetEmail = async (req, res) => {

  const user = await User.findOne({email: req.body.email});

  if(!user || !user.email){
    // this is intentional, so as to delay hackers
    return res.status(200).json({
      success: true,
      message: 'email sent succesfully'
    });
  }

  const API_KEY = process.env.MAILGUN_API_KEY;
  const DOMAIN = process.env.MAILGUN_DOMAIN;
  const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
    expiresIn: 600
  })

  const formData = require('form-data');
  const Mailgun = require('mailgun.js');

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({username: 'api', key: API_KEY});

  const messageData = {
    from: "ultralearnng@gmail.com",
    to: user.email,
    subject: "Password Reset",
    html:  `
      <div>
      <style>
        h1 { color: green; }
      </style>

      <h1>Click the link below to reset your password</h1>
      <p>
        Click <a style="color: blue;" href='${req.protocol}://${req.get('host')}/reset-password/${token}'>
        HERE</a>
      </p>
    </div>`
  };

  client.messages.create(DOMAIN, messageData)
  .then((response) => {
    // console.log(response);
    return res.status(200).json({
      success: true,
      message: 'email sent succesfully'
    });
  })
  .catch((err) => {
    console.error(err);
    return res.status(200).json({
      success: true,
      message: 'email sent succesfully'
    });
  });
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
  }).select('username fullName imgId')
}