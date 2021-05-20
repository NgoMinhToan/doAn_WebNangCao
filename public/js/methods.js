let link = window.location.hostname
let port = 3000
if(link=='localhost') link = `http://${link}:${port}`
else link = `https://${link}`
// Lây data
const getData = (name = 'data') => {
    let element = document.getElementsByClassName(name)
    let data = {}
    for (i = 0; i < element.length; i++) {
        data = {
            ...data,
            ...JSON.parse(JSON.stringify(element[i].dataset))
        }
    }
    return data
}
// GỌi comment cua baii dang
const getComment = async (token = {}, {postID}) => {
    let url = `${link}/api/post/${postID}/get_comments`
    return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token})
        })
        .then(json => json.json())
        .then(json => {
            if (json.success) return {error: '', data: json.result}
            else return {error: json.msg, data: []}
        })
        .catch(err => ({error: err, data: []}))
}
// GỌi api lấy tất cả bài đăng
const getAllPost = async (token = {}) => {
    let url = `${link}/api/post/get_all_posts`
    return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token})
        })
        .then(json => json.json())
        .then(json => {
            if (json.success) return {error: '', data: json.result}
            else return {error: json.msg, data: []}
        })
        .catch(err => ({error: err, data: []}))
}
// lấy 1 bài đăng cụ thể, được dùng trong trường hợp nhấn vào 1 thông báo cụ thể
const getPost = async (token = {}, postID) => {
    let url = `${link}/api/post/${postID}`
    return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token})
        })
        .then(json => json.json())
        .then(json => {
            if(json.success) return {error: '', data: json.result}
            else return {error: json.msg, data: {}}
        })
        .catch(err => ({error: err, data: {}}))
}
// lấy vai bai dang
const getPosts = async (token = {}, {quantity, page}) => {
    let url = `${link}/api/post/get_posts`
    return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token, quantity, page})
        })
        .then(json => json.json())
        .then(json => {
            if(json.success) return {error: '', data: json.result}
            else return {error: json.msg, data: {}}
        })
        .catch(err => ({error: err, data: {}}))
}
// lấy thong bao
const getNotifications = async (token = {}, {quantity, page}) => {
    let url = `${link}/api/post/get_important_posts`
    return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token, quantity, page})
        })
        .then(json => json.json())
        .then(json => {
            if(json.success) return {error: '', data: json.result}
            else return {error: json.msg, data: {}}
        })
        .catch(err => ({error: err, data: {}}))
}
// lấy thong bao phong ban
const getFacultyNotifications = async (token = {}, {quantity, page, groupID}) => {
    console.log('call faculty notification')
    let url = `${link}/api/post/get_important_faculty_posts`
    return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token, quantity, page, groupID})
        })
        .then(json => json.json())
        .then(json => {
            if(json.success) return {error: '', data: json.result}
            else return {error: json.msg, data: {}}
        })
        .catch(err => ({error: err, data: {}}))
}
// tạo bài đăng
const createPost = async (token = {}, {title, content, group, video, image}) => {
    let url = `${link}/api/post/create`

    let form =  new FormData()
    form.set('token', token)
    form.set('title', title)
    form.set('content', content)
    form.set('group', group)
    for(i=0;i<video.length;i++)
        form.append('video', video[i])
    for(i=0;i<image.length;i++)
        form.append('image', image[i])

    return fetch(url, {
            method: 'PUT',
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // },
            body: form
        })
        .then(json => json.json())
        .then(json => ({error: '', data: json}))
        .catch(err => ({error: err, data: {}}))
}
// tạo comment
const createComment = async (token = {}, {content, postID, video = [], image = []}) => {
    let url = `${link}/api/comment/create`

    let form =  new FormData()
    form.set('token', token)
    form.set('content', content)
    form.set('postID', postID)
    for(i=0;i<video.length;i++)
        form.append('video', video[i])
    for(i=0;i<image.length;i++)
        form.append('image', image[i])

    return fetch(url, {
            method: 'PUT',
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // },
            body: form
    })
    .then(json => json.json())
    .then(json => ({error: '', data: json}))
    .catch(err => ({error: err, data: {}}))
}
// Cập nhật bài đăng
const updatePost = async (token = {}, {title, content, group, video, image, postID, oldContentList}) => {
    let url = `${link}/api/post/update/${postID}`

    let form =  new FormData()
    form.set('token', token)
    form.set('title', title)
    form.set('content', content)
    form.set('group', group)
    for(i=0;i<video.length;i++)
        form.append('video', video[i])
    for(i=0;i<image.length;i++)
        form.append('image', image[i])
    for(i=0;i<oldContentList.length;i++)
        form.append('oldMediaContent', oldContentList[i])

    return fetch(url, {
            method: 'PUT',
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // },
            body: form
        })
        .then(json => json.json())
        .then(json => ({error: '', data: json}))
        .catch(err => ({error: err, data: {}}))
}

