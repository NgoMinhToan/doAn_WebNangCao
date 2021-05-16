const router = require("express").Router()
const controller = require('../controllers/Notification')

router.get('/', controller.index)

router.get('/create', controller.createPostIndex)

module.exports = router


// điều chỉnh,cấu hình  api