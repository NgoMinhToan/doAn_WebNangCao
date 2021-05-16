const {check, validationResult} = require('express-validator')
const { studentRole , defaultAvatar} = require('../config')
const MediaContent = require('../models/mediaModel')
const Users = require('../models/userModel')
const {hashPassword} = require('../methods')
// const notify = (req, res, uri, {code, error} )=>{
//     req.flash('code', code || '')
//     req.flash('error', error || '')
//     return res.redirect(uri)
// }
const getImage = async (req) => {
    if (req.file != undefined){
        let file = req.file
        let image = new MediaContent({originalname: file.originalname, uri: file.path, type: 'image', user: req.user._id})
        try {
            return await image.save()
        } catch (e) {
            throw e.toString()
        }
    }
    else {
        console.log('Không tìm thấy ảnh')
        return undefined
    }
}
module.exports = {
    flashData: (req, res, next) => {
        let {name, email} = req.body
        req.flash('email', email || '')
        req.flash('name', name || '')
        next()
    },
    index: (req, res) => {
        let error = req.flash('error') || ''
        let msg = req.flash('msg') || ''
        let success = req.flash('success')
        if(success.length == 0 && error.length > 0) success = '-1'
        let email = req.flash('email') || ''
        msg = [].concat(msg, error)
        console.log(msg)
        res.render('login', {success, msg: msg.join('\n'), email})
    },
    logout: (req, res) =>{
        req.logout()
        res.redirect('/')
    },
    isLogin: (req, res, next) => {
        if(req.isAuthenticated()) return res.redirect('/')
        else return next()
    },
    checkValid: (req, res, next) => {
        let result = validationResult(req)
        if (result.errors.length > 0) {
            let msg = result.errors.shift().msg
            req.flash('success', '-1')
            req.flash('msg', msg)
            console.log(`Check Valid: ${msg}`)
            return res.redirect('back')
        }
        // TODO sua lại ma code thanh success
        else next()
    },
    Profile: {
        index: (req, res) => {
            let success = req.flash('success')
            let msg = req.flash('msg')
            return res.render('profile', {data: {...req.session.passport.user, 
                ...req.user._doc}, flash: {success, msg}})
        },
        editProfile_index: (req, res) => {
            let success = req.flash('success')
            let msg = req.flash('msg')
            if (req.user.role == studentRole){
                return res.render('editProfile_student', {data: {...req.session.passport.user, 
                    ...req.user._doc}, flash: {success, msg}})
            }
            else{
                return res.render('editProfile_instructor', {data: {...req.session.passport.user, 
                    ...req.user._doc}, flash: {success, msg}})
            }
        },
        editProfile: async (req, res) => {
            let {name, faculty, Class} = req.body
            try {
                let avatar = await getImage(req)
                let update
                if (avatar == undefined) update = {name, faculty, class: Class}
                else update = {name, faculty, class: Class, avatar: avatar.uri}
                let result = await Users.findByIdAndUpdate(req.user._id, update)
                req.flash('success', '0')
                req.flash('msg', 'Cập nhật thành công')

                return res.redirect('back')
            } catch (e) {
                console.log(e.toString())
                req.flash('success', '-1')
                req.flash('msg', e.toString())
                return res.redirect('back')
            }
        },
        editProfileFaculty: async (req, res) => {
            let {password} = req.body
            try {
                let hashPass = hashPassword(password)
                let result = await Users.updateOne(req.user, {password: hashPass})
                req.flash('success', '0')
                req.flash('msg', 'Cập nhật thành công')
                return res.redirect('back')
            } catch (e) {
                console.log(e.toString())
                req.flash('success', '-1')
                req.flash('msg', e.toString())
                return res.redirect('back')
            }
        },
    }
}