
const jwt = require('jsonwebtoken')
const {token: configToken, refreshToken: configRefreshToken} = require('./config')
let tokenList = {}
const bcrypt = require('bcrypt')
module.exports = {

    // MiddleWare
    // kiểm tra login
    isLogin: (req, res, next) => {
        if (req.isAuthenticated()) return next()
        else return res.redirect('/user/login')
    },
    // kiểm tra login trả về json (dành cho api)
    isLogin_json: (req, res, next) => {
        if (req.isAuthenticated()) return next()
        else return res.json({success: false, msg: 'Phiên đăng nhập đã hết hạn'})
    },
    // kiểm tra token (dành cho api)
    checkToken: (req, res, next) => {
        let key = req.body.token
        if(key == undefined) key = req.query.token
        jwt.verify(key, configToken.secretKey, (err, value) => {
            if (err) {
                return res.json({success: false, msg: err.toString()})
            }
            if (req.user._id != value.id) {
                return res.json({success: false, msg: 'Mã token không hợp lệ'})
            }
            else {
                next()
            }
        })
    },
    // khi truy cập vào trang web có sử dụng api nhưng không hộ trợ chuyển trang tự động khi token hết hạn
    checkTokenRedirect: (req, res, next) => {
        let key = req.body.token
        if(key == undefined) key = req.query.token
        jwt.verify(key, configToken.secretKey, (err, value) => {
            if (err) {
                // req.flash('success', '-1')
                // req.flash('msg', err.toString())
                // req.logout()
                return res.redirect('../../../')
            }
            if (req.user._id != value.id) {
                // req.flash('success', '-1')
                // req.flash('msg', 'Mã token không hợp lệ')
                return res.redirect('../../../')
            }
            else {
                next()
            }
        })
    },

    //Method
    // tạo token và refreshToken
    createToken: (info) => {
        let token = jwt.sign(info, configToken.secretKey, configToken.option)
        let refreshToken = jwt.sign(info, configRefreshToken.secretKey, configRefreshToken.option)
        tokenList[refreshToken] = info
        return {token, refreshToken}
    },
    // refresh token (dành cho api)
    refreshToken: (req, res) => {
        let key = req.body.token
        if (key in tokenList){
            jwt.verify(key, configRefreshToken.secretKey, (err, value) => {
                if (err) return res.json({success: false, msg: err})
                let token = jwt.sign(tokenList[key], configToken.secretKey, configToken.option)
                req.session.passport.user.token = token
                return res.json({success: true, token})
            })
        }
        else return res.json({success: false, msg: 'Refresh Token không có trong hệ thống'})
    },
    // refresh token (chỉ được sử dụng ở trang home) (dành cho các trang web không hõ trợ refresh lại token trong hệ thống)
    refreshToken_f5: (req, res, next) => {
        jwt.verify(req.session.passport.user.refreshToken, configRefreshToken.secretKey, (err, value) => {
            if (err) {
                req.logout()
                req.flash('success', '-1')
                req.flash('msg', err.toString())
                return res.redirect('/')
            }
            let token = jwt.sign({id: req.session.passport.user.id}, configToken.secretKey, configToken.option)
            req.session.passport.user.token = token
            console.log('Đã refresh lại token mới')
            return next()
        })
    },
    // băm mật khẩu
    hashPassword: function(planePassword){
        try {
            return bcrypt.hashSync(`${planePassword}`, 10)
        } catch (e) {
            throw e.toString()
        }
    }
}