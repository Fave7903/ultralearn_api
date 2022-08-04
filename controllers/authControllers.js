const jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const db = require("../models");

require('dotenv').config()


exports.signup = async (req, res) => {
  const userExists = await db.user.findOne({where: {email: req.body.email}})
  const usernameExists = await db.user.findOne({where: {username: req.body.username}})
  if (userExists || usernameExists) 
    return res.status(403).json({
      error: "Email or Username is taken"
  });
  const result = await db.sequelize.sync()
  const user = await db.user.create(req.body)
  res.status(200).json({ message: "Signup success! Please login." })
}

exports.signin = async (req, res) => {
  const user = await db.user.findOne({where: {email: req.body.email}})
  const password_valid = await bcrypt.compare(req.body.password, user.password)
  if (user === null) {
    return res.status(401).json({
      error: "User with that email does not exist, Please signup"
    })
  }
  if (!password_valid) {
    return res.status(401).json({
      error: "Email and password do not match."
    })
  }
    const token = jwt.sign({_id: user.id}, process.env.JWT_SECRET) 
    res.cookie('t', token, {expire: new Date() + 9999})
    const {id, fullName, username, email, imgId} = user
    return res.json({token, user: {id, email, fullName, username, imgId} })
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

// exports.requirelogin = expressJwt({
//   secret: process.env.JWT_SECRET,
//   algorithms: ["HS256"], 
//   userProperty: "auth",
// });

exports.requirelogin = async (req, res, next) => {
  const { token } = req.body;
  try{
    const jwtValue = await jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = jwtValue;
    next();
  }catch(e){
    return res.status(401).json({
      error: 'Unauthorized, please register'
    });
  }

}