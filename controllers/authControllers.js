const jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')
const User = require('../models/user')
const bcrypt = require("bcrypt");

require('dotenv').config()


exports.signup = async (req, res) => {
  const userExists = await User.findOne({email: req.body.email})
  const usernameExists = await User.findOne({username: req.body.username})
  if (userExists || usernameExists) 
    return res.status(403).json({
      error: "Email or Username is taken"
  });
  const user = await new User(req.body)
  await user.save()
  res.status(200).json({ message: "Signup success! Please login." })
}

exports.login = async (req, res, next) => {
  const user = await User.findOne({ where: {username: req.body.username }});
  if (user) {
    const password_valid = await bcrypt.compare(req.body.password, user.password);
    if (password_valid){
      token = jwt.sign({"id" : user.id, 'email' : user.email,  },process.env.JWT_SECRET)
      res.status(200).json({ token:token });
    } else {
      res.status(400).json({ error: 'Password Incorrect' })
    }
  } else {
    res.status(404).json({error: 'User does not exit' })
  }
}

// exports.login = (req, res) => {
//   const {email, password} = req.body
//   User.findOne({email}, (err, user) => {
//     if (err || !user) {
//       return res.status(401).json({
//         error: "User with that email does not exist. Please signup."
//       })
//     }
//     if (!user.authenticate(password)) {
//       return res.status(401).json({
//         error: "Email and password do not match."
//       })
//     }
//     const token = jwt.sign({_id: user.id}, process.env.JWT_SECRET) 
//     res.cookie('t', token, {expire: new Date() + 9999})
//     const {_id, fullName, username, email, imgId} = user
//     return res.json({token, user: { _id, email, fullName, username, imgId} })
//   })
// }

exports.signout = (req, res) => {
  res.clearCookie('t')
  return res.json({ message: "Signout success!" })
}

exports.requirelogin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], 
  userProperty: "auth",
});