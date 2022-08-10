const express = require('express')
const { requirelogin } = require('../controllers/authControllers')
const { 
    userByUsername,  
    allUsers,
    getUser,
    updateUser,
    deleteUser
    // addFollowing,
    // addFollower,
    // removeFollowing,
    // removeFollower,
    // findPeople
    } = require('../controllers/userControllers')
const router = express.Router()

// router.put('/user/follow', requireSignin, addFollowing, addFollower)
// router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower)

router.get('/users', allUsers)

router.get('/ul/:username', getUser)
router.put('/ul/:username', requirelogin, updateUser)
router.delete('/ul/:username', requirelogin, deleteUser)

// router.get('/user/findpeople/:username', requireSignin, findPeople)

router.param('username', userByUsername)

module.exports = router
