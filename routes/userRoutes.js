const express = require('express')
const { userByUsername,  getUser, tempEmails } = require('../controllers/userControllers')
const router = express.Router()

router.get('/:username', getUser)
router.get('/users/emails', tempEmails)

router.param('username', userByUsername)

module.exports = router
