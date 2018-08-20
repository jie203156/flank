$(function() {

    //给导航栏的更多添加点击事件
    $(".getindexmenu").on("click", "div:nth-child(8)", function() {
        $("div:nth-child(n+9)").slideToggle();
    })


    //导航栏
    $.ajax({
        url: "http://mmb.ittun.com/api/getindexmenu",
        dataType: "json",
        success: function(result) {
            console.log(result);

            var html = template('getmenu', result);
            $('.getindexmenu').html(html);

        }
    })

    //商品列表
    $.ajax({
        url: "http://mmb.ittun.com/api/getmoneyctrl",
        dataType: "json",
        success: function(res) {
            console.log(res);

            var htmlstr = template("productlist", res);
            $(".products ul").html(htmlstr);
        }
    })



})