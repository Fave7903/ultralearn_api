const mongoose = require('mongoose')
const { v1: uuidv1 } = require('uuid')
const { createHmac } = require('crypto');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  username: String,
  email: {
    type: String,
    trim: true,
    required: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date
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