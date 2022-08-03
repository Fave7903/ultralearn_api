const express = require('express')
const { login, signup, signout } = require('../controllers/authControllers')
const { userSignupValidator } = require('../validator')
const router = express.Router()

router.get('/', (req, res) => {
  res.send("Welcome to UltraLearn's API")
})
router.post('/signup', userSignupValidator, signup)

// router.post('/login', login)
router.post('/login', login)
router.get('/signout', signout)

module.exports = router