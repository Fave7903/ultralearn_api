const express = require('express')
const { signup, signin, requireSignin, dashboard } = require('../controllers/authControllers')
const { userSignupValidator } = require('../validator')
const router = express.Router()

router.get('/', (req, res) => {
  res.send("Welcome to UltraLearn's API")
})
router.post('/signup', userSignupValidator, signup)

router.post('/signin', signin)

module.exports = router