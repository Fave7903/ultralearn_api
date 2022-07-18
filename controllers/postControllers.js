const Post = require('../models/post')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "id username fullName bio imgId")
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id fullName username imgId')
    .exec((err, post) => {
      if(err || !post) {
        return res.status(400).json({
          error: err
        })
      }
      res.json(post)
      req.post = post
      next()
    })
  
}

exports.getPosts = (req, res) => {
  const posts = Post.find()
    .populate("postedBy", "_id username fullName bio imgId")
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id fullName username imgId')
    .select("_id body created postImgId likes")
    .sort({created: -1})
    .then((posts) => {
      res.json(posts)
    })
    .catch(err => console.log(err))
  }

exports.createPost = async(req, res, next) => {
    let post = await new Post(req.body)
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    post.postedBy = req.profile
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        })
      }
      res.json(result)
    })
  }

exports.postsByUser = (req, res) => {
  Post.find({postedBy: req.profile._id})
    .populate("postedBy", "_id username fullName bio imgId likes")
    .sort({created: -1})
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err
        })
      }
      res.json(posts)
    })
}

exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized"
    })
  }
  next()
}

exports.updatePost = (req, res, next) => {
  let post = req.post
  post = _.extend(post, req.body)
  post.updated = Date.now()
  post.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }
    res.json({ post })
  })
}

exports.deletePost = (req, res) => {
  let post = req.post
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }
    res.json({message: "Post succesfully deleted!"})
  })
}

exports.like = (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
  .exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }
    else {
      res.json(result)
    }
  })
}

exports.unlike = (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}}, {new: true})
  .exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }
    else {
      res.json(result)
    }
  })
}

// exports.comment = (req, res) => {
//   let comment = req.body.comment
//   comment.postedBy = req.body.userId

//   Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}}, {new: true})
//   .populate('comments.postedBy', '_id fullName username imgId')
//   .populate('postedBy', '_id fullName username imgId')
//   .exec((err, result) => {
//     if (err) {
//       return res.status(400).json({
//         error: err
//       })
//     }
//     else {
//       res.json(result)
//     }
//   })
// }

// exports.uncomment = (req, res) => {
//   let comment = req.body.comment
//   req.body.postId
//   Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: comment._id}}}, {new: true})
//   .populate('comments.postedBy', '_id fullName username imgId')
//   .populate('postedBy', '_id fullName username imgId')
//   .exec((err, result) => {
//     if (err) {
//       return res.status(400).json({
//         error: err
//       })
//     }
//     else {
//       res.json(result)
//     }
//   })
// }