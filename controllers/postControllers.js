// const Post = require('../models/post')
const db = require("../models");
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

exports.postById = async (req, res, next, id) => {
  try {
    const post = await db.post.findOne({where: {id: id}})
      req.post = post
      next()
  } catch (error) {
    return res.json({error})
  }
}

exports.getPost = async (req, res) => {
  try{
    const post = await db.post.findOne({
      where: {
        id: req.params.postId
      }
    });
    return res.status(200).json({
      status: true,
      post
    });
  }catch(err){
    return res.status(500).json({
      message: err.message || "Some error occurred while fetching the post."
    });
  }
}

exports.getPosts = async (req, res) => {
  try{
    const post = await db.post.findAll();
    return res.status(200).json({
      status: true,
      post
    });
  }catch(err){
    return res.status(500).json({
      message: err.message || "Some error occurred while fetching the posts."
    });
  }
}

exports.create = async(req, res, next) => {
    try{
      // Create a POST
      const user = await db.user.findOne({where: {username: req.params.username}})
      const result = await user.createPost(req.body);
      return res.status(200).json({
        status: true,
        post: result
      });
    }catch(err){
      return res.status(500).json({
        message: err.message || "Some error occurred while creating the Tutorial."
      });
    }
  }

exports.postsByUser = async (req, res) => {
  try {
    const user = await db.user.findOne({where: {username: req.params.username}})
    const posts = await db.post.findAll({where: {userId: user.id}})
    return res.status(200).json(posts)
  } catch (error) {
    return res.json({message: error.message})
  }

}

exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.userId == req.auth._id
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

exports.comment = (req, res) => {
  let comment = req.body.comment
  comment.postedBy = req.body.userId

  Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}}, {new: true})
  .populate('comments.postedBy', '_id fullName username imgId')
  .populate('postedBy', '_id fullName username imgId')
  .sort({created: -1})
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

exports.uncomment = (req, res) => {
  let comment = req.body.comment
  req.body.postId
  Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: comment._id}}}, {new: true})
  .populate('comments.postedBy', '_id fullName username imgId')
  .populate('postedBy', '_id fullName username imgId')
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