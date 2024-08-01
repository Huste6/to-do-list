const express = require("express")
const router = express.Router();
const controller = require("../controller/user.controller")
const validate = require("../validate/user.validate")

router.post('/register',validate.register,controller.register);

router.post('/login',validate.login,controller.login);

router.post('/password/forgot',controller.forgotPassword);

router.post('/password/otp',controller.otpForgotPassword);

module.exports = router;