const router = require("express").Router()
const {index, isLogin, flashData, checkValid, logout, Profile} = require('../controllers/UserController')
const {deleteUser} = require('../controllers/ApiController')
const {local_authenticate} = require('../controllers/Authentication')
const {validator_login, validToken, validChangeInfo, validChangePassword} = require('../controllers/Validator')
const {checkToken, checkTokenRedirect, isLogin: checkLogin} = require('../methods')
const multer = require('multer')
const uploader = multer({dest: __dirname + '/../temp/'})

router.get('/login', isLogin, index)

router.post('/login', flashData, validator_login, checkValid, local_authenticate)

router.get('/logout', logout)

router.post('/delete', checkLogin, validToken, checkValid, checkToken, deleteUser)

router.get('/profile', checkLogin, Profile.index)

router.get('/profile/edit', checkLogin, Profile.editProfile_index)

router.post('/profile/edit', checkLogin, uploader.single('avatar'), validChangeInfo, checkValid, checkTokenRedirect, Profile.editProfile)

router.post('/profile/editPassword', checkLogin, validChangePassword, checkValid, checkTokenRedirect, Profile.editProfileFaculty)

module.exports = router