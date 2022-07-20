const express = require('express')
const { requireSignin } = require('../controllers/authControllers')
const { resetPasswordValidation, resetPasswordEmailValidation } = require('../validator/index')
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
    findPeople,
    resetPassword,
    sendPasswordResetEmail
    } = require('../controllers/userControllers')
const router = express.Router()

router.put('/user/follow', requireSignin, addFollowing, addFollower)
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower)

router.get('/users', allUsers)

router.get('/ul/:username', getUser)
router.put('/ul/reset-password', resetPasswordValidation, resetPassword)
router.put('/ul/:username', requireSignin, updateUser)
router.post('/ul/email', resetPasswordEmailValidation, sendPasswordResetEmail)
router.delete('/ul/:username', requireSignin, deleteUser)

router.get('/user/findpeople/:username', requireSignin, findPeople)

router.param('username', userByUsername)

module.exports = router
