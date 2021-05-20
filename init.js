// Cấu hình admin nếu chưa tồn tại
const userModel = require('./models/UserModel')
const {adminAccount, groupUser} = require('./config')
userModel.find({name: 'Admin', role: 'Admin'}).exec()
.then(u =>{
    if(u.length == 0){
        return new userModel(adminAccount)
    }
    else throw 'Admin đã được tạo'
})
.then(u => u.save((err, new_u) => {
    if(err) throw err
    if(new_u == u){
        console.log('Tạo mới tài khoản Admin thành công !')
    }
}))
.catch(err => {
    console.log(err)
})

// Thêm các phòng ban nếu chưa tồn tại
const groupUserModel = require('./models/GroupUserModel')
groupUserModel.find().exec()
.then(u => {
    if (u.length == 0){
        groupUserModel.insertMany(groupUser, (err, docs) => {
            if(err) throw err
            if(groupUser.length == docs.length){
                console.log(docs)
                console.log('Tạo mới nhóm thành công !')
            }
        })
    }
})
.catch(err => {
    console.log(err)
})


