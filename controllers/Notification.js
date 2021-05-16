const {check, validationResult} = require('express-validator')
const model = require('../models/userModel')
const passport = require('passport')
const Group = require('../models/groupUserModel')
const {studentRole, instructorRole} = require('../config')
const notify = (req, res, uri, {code, error} )=>{
    req.flash('code', code || '')
    req.flash('error', error || '')
    return res.redirect(uri)
}

module.exports = {
    index: (req, res) => {
        let success = req.flash('success')
        let msg = req.flash('msg')
        return res.render('facultyNotification', {data: {...req.session.passport.user, 
            ...req.user._doc}, flash: {success, msg}})
    },
    
    createPostIndex: async (req, res) => {
        let success = req.flash('success')
        let msg = req.flash('msg')
        try {
            let group = await Group.find()
            if(req.user.role == studentRole) group = group[0]
            else if(req.user.role == instructorRole){
                group = group.filter(f => `${f.leader}` == `${req.user._id}`).concat(group[0])
            }
            console.log('các group')
            console.log(group)
            
            return res.render('createPostNotification', {data: {...req.session.passport.user, 
                ...req.user._doc}, flash: {success, msg}, group})
        } catch (e) {
            return res.render('createPostNotification', {data: {...req.session.passport.user, 
                ...req.user._doc}, flash: {success: '-1', msg: e}})
        }
    }
    // flashData: (req, res, next) => {
    //     let {name, email} = req.body
    //     req.flash('email', email || '')
    //     req.flash('name', name || '')
    //     next()
    // },
    

    
}