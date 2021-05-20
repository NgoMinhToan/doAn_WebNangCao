const Post = require('../models/PostModel')
const Group = require('../models/GroupUserModel')
const {studentRole, instructorRole} = require('../config')

const notify = (req, res, uri, {code, error} )=>{
    req.flash('code', code || '')
    req.flash('error', error || '')
    return res.redirect(uri)
}

module.exports = {
    index: async (req, res) => {
        let success = req.flash('success')
        let msg = req.flash('msg')
        try {
            let count = await Post.countDocuments()
            return res.render('Notification', {data: {...req.session.passport.user, 
                ...req.user._doc}, flash: {success, msg}, numPost: count})
        } catch (e) {
            return res.render('Notification', {data: {...req.session.passport.user, 
            ...req.user._doc}, flash: {success: '-1', msg: e.toString()}})
        }
    },
    notifyDetail: async (req, res) => {
        let {postID} = req.params
        let success = req.flash('success')
        let msg = req.flash('msg')
        try {
            if(!postID) throw 'Không có postID'
            let post = await Post.findById(postID).populate('toGroup user mediaContent', '-password -authID')
            return res.render('NotificationDetail', {data: {...req.session.passport.user, 
                ...req.user._doc}, flash: {success, msg}, post})
        } catch (e) {
            return res.render('NotificationDetail', {data: {...req.session.passport.user, 
                ...req.user._doc}, flash: {success: '-1', msg: e.toString()}})
        }
    },
    faculty: (req, res) => {
        let success = req.flash('success')
        let msg = req.flash('msg')
        Group.find().exec()
        .then(data => {
            return res.render('Faculty', {data: {...req.session.passport.user, 
                ...req.user._doc}, flash: {success, msg}, faculty: data})
        })
        .catch(err => res.render('Faculty', {data: {...req.session.passport.user, 
            ...req.user._doc}, flash: {success: '-1', msg: err.toString()}, faculty: []}))
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
            
            return res.render('CreatePostNotification', {data: {...req.session.passport.user, 
                ...req.user._doc}, flash: {success, msg}, group})
        } catch (e) {
            return res.render('CreatePostNotification', {data: {...req.session.passport.user, 
                ...req.user._doc}, flash: {success: '-1', msg: e}})
        }
    },
    indexFaculty: async (req, res) => {
        let {groupID} = req.params
        let success = req.flash('success')
        let msg = req.flash('msg')
        try {
            let group = await Group.findById(groupID)
            let count = await Post.countDocuments({toGroup: groupID})
            console.log(count)
            return res.render('NotificationFaculty', {data: {...req.session.passport.user, 
                ...req.user._doc}, flash: {success, msg}, numPost: `${count}`, group})
        } catch (e) {
            return res.render('NotificationFaculty', {data: {...req.session.passport.user, 
            ...req.user._doc}, flash: {success: '-1', msg: e.toString()}})
        }
    }
}