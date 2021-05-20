const messModel = require('./models/MessageModel')
// Cấu hình socket
class ConfigSocket {
    static http = require('http')
    static server
    static io
    static usersOnline = {}
    static config(app) {
        this.server = this.http.createServer(app)
        this.io = require('socket.io')(this.server)
        this.io.on('connection', (socket) => {
            socket.on('setUser', (_userID)=>{
                this.usersOnline[socket.id] = _userID
            })
            // Nhận được thông tin ngắt kết nối, cập nhật lại danh sách người dùng online
            socket.on('disconnect', ()=>{
                delete this.usersOnline[socket.id]
            })
        })
        return this.server
    }
    static notify(type, data){
        try {
            this.io.emit(type, data)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = ConfigSocket


// socket cung cấp 2 methods chính là .on và .emit, trong đó:
// .on('event', callback): để lắng nghe sự kiện 'event' và trả về callback
// .emit('event', data): để gủi đi sự kiện 'event' và data

// khi nhận được sự kiện, data sẽ được đưa vào callback để xử lý

// Có 2 sự kiện chính luôn được gọi khi kết nối đến client là 'connection' và 'disconnect'
// Khi handle 'connection', data sẽ là socket riêng đến một client đã kết nối
// Khi handle 'disconnect' báo hiệu người dùng đã ngắt kết nối khỏi socket
