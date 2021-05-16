const {check, validationResult} = require('express-validator')
const model = require('../models/userModel')
const passport = require('passport')

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
    // flashData: (req, res, next) => {
    //     let {name, email} = req.body
    //     req.flash('email', email || '')
    //     req.flash('name', name || '')
    //     next()
    // },
    

    
}