const router = require("express").Router()
const controller = require('../controllers/Notification')
const {isLogin, checkTokenRedirect} = require('../methods')

router.get('/', isLogin, controller.index)

router.get('/faculty', isLogin, controller.faculty)

router.get('/detail/:postID', isLogin, controller.notifyDetail)

router.get('/faculty/:groupID', controller.indexFaculty)

router.get('/create', isLogin, controller.createPostIndex)

module.exports = router


// điều chỉnh,cấu hình  api