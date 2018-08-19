$(function() {
    //  rem模板
    document.querySelector('html').style.fontSize = screen.width / 10 + 'px';

    //底部的返回顶部添加点击事件,需要给button加类setTop
    $(".footer,.page .setTop").click(function() {
        $('body,html').animate({ scrollTop: 0 }, 500);
    })
})