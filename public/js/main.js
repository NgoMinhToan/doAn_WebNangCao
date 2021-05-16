var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    });
}

$(document).ready(function() {
    $("#input-b9").fileinput({
        showPreview: false,
        showUpload: false,
        elErrorContainer: '#kartik-file-errors ',
        allowedFileExtensions: ["jpg", "png", "gif"]
            //uploadUrl: '/site/file-upload-single '
    });
});


// window.onload = async () => {
//     let data = getData()
//     let allPost = await getAllPost(data.token)
//     console.log(allPost)
//     // PostList
//     allPost.forEach(e => {
//         let post = document.createElement('div')
//         post.className = e._id

//         PostList.appendChild(post)
//     })
// }