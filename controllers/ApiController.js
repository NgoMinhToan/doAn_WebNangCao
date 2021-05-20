const {check, validationResult} = require('express-validator')
const Comment = require('../models/CommentModel')
const Post = require('../models/PostModel')
const Group = require('../models/GroupUserModel')
const MediaContent = require('../models/MediaModel')
const Users = require('../models/UserModel')
const socket = require('../socket')
const mongoose = require('mongoose')
const getGroup = async (group) => {
    return Group.findById(group).exec()
    .then(toGroup => {
        if(toGroup == null) throw 'Không thể tìm thấy thông tin nhóm'
        else return toGroup
    })
    .catch(error => {throw error})
}
const getImage = (req) => {
    if (req.files != undefined && req.files.length >= 0){
        let imageArr = req.files.map(e => ({originalname: e.originalname, uri: e.path, type: 'image', user: req.user._id}))
        return MediaContent.insertMany(imageArr)
        .then(image =>  image)
        .catch(error => {throw error})
    }
    else {
        console.log('Không tìm thấy ảnh')
        return []
    }
}
const getVideo = (req) => {
    let {video} = req.body
    if (video == undefined || `${video}` == '') {
        console.log('Không tìm thấy video')
        return []
    }
    else{
        let videos = [].concat(video)
        let videoArr = videos.map(e => ({uri: e, type: 'video', user: req.user._id}))
        return MediaContent.insertMany(videoArr)
        .then(videos => videos)
        .catch(error => {throw error})
    }
}
const getPost = async (postID) => {
    return Post.findById(postID).exec()
    .then(post => {
        if(post == null) throw 'Không thể tìm thấy bài đăng'
        else return post
    })
    .catch(error => {throw error})
}
const getMC = async (mediaIDList) => {
    let mediaIDs = [].concat(mediaIDList)
    if (Array.isArray(mediaIDs) && mediaIDs.length > 0){
        let idArray = mediaIDs.map(m => mongoose.Types.ObjectId(m))
        return MediaContent.find({'_id': {$in: idArray}}).exec()
        .then(mcs => {
            if(mcs == null) throw 'Nội dung đa phương tiện không tồn tại'
            else return mcs
        })
        .catch(error => {throw error})
    }
    else {
        console.log('Không có nội dung cũ')
        return []
    }
}
const {groupOtherName, studentRole} = require('../config')
module.exports = {
    Post : {
        create: async (req, res) => {
            let {title, content, group} = req.body

            try {
                let toGroup = await getGroup(group)
                if (toGroup.name != groupOtherName && req.user.role == studentRole) throw 'Người dùng hiện tại không có quyền đăng bài vào nhóm này'
                let image = await getImage(req)
                let videos = await getVideo(req)
                let postItem = new Post({user: req.user, toGroup, title, content, mediaContent: [...image, ...videos]})
                let result = await postItem.save()
                if (result != postItem) throw 'Thêm bài đăng thất bại'
                console.log('Tạo bài đăng thành công')
                socket.notify('post', result)
                return res.json({success: true, msg: 'Tạo bài đăng thành công', result})
            } catch (e) {
                return res.json({success: false, msg: e.toString()})
            }
        },
        update: async (req, res) => {
            let {title, content, group, oldMediaContent} = req.body
            let {postID} = req.params
            if (postID == undefined) return res.json({success: false, msg: 'Không có id'})
            try {
                let post = await getPost(postID)
                let toGroup = await getGroup(group)
                let image = await getImage(req)
                let videos = await getVideo(req)
                let oldContent = await getMC(oldMediaContent)
                let result = await Post.updateOne(post, {user: req.user, toGroup, title, content, mediaContent: [...image, ...videos, ...oldContent]})
                if(result.nModified == 0) throw 'Nội dung chưa được cập nhật !'
                return res.json({success: true, result})
            } catch (e) {
                return res.json({success: false, msg: e.toString()})
            }
        },
        delete: async (req, res) => {
            let {postID} = req.params
            if (postID == undefined) return res.json({success: false, msg: 'Không có id'})
            try {
                let post = await getPost(postID)
                let result = await Post.deleteOne(post)
                if(result.nModified == 0) throw 'Xóa thất bại !'
                return res.json({success: true, result})
            } catch (e) {
                return res.json({success: false, msg: e.toString()})
            }

        },
        get: async (req, res) => {
            let {page, quantity} = req.body

            return Post.find().sort({timeStamp: -1}).populate('user toGroup mediaContent', '-password -authID -email').skip((page-1)*quantity).limit((+quantity)).exec()
            .then(result => res.json({success: true, result}))
            .catch(err => res.json({success: false, msg: err.toString()}))
        },
        getImportant: async (req, res) => {
            let {page, quantity} = req.body

            return Post.find().sort({timeStamp: -1})
            .populate({
                path: 'toGroup', 
                select: 'name _id',
                match: {'name': {$ne: 'Other'}}
            })
            .populate({
                path: 'user', 
                select: 'role',
                match: {'role': 'Admin'}
            })
            .where('toGroup').ne(null)
            .select('-mediaContent')
            .skip((page-1)*quantity).limit((+quantity)).exec()
            .then(result => res.json({success: true, result}))
            .catch(err => res.json({success: false, msg: err.toString()}))
        },
        getFacultyImportant: async (req, res) => {
            let {page, quantity, groupID} = req.body

            return Post.find({toGroup: groupID}).sort({timeStamp: -1})
            .populate({
                path: 'toGroup', 
                select: 'name _id',
                match: {'name': {$ne: 'Other'}, '_id': groupID}
            })
            .where('toGroup').ne(null)
            .select('-mediaContent')
            .skip((page-1)*quantity).limit((+quantity)).exec()
            .then(result => res.json({success: true, result}))
            .catch(err => res.json({success: false, msg: err.toString()}))
        },
        getAll: async (req, res) => {
            return Post.find().sort({timeStamp: -1}).populate('user toGroup mediaContent', '-password -authID -email').exec()
            .then(result => res.json({success: true, result}))
            .catch(err => res.json({success: false, msg: err.toString()}))
        },
        getById: async (req, res) => {
            let {postID} = req.params
            if (postID == undefined) return res.json({success: false, msg: 'Không có id'})
            else return Post.findById(postID).populate('user toGroup mediaContent', '-password -authID -email').exec()
            .then(result => {
                if (result == null) throw 'Bài đăng không tồn tại'
                else return res.json({success: true, result})
            })
            .catch(err => res.json({success: false, msg: err.toString()}))
        }
    },
    Comment: {
        create: async (req, res) => {
            let {content, postID} = req.body
            try {
                let post = await getPost(postID)
                let image = await getImage(req)
                let videos = await getVideo(req)
                let commentItem = new Comment({user: req.user, post, content, mediaContent: [...image, ...videos]})
                let result = await commentItem.save()
                if (result != commentItem) throw 'Thêm comment thất bại'
                console.log(`Comment: '${content}' vào bài viết '${post._id}'`)
                socket.notify('comment', result)
                return res.json({success: true, msg: 'Đã thêm comment thành công', result})
            } catch (e) {
                return res.json({success: false, msg: e.toString()})
            }
        },
        delete: async (req, res) => {
            let {commentID} = req.params
            if (commentID == undefined) return res.json({success: false, msg: 'Không có id'})
            try {
                let result = await Comment.deleteOne({_id: commentID})
                if(result.nModified == 0) throw 'Xóa thất bại !'
                return res.json({success: true, result})
            } catch (e) {
                return res.json({success: false, msg: e.toString()})
            }

        },
        getComment: async (req, res) => {
            let {postID} = req.params
            if (postID == undefined) return res.json({success: false, msg: 'Không có id'})
            try {
                let post = await getPost(postID)
                let result = await Comment.find({post}).sort({timeStamp: -1}).populate('user mediaContent', '-password -authID -email -_id')
                return res.json({success: true, result})
            } catch (e) {
                return res.json({success: false, msg: e.toString()})
            }
        }
    },
    deleteUser: async (req, res) => {
        let id = req.user._id
        try {
            let result = await Users.deleteOne({_id: id})
            return res.json({success: true, result})
        } catch (error) {
            console.log(error.toString())
            return res.json({success: false, msg: error.toString()})
        }
    },
    MC: {
        getAllMContent: async (req, res) => {
            try {
                let postMC = await Post.find({user: req.user}).populate('mediaContent').select('mediaContent')
                let commentMC = await Comment.find({user: req.user}).populate('mediaContent').select('mediaContent')
                let result = postMC.concat(commentMC).flatMap(m => m['mediaContent'])
                return res.json({success: true, result})
            } catch (e) {
                return res.json({success: false, msg: e.toString()})
            }
        },
        deleteMediaContent: async (req, res) => {
            let {idMediaContent} = req.params
            try {
                if (idMediaContent == undefined) throw 'Không tìm thấy Media ID'
                let mc = (await getMC(idMediaContent)).pop()
                let result = await MediaContent.deleteOne(mc)
                console.log('Đã thực hiện xóa')
                console.log(result)
                return res.json({success: true, result})
            } catch (e) {
                return res.json({success: false, msg: e.toString()})
            }
        },
    },
    getGroups: async (req, res) => {
        return Group.find().exec()
        .then(result => res.json({success: true, result}))
        .catch(err => res.json({success: false, msg: err}))
    },
    checkValid: (req, res, next) => {
        let result = validationResult(req)
        if (result.errors.length > 0) res.json({success: false, msg: result.errors.shift().msg})
        else next()
    }
}