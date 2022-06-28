const express = require('express')
const { requireSignin } = require('../controllers/authControllers')
const { userByUsername,  getUser, updateUser, allUsers } = require('../controllers/userControllers')
const router = express.Router()

router.get('/users', allUsers)

router.get('/ul/:username', getUser)
router.put('/ul/:username', requireSignin, updateUser)
// router.get('/users/emails', tempEmails)

router.param('username', userByUsername)

module.exports = router
