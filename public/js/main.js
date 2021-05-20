// var dropdown = document.getElementsByClassName("dropdown-btn");
// var i;

// for (i = 0; i < dropdown.length; i++) {
//     dropdown[i].addEventListener("click", function() {
//         this.classList.toggle("active");
//         var dropdownContent = this.nextElementSibling;
//         if (dropdownContent.style.display === "block") {
//             dropdownContent.style.display = "none";
//         } else {
//             dropdownContent.style.display = "block";
//         }
//     });
// }

// $(document).ready(function() {
//     $("#input-b9").fileinput({
//         showPreview: false,
//         showUpload: false,
//         elErrorContainer: '#kartik-file-errors ',
//         allowedFileExtensions: ["jpg", "png", "gif"]
//             //uploadUrl: '/site/file-upload-single '
//     });
// });



const createPostOption = (allow, token, postID) => {
    if (!allow ) return ''
    return `<div>
        <div class="dropdown">
            <button class="btn btn-link dropdown-toggle" type="button" id="gedf-drop1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-ellipsis-h"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="gedf-drop1">
                <a class="dropdown-item" onclick="editPost('${token}', '${postID}')" href="#edit">Chỉnh sửa</a>
                <a class="dropdown-item" onclick="delPost('${token}', '${postID}')" href="#delete">Xoá</a>
            </div>
        </div>
    </div>`
}
const createPostHtml = ({name, avatar, title, content, myAvatar, userID, myUserID, postID, timeStamp, token, comment, mediaContent}) => {
    return `<div class="card gedf-card">
        <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="mr-2">
                        <img class="rounded-circle" width="45" src="${avatar.startsWith("http") ? avatar : `./${avatar}`}" alt="">
                    </div>
                    <div class="ml-2">
                        <div class="h7 text-muted">${name.replace(/\w/, match => match.toUpperCase())}</div>
                    </div>
                </div>
                <!-- Tuy chon cho mo post -->
                ${createPostOption(userID == myUserID, token, postID)}
            </div>
        </div>
        <div class="card-body">
            <div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i> ${getTime(timeStamp)}</div>
            <a class="card-link" href="#">
                <h5 class="card-title">${title.replace(/\w/, match => match.toUpperCase())}</h5>
            </a>
            <p class="card-text">${content.replace(/\w/, match => match.toUpperCase())}</p>

            ${createEmberHtml(mediaContent)}
            


        </div>
        <!-- Phan comment -->
        <div class="card-footer">
            <button type="button" class="btn" data-toggle="collapse" data-target="#comment${postID}"><a href="#" class="card-link"><i class="fa fa-comment"></i> Comment</a></button>
            <div id="comment${postID}" class="collapse comment">
                <hr />
                ${createCommentHtml(comment)}
                <hr />
                <div class="post-comment">
                    <img src="${myAvatar.startsWith("http") ? myAvatar : `./${myAvatar}`}" alt="" class="profile-photo-sm comment_avt">
                    <input type="text" id="commentContent-${postID}" class="form-control comment_input" placeholder="Post a comment">
                    <button type="submit" class="btn btn-profile btn-info btn-commentsibmit" onclick="sendComment('${token}', '${postID}')">Gửi</button>
                </div>

            </div>
        </div>
    </div><br>`
}
const sendComment = async (token, postID) => {
    let content = document.getElementById(`commentContent-${postID}`).value
    let {error, data} = await createComment(token, {postID, content})
    console.log(error)
    console.log(data)
    document.getElementById(`commentContent-${postID}`).value = ''

}
const createEmberHtml = (mediaContent) => {
    mediaContent = mediaContent.filter(f => f.type != 'video' || (new RegExp(/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/).test(f.uri)))
    let html = ''
    mediaContent.forEach(e => {
        if(e.type == 'image'){
            html += `<p class="card-text">
                        <br><br>
                        <img width="100%" height="450" src="${e.uri}">
                    </p>`
        }
        else{
            html += `<p class="card-text" style="position:relative;padding-top:56.25%;">
                        <br><br>
                        <iframe frameborder="0" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" src="${e.uri.replace('watch?v=', 'embed/')}"></iframe>
                    </p>`
        }
    })
    return html
}
const createCommentHtml = (commentList) => {
    let html = ''
    commentList.forEach(e => {
        html += `<div class="post-comment">
                    <img src="${e.user.avatar.startsWith("http") ? e.user.avatar : `./${e.user.avatar}`}" alt="${e.user.name}" class="profile-photo-sm">
                    <p class="noidung_comment"><a href="timeline.html" class="profile-link">${e.user.name} </a><i class="em em-laughing"></i> ${e.content} </p>
                </div>`
    })
    return html
}
const delPost = async (token, postID) => {
    if(!confirm('Bạn có muốn xóa bài đăng này không')) return
    console.log(token)
    console.log(postID)
    let {error, data} = await deletePost(token, {postID})
    console.log(data)
    if (error) $.notify(error, "error");
    else $.notify('Đã xóa thành công', "success");
    // location.reload()
    $(`.${postID}`).html('')
}
const editPost = () => {
    $.notify('Chức năng chưa được thực hiện', "warn");
}
const createNotificationHtml = ({name, time, title, content, postID}) => {
    return `<div class="card gedf-card">
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-muted">[${name}]</h6>
                    <h6 class="card-subtitle mb-2 text-muted card-subtitle-date">${time}</h6>
                    <hr />
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${content}</p>
                    <a href="./notification/detail/${postID}" class="card-link">Xem thông báo</a>
                </div>
            </div>`
}
let page = 1
const loadMorePost = async (data, indexInterval) => {
    let currentScroll = document.documentElement.scrollTop
    if(document.documentElement.scrollHeight - window.innerHeight - window.pageYOffset < 100){
        console.log('Load bài đăng')
        $.notify('Load bài đăng mới', "info");
        let allPost = (await getPosts(data.token, {quantity: 2, page: page++}))
        if (allPost.error === 'TokenExpiredError: jwt expired') document.location.reload()
        console.log(allPost)

        allPost = allPost.data
        if(allPost.length === 0) {
            console.log('Dừng Load do hết bài đăng')
            asyncIntervals[indexInterval] = false
        }

        allPost = allPost.filter(f => f.user != null)

        allPost.forEach(async e => {
            let post = document.createElement('div')
            post.className = e._id
            let comment = (await getComment(data.token, {postID: e._id})).data

            console.log('Load comment: ')
            console.log(comment)
            post.innerHTML = createPostHtml({
                name: e.user.name,
                avatar: e.user.avatar,
                title: e.title,
                content: e.content,
                myAvatar: data.avatar,
                userID: e.user._id,
                myUserID: data.id,
                postID: e._id,
                timeStamp: e.timeStamp,
                token: data.token,
                comment: comment,
                mediaContent: e.mediaContent,
            })
            
            console.log('Load file phương tiện')
            console.log(e.mediaContent)
            PostList.appendChild(post)
        })
    }

    document.documentElement.scrollTop = currentScroll
}
const configSocket = (id) => {
    // Socket cho client
    const socket = io()
    socket.on('connect', function (){
        socket.emit('setUser', id)
        socket.on('post', doc => {
            // console.log(doc)
            let data = getData()
            let post = document.createElement('div')
            post.className = doc._id
            let comment = []
            console.log(comment)
            post.innerHTML = createPostHtml({
                name: doc.user.name,
                avatar: doc.user.avatar,
                title: doc.title,
                content: doc.content,
                myAvatar: data.avatar,
                userID: doc.user._id,
                myUserID: data.id,
                postID: doc._id,
                timeStamp: doc.timeStamp,
                token: data.refreshtoken,
                comment: comment,
                mediaContent: doc.mediaContent,
            })
            $('#PostList').prepend(post)
        })
        socket.on('comment', doc => {
            // console.log(doc)
            let postID = doc.post._id
            let parent = $(`#comment${postID} .post-comment`)
            $(parent[0]).parent().prepend( $(createCommentHtml([doc]))[0] )

        })
    })
}
const loadNotification = async (data) => {
    let notifications = await getNotifications(data.token, {quantity: 10, page: 1})
    console.log('Load thông báo: ')
    console.log(notifications)
    notifications = notifications.data
    notifications = notifications.filter(f => f.toGroup != null || (f.user != null && f.user.role == 'Admin'))
    notifications.forEach(async e => {
        let notif = createNotificationHtml({
            name: e.toGroup != null ? e.toGroup.name : e.user.role,
            time: getTime(e.timeStamp),
            title: e.title,
            content: e.content.slice(0, 50)+' ...',
            postID: e._id
        })
        $('#notificationList').append(notif)
    })
}
const loadPostModal = async (data) => {
    let {refreshtoken: token, id, role} = data
    console.log(token)

    let {error: errorGetGroup, data: listGroup} = await getGroup(token)
    console.log(`Error: ${errorGetGroup}`)
    if(errorGetGroup.length > 0){
        $.notify(errorGetGroup, "error");
        return
    }
    if(role == 'Student'){
        listGroup = [listGroup[0]]
    }
    else if(role == 'Instructor'){
            listGroup = listGroup.filter(f => f.leader == id)
        }
    console.log(listGroup)
    listGroup = listGroup.map(m => ({name: m.name, id: m._id}))
    for(i in listGroup){
        let element = document.createElement("option")
        if(i == 0){
            element.selected = true
        }
        element.setAttribute('value', listGroup[i].id)
        element.innerHTML = listGroup[i].name
        $('#group').append(element)
    }
    

    let video = []
    $('#add_video').click(async e =>{
        let link = prompt('Vui lòng thêm đường link youtube: ')
        if ((new RegExp(/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/).test(link))){
            $('#link_videos').append(link, document.createElement("br"))
            video.push(link)
        }
        else{
            alert('Link không đúng định dạng')
        }
    })
    
    $('#btn_submit').click(async e =>{
        let title = document.getElementById('title').value
        let content = document.getElementById('content').value
        let group = document.getElementById('group').value

        let uploadFile = document.getElementById('image')
        let image = uploadFile.files
        let {error: errorCreate, data: res} = await createPost(token, {title, content, video, group, image})
        if(errorCreate.length > 0){
            console.log(`Error: ${errorCreate}`)
            $.notify(errorCreate, "error");
        }
        if(!res.success){
            console.log(`Error: ${res.msg}`)
            $.notify(res.msg, "error");
        }
        else{
            console.log(res)
            $('#PostModal').modal('hide')
            $.notify(res.msg, "success");
        }
    })
}
window.onload = async () => {
    let data = getData()
    let {success, msg} = data
    if(success=='-1') $.notify(msg, "error");
    else $.notify(msg, "success");
    
    configSocket(data.id)
    setIntervalAsync(loadMorePost, data, 2000)

    await loadNotification(data)
    await loadPostModal(data)
    $('#createModel').click(() => {
        $('#PostModal').modal('show')
    })
    $('#cancelPost').click(() => {
        $('#PostModal').modal('hide')
        $.notify('Đã hủy bài đăng', "info");
    })
}
