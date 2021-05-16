
const jwt = require('jsonwebtoken')
const {token: configToken, refreshToken: configRefreshToken} = require('./config')
let tokenList = {}
const bcrypt = require('bcrypt')
module.exports = {

    // MiddleWare
    isLogin: (req, res, next) => {
        if (req.isAuthenticated()) return next()
        else return res.redirect('/user/login')
    },
    isLogin_json: (req, res, next) => {
        if (req.isAuthenticated()) return next()
        else return res.json({success: false, msg: 'Phiên đăng nhập đã hết hạn'})
    },
    checkToken: (req, res, next) => {
        let key = req.body.token || req.query.token
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
    checkTokenRedirect: (req, res, next) => {
        let key = req.body.token || req.query.token
        jwt.verify(key, configToken.secretKey, (err, value) => {
            if (err) {
                req.flash('success', '-1')
                req.flash('msg', err.toString())
                return res.redirect('/user/login')
            }
            if (req.user._id != value.id) {
                req.flash('success', '-1')
                req.flash('msg', 'Mã token không hợp lệ')
                return res.redirect('/user/login')
            }
            else {
                next()
            }
        })
    },

    //Method
    createToken: (info) => {
        let token = jwt.sign(info, configToken.secretKey, configToken.option)
        let refreshToken = jwt.sign(info, configRefreshToken.secretKey, configRefreshToken.option)
        tokenList[refreshToken] = info
        return {token, refreshToken}
    },
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
    hashPassword: function(planePassword){
        try {
            return bcrypt.hashSync(`${planePassword}`, 10)
        } catch (e) {
            throw e.toString()
        }
    }
}