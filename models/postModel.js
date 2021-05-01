// đại diện cho các bài đăng
const mongoose = require('mongoose')
const postchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    toGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'GroupUser', required: true},
    title: {type: String, required: true},
    content: {type: String, default: 'Nothing to write :)) !'},
    image: [{type: String}],
    video: [{type: String}],
    typePost: {type: String, default: 'text'},
    timeStamp: {type: Date, default: Date.now()},
})
const Post = mongoose.model('Post', postchema)

module.exports = Post