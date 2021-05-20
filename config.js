const instructorRole = 'Instructor'
const groupOtherName = 'Other'
const studentRole = 'Student'
const defaultFaculty = 'Khoa Công nghệ thông tin'
const allowMailDomain = '@student.tdtu.edu.vn'
const defaultAvatar = `/imagess/default.png`
module.exports = {
    adminAccount: {
        name: 'Admin',
        password: 'admin123',
        role: 'Admin',
        email: 'admin@email.com',
    },
    googleClientID: '314576777241-3abojgg1pf1e28gt9bltn7r7pfe51sie.apps.googleusercontent.com',
    googleClientSecret: 'HHZGRMgXkwnO7M89U4cLLMDf',
    
    defaultAvatar,
    allowMailDomain,
    defaultFaculty,
    instructorRole,
    groupOtherName,
    studentRole,
    groupUser: [
        { name: groupOtherName, avatar: '/images/logo.png' },
        { name: 'Phòng Công tác học sinh sinh viên (CTHSSV)' },
        { name: 'Phòng Đại học', avatar: '/images/logo.png' },
        { name: 'Phòng Sau đại học', avatar: '/images/logo.png' },
        { name: 'Phòng điện toán và máy tính', avatar: '/images/logo.png' },
        { name: 'Phòng khảo thí và kiểm định chất lượng', avatar: '/images/logo.png' },
        { name: 'Phòng tài chính', avatar: '/images/logo.png' },
        { name: 'TDT Creative Language Center', avatar: '/images/Logo-SDTC.png' },
        { name: 'Trung tâm tin học', avatar: '/images/ttth.png' },
        { name: 'Trung tâm đào tạo phát triển xã hội (SDTC)', avatar: '/images/ttnn.png' },
        { name: 'Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)', avatar: '/images/logo.png' },
        { name: 'Trung tâm hợp tác doanh nghiệp và cựu sinh viên', avatar: '/images/logo.png' },
        { name: 'Khoa Luật', avatar: '/images/khoaluat.png' },
        { name: 'Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa', avatar: '/images/logo.png' },
        { name: 'Viện chính sách kinh tế và kinh doanh', avatar: '/images/logo.png' },
        { name: 'Khoa Mỹ thuật công nghiệp', avatar: '/images/congnghemythuat.png' },
        { name: 'Khoa Điện – Điện tử', avatar: '/images/khoa_dien.png' },
        { name: 'Khoa Công nghệ thông tin', avatar: '/images/khoa_cntt.png' },
        { name: 'Khoa Quản trị kinh doanh', avatar: '/images/khoa_quantrikinhdoanh.jpeg' },
        { name: 'Khoa Môi trường và bảo hộ lao động', avatar: '/images/khoa_moitruong.jpeg' },
        { name: 'Khoa Lao động công đoàn', avatar: '/images/logo.png' },
        { name: 'Khoa Tài chính ngân hàng', avatar: '/images/khoa_tcnh.png' },
        { name: 'Khoa giáo dục quốc tế', avatar: '/images/logo.png' },
    ],
    token: {
        secretKey: 'mabimat',
        option: { expiresIn: '10m' },
    },
    refreshToken: {
        secretKey: 'mabimat',
        option: { expiresIn: '10h' },
    }

}