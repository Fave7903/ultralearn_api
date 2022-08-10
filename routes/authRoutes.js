const express = require('express')
const { signin, signup, signout } = require('../controllers/authControllers')
const { userSignupValidator } = require('../validator')
const router = express.Router()

router.get('/', (req, res) => {
  res.send("Welcome to UltraLearn's API")
})
router.post('/signup', userSignupValidator, signup)

// router.post('/login', login)
router.post('/login', signin)
router.get('/signout', signout)

module.exports = router