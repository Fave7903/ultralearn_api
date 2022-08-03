const express = require('express')
const { requirelogin } = require('../controllers/authControllers')
const { 
    userByUsername,  
    getUser, 
    updateUser, 
    allUsers, 
    deleteUser,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    findPeople
    } = require('../controllers/userControllers')
const router = express.Router()

router.put('/user/follow', requirelogin, addFollowing, addFollower)
router.put('/user/unfollow', requirelogin, removeFollowing, removeFollower)

router.get('/users', allUsers)

router.get('/ul/:username', getUser)
router.put('/ul/:username', requirelogin, updateUser)
router.delete('/ul/:username', requirelogin, deleteUser)

router.get('/user/findpeople/:username', requirelogin, findPeople)

router.param('username', userByUsername)

module.exports = router
