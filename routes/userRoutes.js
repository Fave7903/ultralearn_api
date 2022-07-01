const express = require('express')
const { requireSignin } = require('../controllers/authControllers')
const { userByUsername,  getUser, updateUser, allUsers, deleteUser } = require('../controllers/userControllers')
const router = express.Router()

router.get('/users', allUsers)

router.get('/ul/:username', getUser)
router.put('/ul/:username', requireSignin, updateUser)
router.delete('/ul/:username', requireSignin, deleteUser)

router.param('username', userByUsername)

module.exports = router
