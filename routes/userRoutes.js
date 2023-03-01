const express = require('express')
const { resetPasswordValidation, resetPasswordEmailValidation } = require('../validator/index')
const { requirelogin } = require('../controllers/authControllers')
const { 
    userByUsername,  
    allUsers,
    getUser,
    updateUser,
    deleteUser,
    follow,
    unfollow,
    findPeople,
    myfollowers,
    myfollowings,
    resetPassword,
    sendPasswordResetEmail
    } = require('../controllers/userControllers')
const router = express.Router()

// router.put('/user/follow', requireSignin, addFollowing, addFollower)
// router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower)

router.get('/users', allUsers)
router.put('/user/:userid/follow', requirelogin, follow )
router.put('/user/:userid/unfollow', requirelogin, unfollow )

router.get('/ul/:username', getUser)
router.put('/ul/:username', requirelogin, updateUser)
router.delete('/ul/:username', requirelogin, deleteUser)


router.get('/user/findpeople/:username', requirelogin, findPeople)
router.get('/user/followers/:username', requirelogin, myfollowers)
router.get('/user/followings/:username', requirelogin, myfollowings) 

//password reset
router.put('/reset-password', resetPasswordValidation, resetPassword)
router.post('/ul/email', resetPasswordEmailValidation, sendPasswordResetEmail)

router.param('username', userByUsername)

module.exports = router
