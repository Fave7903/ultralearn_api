const express = require('express')
const { requireSignin } = require('../controllers/authControllers')
const { 
    userByUsername,  
    getUser, 
    updateUser, 
    allUsers, 
    deleteUser,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower
    } = require('../controllers/userControllers')
const router = express.Router()

router.put('/user/follow', requireSignin, addFollowing, addFollower)
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower)

router.get('/users', allUsers)

router.get('/ul/:username', getUser)
router.put('/ul/:username', requireSignin, updateUser)
router.delete('/ul/:username', requireSignin, deleteUser)

router.param('username', userByUsername)

module.exports = router
