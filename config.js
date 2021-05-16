const instructorRole = 'Instructor'
const groupOtherName = 'other'
const studentRole = 'Student'
const defaultFaculty = 'Khoa Công nghệ thông tin'
const allowMailDomain = '@student.tdtu.edu.vn'
const defaultAvatar = `/images/default.png`
module.exports = {
    adminAccount: {
        name: 'Admin',
        password: 'admin123',
        role: 'Admin',
        email: 'admin@email.com',
    },
    defaultAvatar,
    allowMailDomain,
    defaultFaculty,
    instructorRole,
    groupOtherName,
    studentRole,
    groupUser: [
        { name: groupOtherName, avatar: './image/logo.png' },
        { name: 'Phòng Công tác học sinh sinh viên (CTHSSV)' },
        { name: 'Phòng Đại học', avatar: './image/logo.png' },
        { name: 'Phòng Sau đại học', avatar: './image/logo.png' },
        { name: 'Phòng điện toán và máy tính', avatar: './image/logo.png' },
        { name: 'Phòng khảo thí và kiểm định chất lượng', avatar: './image/logo.png' },
        { name: 'Phòng tài chính', avatar: './image/logo.png' },
        { name: 'TDT Creative Language Center', avatar: './image/Logo-SDTC.png' },
        { name: 'Trung tâm tin học', avatar: './image/ttth.png' },
        { name: 'Trung tâm đào tạo phát triển xã hội (SDTC)', avatar: './image/ttnn.png' },
        { name: 'Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)', avatar: './image/logo.png' },
        { name: 'Trung tâm hợp tác doanh nghiệp và cựu sinh viên', avatar: './image/logo.png' },
        { name: 'Khoa Luật', avatar: './image/khoaluat.png' },
        { name: 'Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa', avatar: './image/logo.png' },
        { name: 'Viện chính sách kinh tế và kinh doanh', avatar: './image/logo.png' },
        { name: 'Khoa Mỹ thuật công nghiệp', avatar: './image/congnghemythuat.png' },
        { name: 'Khoa Điện – Điện tử', avatar: './image/khoa_dien.png' },
        { name: 'Khoa Công nghệ thông tin', avatar: './image/khoa_cntt.png' },
        { name: 'Khoa Quản trị kinh doanh', avatar: './image/khoa_quantrikinhdoanh.jpeg' },
        { name: 'Khoa Môi trường và bảo hộ lao động', avatar: './image/khoa_moitruong.jpeg' },
        { name: 'Khoa Lao động công đoàn', avatar: './image/logo.png' },
        { name: 'Khoa Tài chính ngân hàng', avatar: './image/khoa_tcnh.png' },
        { name: 'Khoa giáo dục quốc tế', avatar: './image/logo.png' },
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