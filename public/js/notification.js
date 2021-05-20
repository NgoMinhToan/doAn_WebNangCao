const loadNotification = async (data) => {
    let notifications = await getNotifications(data.token, {...data})
    if (notifications.error === 'TokenExpiredError: jwt expired') window.location.replace("../")
    console.log('Load thông báo: ')
    console.log(notifications)
    notifications = notifications.data
    notifications = notifications.filter(f => f.toGroup != null || (f.user != null && f.user.role == 'Admin'))

    $('#listItem').empty()
    notifications.forEach(async e => {
        let notif = createNotificationHtml({
            name: e.toGroup != null ? e.toGroup.name : e.user.role,
            time: getTime(e.timeStamp),
            title: e.title,
            content: e.content.slice(0, 150)+' ...',
            postID: e._id
        })
        $('#listItem').append(notif)
    })
}
const createNotificationHtml = ({name, title, content, time, postID}) => {
    return `<div class="card mb-4">
                <h5 class="card-header">${name}</h5>
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${content}</p>
                    <a href="/notification/detail/${postID}" class="btn btn-primary">Mở liên kết</a>
                </div>
                <div class="card-footer">${time}</div>
            </div>`
}
const loadPagination = (data, quantity) => {
    $('#pagination').empty()
    $('#pagination').append($(`<li class="page-item"><a class="page-link" href="#" tabindex="-1">Previous</a></li>`))
    let numPage = Math.ceil(data.numpost / quantity)
    for(i=1;i<=numPage;i++){
        $('#pagination').append($(`<li class="page-item"><a class="page-link" href="#">${i}</a></li>`))
    }
    $('#pagination').append($(`<li class="page-item"><a class="page-link" href="#">Next</a></li>`))
    return numPage
}
window.onload = async () => {
    let data = getData()
    console.log(data)
    let currentPage = 1
    let lastPage = 1
    let quantity = 10
    const checkActive = () => {
        if(numPage == 0){
            $($('.page-item')[0]).addClass('disabled')
            $($('.page-item')[numPage+1]).addClass('disabled')
            return
        }
        if(currentPage == 1){
            $($('.page-item')[0]).addClass('disabled')
        }
        else{
            $($('.page-item')[0]).removeClass('disabled')
        }
        if(currentPage == numPage){
            $($('.page-item')[numPage+1]).addClass('disabled')
        }
        else{
            $($('.page-item')[numPage+1]).removeClass('disabled')
        }
        $($('.page-item')[lastPage]).removeClass('active')
        $($('.page-item')[currentPage]).addClass('active')
    }
    let numPage = loadPagination(data, quantity)
    console.log(numPage)
    if (numPage != 0){
        loadNotification({token: data.token, quantity, page: currentPage})
        checkActive()
        // get number of data here
        $('.page-item').click((e) => {
            if(! $(e.target).hasClass('disabled')){
                let value = $(e.target).text().match(/\w+/)[0].toLowerCase()
                lastPage = currentPage
                if(value === 'previous'){
                    currentPage--
                }
                else if(value === 'next'){
                    currentPage++
                }
                else{
                    currentPage = +value
                }
                checkActive()
                loadNotification({token: data.token, quantity, page: currentPage})
            }
        })
    }
    
}