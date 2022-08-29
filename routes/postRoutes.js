const express = require('express')
const { requirelogin } = require('../controllers/authControllers')
const { userByUsername } = require('../controllers/userControllers')
const { createPostValidator } = require('../validator/index')
const { getPosts, 
    create, 
    postsByUser, 
    postById, 
    isPoster, 
    updatePost, 
    deletePost,
    like,
    unlike,
    getPost,
    comment,
    postComments
    // uncomment
} = require('../controllers/postControllers')
const router = express.Router()

router.get('/post/:postId', getPost)
router.get('/posts', getPosts)
router.put('/post/like', requirelogin, like)
router.put('/post/unlike', requirelogin, unlike)

// comments
router.put('/post/comment', requirelogin, comment)

router.get('/post/:postId/comments', postComments)
// router.put('/post/uncomment', requirelogin, uncomment)

router.post('/post/new/:username', requirelogin, createPostValidator, create)

router.get('/posts/by/:username', requirelogin, postsByUser)
router.put('/post/:postId', requirelogin, isPoster, updatePost)
router.delete('/post/:postId', requirelogin, isPoster, deletePost)


router.param('username', userByUsername)
router.param('postId', postById)

module.exports = router