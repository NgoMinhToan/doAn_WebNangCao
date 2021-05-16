const {check, validationResult} = require('express-validator')
const { exists } = require('../models/userModel')

const validToken = check('token').exists().withMessage('Không tìm thấy token').notEmpty().withMessage('Mã token không hợp lệ')

module.exports = {
    validToken,

    validator_login: [
        check('email').exists().withMessage('Vui lòng nhập Email người dùng')
        .notEmpty().withMessage('Không được để trống Email')
        .isEmail().withMessage('Email không đúng định dạng'),
    
        check('password').exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Không được để trống mật khẩu')
        .isLength({min: 6}).withMessage('Mật khẩu phải từ 6 ký tự')
    ],

    validator_register: [
        check('name').exists().withMessage('Vui lòng nhập tên người dùng')
        .notEmpty().withMessage('Không được để trống tên người dùng'),

        check('email').exists().withMessage('Vui lòng nhập Email người dùng')
        .notEmpty().withMessage('Không được để trống Email')
        .isEmail().withMessage('Email không đúng định dạng'),
    
        check('password').exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Không được để trống mật khẩu')
        .isLength({min: 6}).withMessage('Mật khẩu phải từ 6 ký tự'),

        check('rePassword').exists().withMessage('Vui lòng nhập xác nhận mật khẩu')
        .notEmpty().withMessage('Chưa nhập xác nhận mật khẩu')
        .custom((value, {req}) => {
            if (req.body.password !== value){
                throw new Error('Mật khẩu không khớp')
            }else
                return true
        }),

        check('groupID').exists().withMessage('Chưa chọn phòng ban')
        .notEmpty().withMessage('Vui lòng chọn phòng ban'),

    ],

    validCreatePost: [
        validToken,
        check('title').exists().withMessage('Không tìm thấy tiêu đề')
        .notEmpty().withMessage('Tiêu để bài viết không được để trống'),
    
        check('content').exists().withMessage('Không tìm thấy nội dung bài viết')
        .notEmpty().withMessage('Nội dung bài viết không được để trống')
        .isLength({min: 3}).withMessage('Nội dung phải có tối thiểu 3 ký tự'),
        
        check('group').exists().withMessage('Không tìm thấy nhóm chỉ định')
        .notEmpty().withMessage('Id nhóm không được để trống'),
    ],
    validGetPost: [
        validToken,
        check('page').exists().withMessage('Không tìm thấy số trang')
        .notEmpty().withMessage('Số trang không được để trống')
        .isInt().withMessage('Số trang không phải số nguyên'),
    
        check('quantity').default(10)
        .isInt().withMessage('Quantity không phải số nguyển')
    ],
    validCreateComment: [
        validToken,
        check('postID').exists().withMessage('Không tìm id bài viết')
        .notEmpty().withMessage('Id bài viết không được để trống'),

        check('content').exists().withMessage('Không tìm thấy nội dung comment')
        .notEmpty().withMessage('Nội dung comment không được để trống')
        .isLength({min: 3}).withMessage('Nội dung phải có tối thiểu 3 ký tự'),
    ],
    validChangeInfo: [
        validToken,
        check('name').exists().withMessage('Vui lòng nhập tên người dùng')
        .notEmpty().withMessage('Không được để trống tên người dùng'),

        check('faculty').exists().withMessage('Vui lòng nhập Khoa')
        .notEmpty().withMessage('Không được để trống trường Khoa'),
    ],
    validChangePassword: [
        validToken,
        check('password').exists().withMessage('Vui lòng nhập mật khẩu mới')
        .notEmpty().withMessage('Không được để trống mật khẩu')
        .isLength({min: 6}).withMessage('Mật khẩu phải từ 6 ký tự'),

        check('rePassword').exists().withMessage('Vui lòng nhập xác nhận mật khẩu')
        .notEmpty().withMessage('Chưa nhập xác nhận mật khẩu')
        .custom((value, {req}) => {
            if (req.body.password !== value){
                throw new Error('Mật khẩu không khớp')
            }else
                return true
        }),
    ]
    
}