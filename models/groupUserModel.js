// Đại diện cho các khoa và các phòng ban
const mongoose = require('mongoose')
const GUserchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    leader: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    desc: {type: String, default: ''},
    avatar: {type: String, default: '/images/logo.png'}, // can we change this to ref media model
})

GUserchema.path('name').set(function (value) {
    return value.replace(/^\w|\s\w/gi, match => match.toUpperCase())
})

GUserchema.path('desc').set(function (value) {
    return value.replace(/^\w|\s\w/gi, match => match.toUpperCase())
})

const GroupUser = mongoose.model('GroupUser', GUserchema)

module.exports = GroupUser