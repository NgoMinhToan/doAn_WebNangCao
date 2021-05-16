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
    let url = `http://localhost:3000/api/post/${postID}/get_comments`
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
    let url = 'http://localhost:3000/api/post/get_all_posts'
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
    let url = `http://localhost:3000/api/post/${postID}`
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
// tạo bài đăng
const createPost = async (token = {}, {title, content, group, video, image}) => {
    let url = `http://localhost:3000/api/post/create`

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
    let url = `http://localhost:3000/api/comment/create`

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
    let url = `http://localhost:3000/api/post/update/${postID}`

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
    let url = `http://localhost:3000/api/post/delete/${postID}`

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
    let url = 'http://localhost:3000/api/getGroups'
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


