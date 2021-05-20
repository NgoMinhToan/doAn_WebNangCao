const model = require('../models/UserModel')
const passport = require('passport')

module.exports = {
    google_callback: passport.authenticate('google', {
        failureRedirect: '/user/login',
        successRedirect: '/',
        failureFlash: true
    }),
    google_authenticate: passport.authenticate('google', {
        scope: ['profile', 'email']
    }),
    local_authenticate: passport.authenticate('local', {
        failureRedirect: '/user/login',
        successRedirect: '/',
        failureFlash: true,
        // failureMessage: true
    }),
}