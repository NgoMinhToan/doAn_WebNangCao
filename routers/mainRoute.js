const router = require("express").Router()
const {index} = require('../controllers/mainController')
const {} = require('../methods')

router.get('/', index)

module.exports = router


// điều chỉnh,cấu hình  api