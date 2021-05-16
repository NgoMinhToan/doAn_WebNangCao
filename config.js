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
        {name: groupOtherName, avatar: './image/logo.png'},
        {name: 'Phòng Công tác học sinh sinh viên (CTHSSV)'},
        {name: 'Phòng Đại học'},
        {name: 'Phòng Sau đại học'},
        {name: 'Phòng điện toán và máy tính'},
        {name: 'Phòng khảo thí và kiểm định chất lượng'},
        {name: 'Phòng tài chính'},
        {name: 'TDT Creative Language Center'},
        {name: 'Trung tâm tin học'},
        {name: 'Trung tâm đào tạo phát triển xã hội (SDTC)'},
        {name: 'Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)'},
        {name: 'Trung tâm hợp tác doanh nghiệp và cựu sinh viên'},
        {name: 'Khoa Luật'},
        {name: 'Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa'},
        {name: 'Viện chính sách kinh tế và kinh doanh'},
        {name: 'Khoa Mỹ thuật công nghiệp'},
        {name: 'Khoa Điện – Điện tử'},
        {name: 'Khoa Công nghệ thông tin'},
        {name: 'Khoa Quản trị kinh doanh'},
        {name: 'Khoa Môi trường và bảo hộ lao động'},
        {name: 'Khoa Lao động công đoàn'},
        {name: 'Khoa Tài chính ngân hàng'},
        {name: 'Khoa giáo dục quốc tế'},
    ],
    token: {
        secretKey: 'mabimat',
        option: {expiresIn: '10m'},
    },
    refreshToken: {
        secretKey: 'mabimat',
        option: {expiresIn: '10h'},
    }

}