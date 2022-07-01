const express = require('express')
const { requireSignin } = require('../controllers/authControllers')
const { userByUsername } = require('../controllers/userControllers')
const { createPostValidator } = require('../validator')
const { getPosts, createPost, postsByUser, postById, isPoster, updatePost, deletePost } = require('../controllers/postControllers')
const router = express.Router()

router.get('/posts', getPosts)

router.post('/post/new/:username', requireSignin, createPost, createPostValidator)

router.get('/posts/by/:username', requireSignin, postsByUser)
router.put('/post/:postId', requireSignin, isPoster, updatePost)
router.delete('/post/:postId', requireSignin, isPoster, deletePost)

router.param('username', userByUsername)
router.param('postId', postById)

module.exports = router