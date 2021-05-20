// đại diện cho các bài đăng
const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    toGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'GroupUser'},
    title: {type: String, required: true},
    content: {type: String, default: 'Nothing to write :)) !'},
    mediaContent: [{type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true}],
    typePost: {type: String, default: 'text'},
    timeStamp: {type: Date, default: Date.now()},
})

const Comment =  require('./CommentModel')
postSchema.pre('deleteOne', async function (next){
    return Comment.deleteMany({post: this._conditions._id}).exec()
    .then(result => console.log('Đã xóa các comment thành công'))
    .catch(err => console.log(`Đã xóa các comment thất bại: ${err.toString()}`))
})

const Post = mongoose.model('Post', postSchema)


module.exports = Post