$(function() {

    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

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

    //给导航栏的更多添加点击事件
    $(".getindexmenu").on("click", "div:nth-child(8)", function() {
        $("div:nth-child(n+9)").slideToggle();
    })

    //链接省钱控
    $(".getindexmenu").on("click", "div:nth-child(2)", function() {
        location.href = "qzk-getmoneyctrl.html";
    });

    //链接白菜价
    $(".getindexmenu").on("click", "div:nth-child(4)", function() {
        location.href = "bargain.html";
    });

    //链接海海折扣
    $(".getindexmenu").on("click", "div:nth-child(5)", function() {
        location.href = "http://www.liebiao.com/fuzhuangxiangbao/s-haihaitongzhuangshekoujiameng/";
    });

    //链接优惠券
    $(".getindexmenu").on("click", "div:nth-child(6)", function() {
        location.href = "discounts.html";
    });

    //链接历史价格查询
    $(".getindexmenu").on("click", "div:nth-child(7)", function() {
        location.href = "pricehistory.html";
    });

    //链接凑单价
    $(".getindexmenu").on("click", "div:nth-child(9)", function() {
        location.href = "item.html";
    });

    //链接口碑排行
    $(".getindexmenu").on("click", "div:nth-child(10)", function() {
        location.href = "http://m.maigoo.com/maigoo/4778wm_index.html";
    });

    $(".getindexmenu").on("click", "div:nth-child(11)", function() {
        location.href = "commodity.html";
    });

    //链接品牌大全
    $(".getindexmenu").on("click", "div:nth-child(12)", function() {
        location.href = "pingpaidaquan1.html";
    });

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