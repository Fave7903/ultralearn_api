const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const postSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  postedBy: {
    type: ObjectId,
    ref: "user"
  },
  created: {
    type: Date,
    default: Date.now
  },
  postImgId: String,
  updated: Date,
  likes: [{
    type: ObjectId,
    ref: "user"
  }]
  // comments : [
  //   {
  //     text: String,
  //     created: {type: Date, default: Date.now},
  //     postedBy: {type: ObjectId, ref: "user"}
  //   }
  // ]
});

module.exports = mongoose.model("post", postSchema);