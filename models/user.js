const mongoose = require('mongoose')
const { v1: uuidv1 } = require('uuid')
const { createHmac } = require('crypto')
const { ObjectId } = mongoose.Schema

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  username: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  location: String,
  gender: String,
  dateOfBirth: Date,
  bio: String,
  skillInterests: String,
  hashed_password: {
    type: String,
    required: true
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date, 
  following: [{
    type: ObjectId,
    ref: "user"
  }],
  followers: [{
    type: ObjectId,
    ref: "user"
  }]


  // photo: {
  //   data: Buffer,
  //   contentType: String
  // }
})

userSchema.virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = uuidv1()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password
  })

userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return createHmac('sha256', this.salt)
               .update(password)
               .digest('hex');
    } catch (err) {
      return "";
    }
  }
}

module.exports = mongoose.model("user", userSchema)