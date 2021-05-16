const router = require("express").Router()
const {checkValid, Post, Comment, getGroups, deleteUser, MC} = require('../controllers/ApiController')
const {isLogin_json, checkToken, refreshToken} = require('../methods')
const multer = require('multer')
const uploader = multer({dest: __dirname + '/../temp/'})
const {validCreatePost, validGetPost, validToken, validCreateComment} = require('../controllers/validator')

router.put('/post/create', isLogin_json, uploader.array('image'), validCreatePost, checkValid, checkToken, Post.create)

router.put('/post/update/:postID', isLogin_json, uploader.array('image'), validCreatePost, checkValid, checkToken, Post.update)

router.post('/post/delete/:postID', isLogin_json, validToken, checkValid, checkToken, Post.delete)

router.put('/comment/create', isLogin_json, uploader.array('image'), validCreateComment, checkValid, checkToken, Comment.create)

router.post('/post/get_posts', isLogin_json, validGetPost, checkValid, checkToken, Post.get)

router.post('/post/get_all_posts', isLogin_json, validToken, checkValid, checkToken, Post.getAll)

router.post('/post/:postID', isLogin_json, validToken, checkValid, checkToken, Post.getById)

router.post('/post/:postID/get_comments', isLogin_json, validToken, checkValid, checkToken, Comment.getComment)

router.post('/comment/delete/:commentID', isLogin_json, validToken, checkValid, checkToken, Comment.delete)

router.post('/getGroups', isLogin_json, validToken, checkValid, checkToken, getGroups)

router.post('/refreshToken', isLogin_json, validToken, checkValid, refreshToken)

router.post('/user/delete', isLogin_json, validToken, checkValid, checkToken, deleteUser)

router.post('/mc/getAll', isLogin_json, validToken, checkValid, checkToken, MC.getAllMContent)

router.post('/mc/delete/:idMediaContent', isLogin_json, validToken, checkValid, checkToken, MC.deleteMediaContent)

module.exports = router


// điều chỉnh,cấu hình  api