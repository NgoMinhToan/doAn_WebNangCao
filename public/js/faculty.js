window.onload = async () => {
    $('.list-item').css({'height': `${Math.max.apply(null, $('.list-item').map(function() {return $(this).height()}).get())}px`})
    // $(window).resize(() => $('.list-item').css({'height': `${Math.max.apply(null, $('.list-item').map(function() {return $(this).height()}).get())}px`}))
}