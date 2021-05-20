const {check, validationResult} = require('express-validator')
const User = require('../models/UserModel')
const Group = require('../models/GroupUserModel')
const mongoose = require('mongoose')
const {instructorRole} = require('../config')
module.exports = {
    createAccountIndex: (req, res) => {
        let success = req.flash('success')
        let msg = req.flash('msg')
        let name = req.flash('name')
        let email = req.flash('email')
        let password = req.flash('password')
        let groupID = req.flash('groupID')
        // groupID = groupID.join(',')
        return res.render('createAccount', {data: {...req.session.passport.user, 
            ...req.user._doc}, flash: {success, msg, name, email, password, groupID}})
    },
    createAccount: async (req, res) => {
        let {name, email, password, groupID} = req.body
        if(groupID == undefined || `${groupID}` == '') {
            return res.redirect('back')
        }
        if(!Array.isArray(groupID)) groupID = [].concat(`${groupID}`)
        req.flash('groupID', groupID)
        console.log(groupID)

        try {
            let checkUserResult = await User.find({email})
            if (checkUserResult.length != 0) throw 'Đã tồn tại email người dùng'
            let newUser = new User({name, email, password, role: instructorRole})
            let userResult = await newUser.save()
            let groupIDObj = groupID.map(m => mongoose.Types.ObjectId(m))
            let result = await Group.updateMany({'_id': {$in: groupIDObj}}, {leader: userResult})
            console.log('Thêm người dùng thành công')
            console.log(userResult)
            console.log('Cập nhật thành công trưởng nhóm')
            console.log(result)
            req.flash('success', '0')
            req.flash('msg', 'Thêm người dùng thành công \n Cập nhật thành công trưởng nhóm')
            return res.redirect('back')
        } catch (e) {
            req.flash('success', '-1')
            req.flash('msg', e.toString())
            return res.redirect('back')
        }




        res.redirect('back')
    },
    checkValid: (req, res, next) => {
        let {name, email, password, groupID} = req.body
        req.flash('name', name)
        req.flash('email', email)
        req.flash('password', password)
        let result = validationResult(req)
        if (result.errors.length > 0) {
            req.flash('success', '-1')
            req.flash('msg', result.errors.shift().msg)
            res.redirect('back')
        }
        else next()
    },
    isLogin: (req, res, next) => {
        if(!req.isAuthenticated()) return res.redirect('/user/login')
        else if (req.user.role !== 'Admin') return res.redirect('/')
        else return next()
    },
}