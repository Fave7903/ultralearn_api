// const Post = require('../models/post')
const db = require("../models");
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

exports.postById = async (req, res, next, id) => {
  try {
    const post = await db.post.findOne({where: {id: id}, 
      order: [[db.comment, 'createdAt', 'DESC']],
      include: [
        {
        model: db.user,
        attributes: ['id', 'fullName', 'username', 'bio', 'imgId']
      },
      {
        model: db.comment,
        include: {
          model: db.user,
          attributes: ['id', 'fullName', 'username', 'bio', 'imgId']
        }
      }
    ]})
      req.post = post
      next()
  } catch (error) {
    return res.json({error})
  }
}

exports.getPost = (req, res) => {
  try{
    return res.status(200).json(req.post);
  }catch(err){
    return res.status(500).json({
      message: err.message || "Some error occurred while fetching the post."
    });
  }
}

exports.getPosts = async (req, res) => {
  try{
    const posts = await db.post.findAll({
      include: [
      {
        model: db.user,
        attributes: ['id', 'fullName', 'username', 'bio', 'imgId']
      },
      {
        model: db.comment,
        include: {
          model: db.user,
          attributes: ['id', 'fullName', 'username', 'bio', 'imgId']
        }
      }
    ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(posts);
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
    const posts = await db.post.findAll({where: {userId: user.id}, include: [
      {
        model: db.user,
        attributes: ['id', 'fullName', 'username', 'bio', 'imgId']
      },
      {
        model: db.comment,
        include: {
          model: db.user,
          attributes: ['id', 'fullName', 'username', 'bio', 'imgId']
        }
      }
    ]})
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

exports.updatePost = async (req, res, next) => {
  try{
    const post = req.post
    await post.update(req.body)
    return res.status(200).json(post)
  }catch (error){
    return res.json({message: error.message})
  }
  // let post = req.post
  // post = _.extend(post, req.body)
  // post.updated = Date.now()
  // post.save((err) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: err
  //     })
  //   }
  //   res.json({ post })
  // })
}

exports.deletePost = async (req, res) => {
  try {
    const post = req.post
    await post.destroy()
    return res.status(200).json({Message: 'Post deleted successfully'})
  } catch (error) {
    return res.json({message: error.message})
  }
}


exports.like = async (req, res) => {

  const like = await db.like.create(req.body)
  const post = await db.post.findOne({where: {id: req.body.postId}})
  const likes = await db.like.findAll({where: {postId: req.body.postId}})
  post.update({
    likes_len: likes.length
  })
  return res.json(like)


  // Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
  // .exec((err, result) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: err
  //     })
  //   }
  //   else {
  //     res.json(result)
  //   }
  // })
}

exports.unlike = async (req, res) => {

  const like = await db.like.findOne({where: {userId: req.body.userId, postId: req.body.postId}})
  like.destroy()
  res.json({message: "unliked"})
  // Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}}, {new: true})
  // .exec((err, result) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: err
  //     })
  //   }
  //   else {
  //     res.json(result)
  //   }
  // })
}

exports.comment = async (req, res) => {
  // let comment = req.body.comment
  // comment.postedBy = req.body.userId

  const comment = await db.comment.create(req.body)
  const post = await db.post.findOne({where: {id: req.body.postId}})
  const comments = await db.comment.findAll({where: {postId: req.body.postId}})
  post.update({
    comments_len: comments.length
  })
  return res.json(comment)

  // Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}}, {new: true})
  // .populate('comments.postedBy', '_id fullName username imgId')
  // .populate('postedBy', '_id fullName username imgId')
  // .sort({created: -1})
  // .exec((err, result) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: err
  //     })
  //   }
  //   else {
  //     res.json(result)
  //   }
  // })
}

exports.postComments = async (req, res) => {
  try {
    const comments = await db.comment.findAll({where: {postId: req.params.postId}})
    return res.status(200).json(comments)
  } catch (error) {
    return res.status(500).json({error})
  }

}

// exports.uncomment = async (req, res) => {



  // let comment = req.body.comment
  // req.body.postId
  // Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: comment._id}}}, {new: true})
  // .populate('comments.postedBy', '_id fullName username imgId')
  // .populate('postedBy', '_id fullName username imgId')
  // .exec((err, result) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: err
  //     })
  //   }
  //   else {
  //     res.json(result)
  //   }
  // })
// }