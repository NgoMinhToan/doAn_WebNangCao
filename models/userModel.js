const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const {studentRole, defaultAvatar} = require('../config')
const userSchema = mongoose.Schema({
    authID: {type: String, default: ''},
    name: {type: String, default: 'anonymous'},
    nickName: {type: String, default: ''},
    email: {type: String, required: true, unique: true},
    password: {type: String, default: ''},
    class: {type: String},
    avatar: {type: String, default: defaultAvatar},
    role: {type: String, default: studentRole},
    faculty: {type: String}
})
//TODO them khoa

userSchema.path('name').set(function (value) {
    return value.replace(/^\w|\s\w/gi, match => match.toUpperCase())
})

userSchema.path('role').set(function (value) {
    return value.replace(/^\w|\s\w/gi, match => match.toUpperCase())
})

userSchema.pre('save', function (next) {
    let user = this
    if(user.nickName == '')
        user.nickName = user.name
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(!err){
            user.password = hash
            next()
        }
        else{
            throw `Lỗi hash mật khẩu: ${err.toString()}`
        }
    })
})
const Group = require('./GroupUserModel')
userSchema.pre('deleteOne', async function (next) {
    let id = mongoose.Types.ObjectId(this._conditions._id)
    return Group.updateMany({leader: id}, {leader: null}).exec()
    .then(result => {
        console.log('Đã trả lại vị trí leader')
        console.log(result)
    })
})

userSchema.methods.comparePass = function(planePassword, callback) {
    bcrypt.compare(planePassword, this.password, (err, isMatch) => {
        if (err) return callback(err)
        callback(err, isMatch)
    })
}

const Users = mongoose.model('User', userSchema)


module.exports = Users