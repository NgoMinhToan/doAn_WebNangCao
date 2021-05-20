const router = require("express").Router()
const {index} = require('../controllers/MainController')
const {} = require('../methods')

router.get('/', index)

module.exports = router


// điều chỉnh,cấu hình  api