const deletePost = async (token = {}, {postID}) => {
    let url = `${link}/api/post/delete/${postID}`

    return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token})
        })
        .then(json => json.json())
        .then(json => ({error: '', data: json}))
        .catch(err => ({error: err, data: {}}))
}
// Lấy tất cả các nhóm
const getGroup = async (token = {}) => {
    let url = `${link}/api/getGroups`
    return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token})
        })
        .then(json => json.json())
        .then(json => {
            if (json.success) return {error: '', data: json.result}
            else return {error: json.msg, data: []}
        })
        .catch(err => ({error: err, data: []}))
}

const asyncIntervals = []
const setIntervalAsync = (cb, data, time) => {
    if(cb && typeof cb === 'function'){
        let index = asyncIntervals.length
        asyncIntervals.push(true)
        runInterval(cb, data, time, index)
        return index
    }
    else throw new Error('Not a function')
}

const runInterval = async (cb, data, time, index) => {
    await cb(data, index)
    if(asyncIntervals[index]){
        setTimeout(() => runInterval(cb, data, time, index), time)
    }
}

// const getTime = (timeStamp) => {
//     let timeStr = ''
//     let date = new Date(timeStamp)
//     let now = new Date(Date.now())
//     if (now.getFullYear() - date.getFullYear() > 0){
//         timeStr += `${now.getFullYear() - date.getFullYear()} năm trước`
//     }
//     else if (now.getMonth() - date.getMonth() > 0){
//         timeStr += `${now.getMonth() - date.getMonth()} tháng trước`
//     }
//     else if (now.getDate() - date.getDate() > 0){
//         timeStr += `${now.getDate() - date.getDate()} ngày trước`
//     }
//     else if (now.getHours() - date.getHours() > 0){
//         timeStr += `${now.getHours() - date.getHours()} giờ trước`
//     }
//     else if (now.getMinutes() - date.getMinutes() > 0){
//         timeStr += `${now.getMinutes() - date.getMinutes()} phút trước`
//     }
//     else{
//         timeStr += `${now.getSeconds() - date.getSeconds()} giây trước`
//     }
//     return  timeStr
// }
const getTime = (timeStamp) => {
    let timeStr = ''
    let time = new Date(new Date(Date.now()).getTime() - new Date(timeStamp).getTime())
    let start = new Date(0)
    if (time.getFullYear() - start.getFullYear() > 0){
        timeStr += `${time.getFullYear() - start.getFullYear()} năm trước`
    }
    else if (time.getMonth() - start.getMonth() > 0){
        timeStr += `${time.getMonth() - start.getMonth()} tháng trước`
    }
    else if (time.getDate() - start.getDate() > 0){
        timeStr += `${time.getDate() - start.getDate()} ngày trước`
    }
    else if (time.getHours() - start.getHours() > 0){
        timeStr += `${time.getHours() - start.getHours()} giờ trước`
    }
    else if (time.getMinutes() - start.getMinutes() > 0){
        timeStr += `${time.getMinutes() - start.getMinutes()} phút trước`
    }
    else{
        timeStr += `${time.getSeconds() - start.getSeconds()} giây trước`
    }
    return  timeStr
}