const router = require("express").Router()
const {createAccountIndex, createAccount, isLogin, checkValid} = require('../controllers/AdminController')
const {checkToken} = require('../methods')
const {validator_register} = require('../controllers/Validator')

router.get('/createAccount', isLogin, createAccountIndex)

router.post('/createAccount', isLogin, validator_register, checkValid, checkToken, createAccount)


module.exports = router