const flash = require('express-flash')
const jwt = require('jsonwebtoken')
module.exports = {
    isLogin: (req, res, next) => {
        if (req.isAuthenticated()) return next()
        else return res.redirect('/user/login')
    },
    isLogin_json: (req, res, next) => {
        if (req.isAuthenticated()) return next()
        else return res.json({success: false, msg: 'Phiên đăng nhập đã hết hạn'})
    },
    checkToken: (req, res, next) => {
        let token = req.body.token || req.query.token
        jwt.verify(token, "mabimat", (err, value) => {
            if (err) {
                // req.flash('error', err.toString())
                // return res.redirect('/user/logout')
                return res.json({success: false, msg: err.toString()})
            }
            if (req.user._id != value.id) {
                // req.flash('error', 'Mã token không hợp lệ')
                // return res.redirect('/user/logout') //TODO: gui them loi cho trang dang nhap
                return res.json({success: false, msg: 'Mã token không hợp lệ'})
            }
            else {
                next()
            }
        })
    },
}