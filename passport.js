const userModel = require('./models/userModel')
const passport = require('passport')
const {createToken} = require('./methods')
const localStratery = require('passport-local').Strategy
passport.use('local', new localStratery({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
},async (req, email, password, done) => {
    console.log('Authenticating ...')
    try {
        let result = await userModel.findOne({email})
        if(result == null) throw 'Không tìm thấy thông tin tài khoản!'
        console.log(result)
        result.comparePass(password, (err, isMatch)=>{
            if (err) return done(null, false, err.toString())
            else if(!isMatch) return done(null, false, 'Sai mật khẩu!')
            else return done(null, result)
        })
    } catch (e) {
        console.log('Error: ' + e.toString())
        return done(null, false, e.toString())
    }
}))

const keys = require('./.git/key')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const {defaultFaculty, studentRole, allowMailDomain} = require('./config')

passport.use('google', new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
},async (accessToken, refreshTokenGoogle, profile, done) => {
    try {
        if(!profile.id) throw 'Không truy cập được id người dùng!'

        let mailDomain = profile.emails[0].value.match(/\@(\w+.+)/ig)
        let mssv = profile.emails[0].value.replace(/\@(\w+.+)/ig, '')
        if (mailDomain != allowMailDomain) throw `Tên miền ${mailDomain} không được cho phép`

        let user = await userModel.findOne({authID: `${profile.provider}:${profile.id}`})
        if (user != null) return done(null, user)
        let newUserAuth = new userModel({
            authID: `${profile.provider}:${profile.id}`,
            name: `${profile.name.familyName} ${profile.name.givenName}`,
            nickName: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            role: studentRole,
            faculty: defaultFaculty,
        })
        let result = await newUserAuth.save()
        return done(null, result)
    } catch (e) {
        return done(null, false, {message: e.toString()})
    }
}))

// done(err) will be handled by Express and generate an HTTP 500 response
// done(null, false) call failureRedirect
// done(null, user) call successRedirect

// In case of an invalid authentication (but not an internal error)
// done(null, false, { message : 'invalid e-mail address or password' });

passport.serializeUser((user, done) => {
    // tao token
    let {token, refreshToken} = createToken({id: user._id})
    done(null, {id: user._id, token, refreshToken})
})
passport.deserializeUser((_user, done) => {
    userModel.findById(_user.id, '-password -authID', (err, user) => done(err, user))
})

module.exports = passport
