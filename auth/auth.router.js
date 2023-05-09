const router = require('express').Router()
const controller = require('./auth.controller')
const {validateSignUp, validateSignIn} = require("./auth.validator");


router.post('/register', validateSignUp, controller.register)
router.post('/login', validateSignIn, controller.login)

router.get('/verify/:token', controller.verify)

module.exports = router